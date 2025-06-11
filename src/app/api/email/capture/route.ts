import { NextRequest, NextResponse } from 'next/server';
import { processEmailCapture } from '@/lib/email';
import { Recipe, MealPlan } from '@/lib/claude';

interface RequestBody {
  email: string;
  firstName: string;
  downloadType: 'recipe' | 'meal_plan';
  recipe?: Recipe;
  mealPlan?: MealPlan;
  seasonalFocus?: string;
  pdfUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json() as RequestBody;
    
    // Validate required parameters
    if (!body.email || !body.firstName || !body.downloadType) {
      return NextResponse.json(
        { error: 'Missing required parameters. Please provide email, firstName, and downloadType.' },
        { status: 400 }
      );
    }
    
    // Validate download-specific parameters
    if (body.downloadType === 'recipe' && (!body.recipe || !body.pdfUrl)) {
      return NextResponse.json(
        { error: 'Missing required parameters for recipe download. Please provide recipe and pdfUrl.' },
        { status: 400 }
      );
    }
    
    if (body.downloadType === 'meal_plan' && (!body.mealPlan || !body.seasonalFocus || !body.pdfUrl)) {
      return NextResponse.json(
        { error: 'Missing required parameters for meal plan download. Please provide mealPlan, seasonalFocus, and pdfUrl.' },
        { status: 400 }
      );
    }
    
    // Process email capture
    const success = await processEmailCapture(
      body.email,
      body.firstName,
      body.downloadType,
      body.recipe,
      body.mealPlan,
      body.seasonalFocus,
      body.pdfUrl
    );
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to process email capture.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Error processing email capture:', error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing email capture.' },
      { status: 500 }
    );
  }
}