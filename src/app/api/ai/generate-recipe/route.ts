import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateRecipe } from '@/lib/claude';
import { checkUserGenerationLimit, incrementUserGeneration } from '@/lib/usage-tracking';
import { generateRecipePDF } from '@/lib/pdf';

export const maxDuration = 60; // Maximum duration for Vercel serverless functions (in seconds)

interface RequestBody {
  dietaryRestrictions: string[];
  preferences: string[];
  seasonalIngredients: string[];
  mealType: string;
  servings: number;
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
    
    // Check if user is premium
    const isPremium = session?.user?.subscriptionTier === 'PREMIUM';
    
    // Parse request body
    const body = await request.json() as RequestBody;
    
    // Validate required parameters
    if (!body.mealType || !body.servings || !body.seasonalIngredients || body.seasonalIngredients.length === 0) {
      return NextResponse.json(
        { error: 'Missing required parameters. Please provide mealType, servings, and at least one seasonal ingredient.' },
        { status: 400 }
      );
    }
    
    // Check if user has reached their generation limit
    const canGenerate = await checkUserGenerationLimit(userId);
    if (!canGenerate) {
      return NextResponse.json(
        { 
          error: 'You have reached your generation limit for this month. Upgrade to premium for unlimited generations.',
          limitReached: true
        },
        { status: 403 }
      );
    }
    
    // Generate recipe
    const recipe = await generateRecipe({
      dietaryRestrictions: body.dietaryRestrictions || [],
      preferences: body.preferences || [],
      seasonalIngredients: body.seasonalIngredients,
      mealType: body.mealType,
      servings: body.servings,
      isPremium
    });
    
    // Track usage for analytics and rate limiting
    await incrementUserGeneration(userId);
    
    // Generate PDF if requested
    let pdfUrl: string | undefined;
    
    if (body.generatePDF) {
      try {
        pdfUrl = await generateRecipePDF({
          recipe,
          userId,
        });
      } catch (pdfError) {
        console.error('Error generating recipe PDF:', pdfError);
        // Continue without PDF if generation fails
      }
    }
    
    // Return the generated recipe and PDF URL if available
    return NextResponse.json({
      ...recipe,
      pdfUrl
    });
    
  } catch (error: any) {
    console.error('Error in recipe generation API:', error);
    
    // Handle specific errors
    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Generic error handling
    return NextResponse.json(
      { error: error.message || 'An error occurred while generating the recipe.' },
      { status: 500 }
    );
  }
}