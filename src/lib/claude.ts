import Anthropic from '@anthropic-ai/sdk';

// Types
export interface Recipe {
  name: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  difficulty: string;
  seasonalNote?: string;
  ingredients: string[];
  instructions: string[];
  tips: string[];
  nutrition?: {
    calories: number;
    protein: string;
    fiber: string;
    highlights: string[];
  };
}

export interface MealPlan {
  meals: Recipe[];
  shoppingList: string[];
  totalEstimatedCost: string;
  prepTips: string[];
  leftoverIdeas: string[];
}

// Configuration
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second
const DEFAULT_MODEL = 'claude-3-sonnet-20240229';
const PREMIUM_MODEL = 'claude-3-opus-20240229';

// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompts
const RECIPE_SYSTEM_PROMPT = `You are a professional chef specializing in seasonal, family-friendly cooking. 
You create delicious, easy-to-follow recipes in the style of Ina Garten, focusing on:

1. Seasonal ingredients that are fresh and flavorful
2. Simple techniques using basic kitchen equipment
3. Clear, detailed instructions that are friendly and encouraging
4. Practical tips for preparation and storage
5. Family-friendly adaptations and modifications
6. Nutritional highlights without being overly focused on calories

Always prioritize flavor and enjoyment while keeping recipes accessible for home cooks.`;

const MEAL_PLAN_SYSTEM_PROMPT = `You are a professional meal planner specializing in seasonal, family-friendly cooking.
You create practical, delicious meal plans that:

1. Utilize seasonal ingredients efficiently across multiple meals
2. Minimize food waste by suggesting creative uses for leftover ingredients
3. Balance nutrition throughout the week
4. Provide realistic time estimates for preparation
5. Include shopping lists organized by grocery store section
6. Offer make-ahead components to save time

Your plans should feel cohesive while offering variety throughout the week.`;

/**
 * Generate a single recipe using Claude
 */
export async function generateRecipe(params: {
  dietaryRestrictions: string[];
  preferences: string[];
  seasonalIngredients: string[];
  mealType: string;
  servings: number;
  isPremium?: boolean;
}): Promise<Recipe> {
  const { dietaryRestrictions, preferences, seasonalIngredients, mealType, servings, isPremium = false } = params;

  const prompt = `Generate a delicious ${mealType} recipe for ${servings} people that uses seasonal ingredients like ${seasonalIngredients.join(
    ', '
  )}. 
  
  The recipe should accommodate these dietary restrictions: ${dietaryRestrictions.length ? dietaryRestrictions.join(', ') : 'None'}.
  
  These are the flavor preferences: ${preferences.length ? preferences.join(', ') : 'No specific preferences'}.
  
  Please create a recipe with:
  1. Instructions written in a warm, approachable Ina Garten style ("How easy is that?")
  2. Ingredients that are commonly available
  3. Techniques that don't require special equipment
  4. Make-ahead tips when applicable
  5. Family-friendly modifications if relevant
  6. Nutritional highlights (not detailed calculations)
  
  Format the response as JSON with the following structure:
  {
    "name": "Recipe Name",
    "prepTime": "15 minutes",
    "cookTime": "30 minutes",
    "totalTime": "45 minutes",
    "servings": 4,
    "difficulty": "Easy/Medium/Hard",
    "seasonalNote": "Optional note about seasonal ingredients",
    "ingredients": ["ingredient 1", "ingredient 2", ...],
    "instructions": ["step 1", "step 2", ...],
    "tips": ["make-ahead tip", "storage tip", "family-friendly modification", ...],
    "nutrition": {
      "calories": approximate calories per serving,
      "protein": "approximate protein per serving",
      "fiber": "approximate fiber per serving",
      "highlights": ["Excellent source of vitamin C", "High in omega-3s", ...]
    }
  }`;

  return await executeWithRetry(async () => {
    const message = await anthropic.messages.create({
      model: isPremium ? PREMIUM_MODEL : DEFAULT_MODEL,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
      system: RECIPE_SYSTEM_PROMPT,
      temperature: 0.7,
    });

    // Handle different content block types
    const contentBlock = message.content[0];
    if (!contentBlock || contentBlock.type !== 'text') {
      throw new Error('Unexpected response format from Claude API');
    }
    
    const content = contentBlock.text;
    // Extract the JSON from the response
    const jsonMatch = content.match(/({[\s\S]*})/);
    
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as Recipe;
      } catch (e) {
        console.error('Failed to parse JSON from Claude response:', e);
        throw new Error('Failed to generate a valid recipe. Please try again.');
      }
    } else {
      throw new Error('Failed to extract recipe from Claude response');
    }
  });
}

/**
 * Generate a 5-day meal plan using Claude
 */
export async function generateMealPlan(params: {
  dietaryRestrictions: string[];
  preferences: string[];
  seasonalFocus: string;
  servingsPerMeal: number;
  budget?: string;
  isPremium?: boolean;
}): Promise<MealPlan> {
  const { 
    dietaryRestrictions, 
    preferences, 
    seasonalFocus, 
    servingsPerMeal, 
    budget = "moderate",
    isPremium = false 
  } = params;

  const prompt = `Create a 5-day meal plan focused on ${seasonalFocus} seasonal ingredients for ${servingsPerMeal} people.
  
  The meal plan should accommodate these dietary restrictions: ${dietaryRestrictions.length ? dietaryRestrictions.join(', ') : 'None'}.
  
  These are the flavor preferences: ${preferences.length ? preferences.join(', ') : 'No specific preferences'}.
  
  Budget level: ${budget} (influence the ingredient choices and complexity)
  
  For each day, include:
  1. A main dish with Ina Garten-style instructions
  2. Estimated time requirements
  3. Clear instructions for preparation
  
  Also provide:
  1. A consolidated shopping list organized by grocery section
  2. Estimated total cost for all ingredients
  3. Practical tips for meal preparation throughout the week
  4. Ideas for using potential leftovers
  
  Format the response as JSON with this structure:
  {
    "meals": [
      {
        "name": "Recipe Name",
        "prepTime": "15 minutes",
        "cookTime": "30 minutes", 
        "totalTime": "45 minutes",
        "servings": 4,
        "difficulty": "Easy/Medium/Hard",
        "seasonalNote": "Optional note about seasonal ingredients",
        "ingredients": ["ingredient 1", "ingredient 2", ...],
        "instructions": ["step 1", "step 2", ...],
        "tips": ["make-ahead tip", "storage tip", "family-friendly modification", ...],
        "nutrition": {
          "calories": approximate calories per serving,
          "protein": "approximate protein per serving",
          "fiber": "approximate fiber per serving",
          "highlights": ["Excellent source of vitamin C", "High in omega-3s", ...]
        }
      },
      ... 4 more meal objects
    ],
    "shoppingList": ["Item 1 (Produce section)", "Item 2 (Dairy section)", ...],
    "totalEstimatedCost": "$85-95",
    "prepTips": ["Prep tip 1", "Prep tip 2", ...],
    "leftoverIdeas": ["Leftover idea 1", "Leftover idea 2", ...]
  }`;

  return await executeWithRetry(async () => {
    const message = await anthropic.messages.create({
      model: isPremium ? PREMIUM_MODEL : DEFAULT_MODEL,
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
      system: MEAL_PLAN_SYSTEM_PROMPT,
      temperature: 0.7,
    });

    // Handle different content block types
    const contentBlock = message.content[0];
    if (!contentBlock || contentBlock.type !== 'text') {
      throw new Error('Unexpected response format from Claude API');
    }
    
    const content = contentBlock.text;
    // Extract the JSON from the response
    const jsonMatch = content.match(/({[\s\S]*})/);
    
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as MealPlan;
      } catch (e) {
        console.error('Failed to parse JSON from Claude response:', e);
        throw new Error('Failed to generate a valid meal plan. Please try again.');
      }
    } else {
      throw new Error('Failed to extract meal plan from Claude response');
    }
  });
}

/**
 * Helper function to execute a function with retries
 */
async function executeWithRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries <= 0) {
      throw error;
    }
    
    // Check if it's a rate limit error
    if (error.status === 429) {
      console.log(`Rate limited, retrying in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return executeWithRetry(fn, retries - 1);
    }
    
    // For other errors, retry with backoff
    const backoff = RETRY_DELAY * (MAX_RETRIES - retries + 1);
    console.log(`API error, retrying in ${backoff}ms...`, error);
    await new Promise(resolve => setTimeout(resolve, backoff));
    return executeWithRetry(fn, retries - 1);
  }
}

/**
 * Track API usage for a user
 */
export async function trackApiUsage(userId: string, operation: 'recipe' | 'mealplan', isPremium: boolean) {
  // This would be implemented to track usage in a database
  // For example, increment a counter in the user's record
  console.log(`Tracking API usage for user ${userId}: ${operation}, premium: ${isPremium}`);
  
  // In a real implementation, this would update a database
  // await db.usageStats.upsert({
  //   where: { userId },
  //   update: { [`${operation}Count`]: { increment: 1 } },
  //   create: { userId, [`${operation}Count`]: 1 }
  // });
}