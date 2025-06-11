import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateMealPlan } from '@/lib/claude';
import { checkUserGenerationLimit, incrementUserGeneration } from '@/lib/usage-tracking';
import { prisma } from '@/lib/db';
import { generateMealPlanPDF } from '@/lib/pdf';

export const maxDuration = 120; // Maximum duration for Vercel serverless functions (in seconds)

interface RequestBody {
  dietaryRestrictions: string[];
  preferences: string[];
  seasonalFocus: string;
  servingsPerMeal: number;
  budget?: string;
  generatePDF?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id as string;
    
    // Check if user is premium - meal plans might be premium-only feature
    const isPremium = session?.user?.subscriptionTier === 'PREMIUM';
    
    // For free users, check if this feature is available
    if (!isPremium) {
      // Meal plans are a premium feature
      return NextResponse.json(
        { 
          error: 'Meal plan generation is a premium feature. Please upgrade your subscription to access this feature.',
          premiumRequired: true
        },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json() as RequestBody;
    
    // Validate required parameters
    if (!body.seasonalFocus || !body.servingsPerMeal) {
      return NextResponse.json(
        { error: 'Missing required parameters. Please provide seasonalFocus and servingsPerMeal.' },
        { status: 400 }
      );
    }
    
    // Generate meal plan
    const mealPlan = await generateMealPlan({
      dietaryRestrictions: body.dietaryRestrictions || [],
      preferences: body.preferences || [],
      seasonalFocus: body.seasonalFocus,
      servingsPerMeal: body.servingsPerMeal,
      budget: body.budget,
      isPremium
    });
    
    // Generate PDF if requested (default to true for meal plans)
    let pdfUrl: string | undefined;
    if (body.generatePDF !== false) {
      try {
        pdfUrl = await generateMealPlanPDF({
          mealPlan,
          userId,
          seasonalFocus: body.seasonalFocus,
        });
      } catch (pdfError) {
        console.error('Error generating meal plan PDF:', pdfError);
        // Continue without PDF if generation fails
      }
    }
    
    // Current date objects for start/end dates
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + 4); // 5 days including today
    
    // Save the meal plan to the database
    const savedMealPlan = await prisma.mealPlan.create({
      data: {
        userId,
        title: `${body.seasonalFocus} 5-Day Meal Plan`,
        description: `A ${body.seasonalFocus} meal plan for ${body.servingsPerMeal} people`,
        planType: 'MEAL_PLAN',
        startDate: now,
        endDate: endDate,
        pdfUrl: pdfUrl,
        content: JSON.stringify(mealPlan),
      }
    });
    
    // Track usage for analytics (premium users don't count toward generation limits)
    if (!isPremium) {
      await incrementUserGeneration(userId);
    }
    
    // Return the generated meal plan with PDF URL
    return NextResponse.json({
      ...mealPlan,
      pdfUrl,
      mealPlanId: savedMealPlan.id
    });
    
  } catch (error: any) {
    console.error('Error in meal plan generation API:', error);
    
    // Handle specific errors
    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Generic error handling
    return NextResponse.json(
      { error: error.message || 'An error occurred while generating the meal plan.' },
      { status: 500 }
    );
  }
}