/**
 * ConvertKit API client for Seasonally Simple
 * 
 * This module handles interactions with the ConvertKit API for:
 * - Subscriber management
 * - Custom field tracking
 * - Tag management
 * - Sequence enrollment
 * - Email broadcasts
 */

import { Recipe, MealPlan } from '@/lib/claude';

// ConvertKit API Configuration
const CONVERTKIT_API_URL = 'https://api.convertkit.com/v3';
const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;

// Tags for user segmentation
export const TAGS = {
  // Interest tags
  RECIPE_DOWNLOAD: process.env.CONVERTKIT_TAG_RECIPE_DOWNLOAD || '1234567',
  MEAL_PLAN_DOWNLOAD: process.env.CONVERTKIT_TAG_MEAL_PLAN_DOWNLOAD || '1234568',
  SUMMER_INTEREST: process.env.CONVERTKIT_TAG_SUMMER_INTEREST || '1234569',
  FALL_INTEREST: process.env.CONVERTKIT_TAG_FALL_INTEREST || '1234570',
  WINTER_INTEREST: process.env.CONVERTKIT_TAG_WINTER_INTEREST || '1234571',
  SPRING_INTEREST: process.env.CONVERTKIT_TAG_SPRING_INTEREST || '1234572',
  
  // Lifecycle tags
  FREE_USER: process.env.CONVERTKIT_TAG_FREE_USER || '1234573',
  CUSTOMER: process.env.CONVERTKIT_TAG_CUSTOMER || '1234574',
  PREMIUM_CUSTOMER: process.env.CONVERTKIT_TAG_PREMIUM_CUSTOMER || '1234575',
  
  // Engagement tags
  HIGH_ENGAGEMENT: process.env.CONVERTKIT_TAG_HIGH_ENGAGEMENT || '1234576',
  MEDIUM_ENGAGEMENT: process.env.CONVERTKIT_TAG_MEDIUM_ENGAGEMENT || '1234577',
  LOW_ENGAGEMENT: process.env.CONVERTKIT_TAG_LOW_ENGAGEMENT || '1234578',
};

// Sequences for nurturing and onboarding
export const SEQUENCES = {
  RECIPE_NURTURE: process.env.CONVERTKIT_SEQUENCE_RECIPE_NURTURE || '987654',
  MEAL_PLAN_NURTURE: process.env.CONVERTKIT_SEQUENCE_MEAL_PLAN_NURTURE || '987655',
  CUSTOMER_ONBOARDING: process.env.CONVERTKIT_SEQUENCE_CUSTOMER_ONBOARDING || '987656',
};

// Custom field keys
export const FIELDS = {
  FAMILY_SIZE: 'family_size',
  DIETARY_RESTRICTIONS: 'dietary_restrictions',
  COOKING_SKILL: 'cooking_skill',
  BUDGET_RANGE: 'budget_range',
  DOWNLOAD_TYPE: 'download_type',
  CUSTOMER_STATUS: 'customer_status',
  LAST_PURCHASE: 'last_purchase',
  LIFETIME_VALUE: 'lifetime_value',
  SEASONAL_PREFERENCE: 'seasonal_preference',
  LAST_RECIPE_DOWNLOAD: 'last_recipe_download',
  LAST_MEAL_PLAN_DOWNLOAD: 'last_meal_plan_download',
};

/**
 * Types for ConvertKit API interactions
 */

// Subscriber data structure
export interface Subscriber {
  id?: number;
  email: string;
  first_name?: string;
  fields?: Record<string, string | number | string[]>;
  tags?: string[];
}

// Response from ConvertKit API
interface ConvertKitResponse {
  subscription?: {
    id: number;
    state: string;
    created_at: string;
    subscriber: {
      id: number;
    };
  };
  subscriber?: {
    id: number;
    first_name: string;
    email_address: string;
    state: string;
    created_at: string;
    fields: Record<string, string>;
  };
  error?: string;
}

/**
 * Add or update a subscriber in ConvertKit
 */
export async function addOrUpdateSubscriber(
  subscriber: Subscriber
): Promise<number | null> {
  try {
    const response = await fetch(`${CONVERTKIT_API_URL}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_secret: CONVERTKIT_API_SECRET,
        email: subscriber.email,
        first_name: subscriber.first_name,
        fields: subscriber.fields,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('ConvertKit API error:', errorData);
      throw new Error(`ConvertKit API error: ${errorData.error}`);
    }

    const data = await response.json() as ConvertKitResponse;
    
    // Add tags if provided
    if (subscriber.tags && subscriber.tags.length > 0 && data.subscriber?.id) {
      await addTagsToSubscriber(data.subscriber.id, subscriber.tags);
    }
    
    return data.subscriber?.id || null;
  } catch (error) {
    console.error('Error adding/updating subscriber:', error);
    return null;
  }
}

/**
 * Add tags to a subscriber
 */
export async function addTagsToSubscriber(
  subscriberId: number,
  tagIds: string[]
): Promise<boolean> {
  try {
    // Add each tag one by one (ConvertKit doesn't support bulk tagging in one request)
    for (const tagId of tagIds) {
      const response = await fetch(`${CONVERTKIT_API_URL}/tags/${tagId}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_secret: CONVERTKIT_API_SECRET,
          subscriber_id: subscriberId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`ConvertKit API error adding tag ${tagId}:`, errorData);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error adding tags to subscriber:', error);
    return false;
  }
}

/**
 * Remove tags from a subscriber
 */
export async function removeTagsFromSubscriber(
  subscriberId: number,
  tagIds: string[]
): Promise<boolean> {
  try {
    // Remove each tag one by one
    for (const tagId of tagIds) {
      const response = await fetch(`${CONVERTKIT_API_URL}/subscribers/${subscriberId}/tags/${tagId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_secret: CONVERTKIT_API_SECRET,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`ConvertKit API error removing tag ${tagId}:`, errorData);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error removing tags from subscriber:', error);
    return false;
  }
}

/**
 * Add a subscriber to a sequence
 */
export async function addSubscriberToSequence(
  subscriberId: number,
  sequenceId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${CONVERTKIT_API_URL}/sequences/${sequenceId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_secret: CONVERTKIT_API_SECRET,
        subscriber_id: subscriberId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('ConvertKit API error adding to sequence:', errorData);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error adding subscriber to sequence:', error);
    return false;
  }
}

/**
 * Remove a subscriber from a sequence
 */
export async function removeSubscriberFromSequence(
  subscriberId: number,
  sequenceId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${CONVERTKIT_API_URL}/sequences/${sequenceId}/subscriptions/${subscriberId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_secret: CONVERTKIT_API_SECRET,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('ConvertKit API error removing from sequence:', errorData);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error removing subscriber from sequence:', error);
    return false;
  }
}

/**
 * Update subscriber custom fields
 */
export async function updateSubscriberFields(
  subscriberId: number,
  fields: Record<string, string | number | string[]>
): Promise<boolean> {
  try {
    // Convert arrays to comma-separated strings for ConvertKit
    const processedFields: Record<string, string | number> = {};
    
    for (const [key, value] of Object.entries(fields)) {
      if (Array.isArray(value)) {
        processedFields[key] = value.join(', ');
      } else {
        processedFields[key] = value;
      }
    }
    
    const response = await fetch(`${CONVERTKIT_API_URL}/subscribers/${subscriberId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_secret: CONVERTKIT_API_SECRET,
        fields: processedFields,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('ConvertKit API error updating fields:', errorData);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating subscriber fields:', error);
    return false;
  }
}

/**
 * Track a recipe download for a subscriber
 */
export async function trackRecipeDownload(
  email: string,
  firstName: string,
  recipe: Recipe,
  dietaryRestrictions: string[] = [],
  familySize: number = 2,
  cookingSkill: string = 'intermediate'
): Promise<number | null> {
  try {
    // Initialize tags array
    const tags = [TAGS.RECIPE_DOWNLOAD, TAGS.FREE_USER];
    
    // Add seasonal interest tag if appropriate
    if (recipe.seasonalNote) {
      if (recipe.seasonalNote.toLowerCase().includes('summer')) {
        tags.push(TAGS.SUMMER_INTEREST);
      } else if (recipe.seasonalNote.toLowerCase().includes('fall')) {
        tags.push(TAGS.FALL_INTEREST);
      } else if (recipe.seasonalNote.toLowerCase().includes('winter')) {
        tags.push(TAGS.WINTER_INTEREST);
      } else if (recipe.seasonalNote.toLowerCase().includes('spring')) {
        tags.push(TAGS.SPRING_INTEREST);
      }
    }
    
    // Create or update the subscriber
    const subscriber: Subscriber = {
      email,
      first_name: firstName,
      fields: {
        [FIELDS.FAMILY_SIZE]: familySize,
        [FIELDS.DIETARY_RESTRICTIONS]: dietaryRestrictions,
        [FIELDS.COOKING_SKILL]: cookingSkill,
        [FIELDS.DOWNLOAD_TYPE]: 'recipe',
        [FIELDS.LAST_RECIPE_DOWNLOAD]: recipe.name,
        [FIELDS.SEASONAL_PREFERENCE]: recipe.seasonalNote || '',
      },
      tags: tags,
    };
    
    const subscriberId = await addOrUpdateSubscriber(subscriber);
    
    // Add to recipe nurture sequence
    if (subscriberId) {
      await addSubscriberToSequence(subscriberId, SEQUENCES.RECIPE_NURTURE);
    }
    
    return subscriberId;
  } catch (error) {
    console.error('Error tracking recipe download:', error);
    return null;
  }
}

/**
 * Track a meal plan download for a subscriber
 */
export async function trackMealPlanDownload(
  email: string,
  firstName: string,
  mealPlan: MealPlan,
  seasonalFocus: string,
  dietaryRestrictions: string[] = [],
  familySize: number = 2,
  budget: string = 'moderate'
): Promise<number | null> {
  try {
    // Initialize tags array
    const tags = [TAGS.MEAL_PLAN_DOWNLOAD, TAGS.FREE_USER];
    
    // Add seasonal interest tag
    if (seasonalFocus.toLowerCase().includes('summer')) {
      tags.push(TAGS.SUMMER_INTEREST);
    } else if (seasonalFocus.toLowerCase().includes('fall')) {
      tags.push(TAGS.FALL_INTEREST);
    } else if (seasonalFocus.toLowerCase().includes('winter')) {
      tags.push(TAGS.WINTER_INTEREST);
    } else if (seasonalFocus.toLowerCase().includes('spring')) {
      tags.push(TAGS.SPRING_INTEREST);
    }
    
    // Create or update the subscriber
    const subscriber: Subscriber = {
      email,
      first_name: firstName,
      fields: {
        [FIELDS.FAMILY_SIZE]: familySize,
        [FIELDS.DIETARY_RESTRICTIONS]: dietaryRestrictions,
        [FIELDS.BUDGET_RANGE]: budget,
        [FIELDS.DOWNLOAD_TYPE]: 'meal_plan',
        [FIELDS.LAST_MEAL_PLAN_DOWNLOAD]: seasonalFocus,
        [FIELDS.SEASONAL_PREFERENCE]: seasonalFocus,
      },
      tags: tags,
    };
    
    const subscriberId = await addOrUpdateSubscriber(subscriber);
    
    // Add to meal plan nurture sequence
    if (subscriberId) {
      await addSubscriberToSequence(subscriberId, SEQUENCES.MEAL_PLAN_NURTURE);
    }
    
    return subscriberId;
  } catch (error) {
    console.error('Error tracking meal plan download:', error);
    return null;
  }
}

/**
 * Track a customer conversion
 */
export async function trackCustomerConversion(
  email: string,
  purchaseAmount: number,
  productType: 'recipe' | 'meal_plan' | 'subscription'
): Promise<boolean> {
  try {
    // Find subscriber by email
    const response = await fetch(
      `${CONVERTKIT_API_URL}/subscribers?api_secret=${CONVERTKIT_API_SECRET}&email_address=${encodeURIComponent(email)}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('ConvertKit API error finding subscriber:', errorData);
      return false;
    }
    
    const data = await response.json();
    const subscriberId = data.subscribers?.[0]?.id;
    
    if (!subscriberId) {
      console.error('Subscriber not found:', email);
      return false;
    }
    
    // Update customer fields
    const fields: Record<string, string | number> = {
      [FIELDS.CUSTOMER_STATUS]: 'active',
      [FIELDS.LAST_PURCHASE]: new Date().toISOString(),
    };
    
    // Update lifetime value field by adding new purchase
    const getResponse = await fetch(
      `${CONVERTKIT_API_URL}/subscribers/${subscriberId}?api_secret=${CONVERTKIT_API_SECRET}`
    );
    
    if (getResponse.ok) {
      const subscriberData = await getResponse.json();
      const currentLifetimeValue = parseFloat(subscriberData.subscriber?.fields?.[FIELDS.LIFETIME_VALUE] || '0');
      fields[FIELDS.LIFETIME_VALUE] = currentLifetimeValue + purchaseAmount;
    } else {
      fields[FIELDS.LIFETIME_VALUE] = purchaseAmount;
    }
    
    // Update the fields
    await updateSubscriberFields(subscriberId, fields);
    
    // Update tags - remove FREE_USER, add CUSTOMER
    await removeTagsFromSubscriber(subscriberId, [TAGS.FREE_USER]);
    await addTagsToSubscriber(subscriberId, [TAGS.CUSTOMER]);
    
    // For subscription purchases, add PREMIUM_CUSTOMER tag
    if (productType === 'subscription') {
      await addTagsToSubscriber(subscriberId, [TAGS.PREMIUM_CUSTOMER]);
    }
    
    // Add to customer onboarding sequence and remove from nurture sequences
    await removeSubscriberFromSequence(subscriberId, SEQUENCES.RECIPE_NURTURE);
    await removeSubscriberFromSequence(subscriberId, SEQUENCES.MEAL_PLAN_NURTURE);
    await addSubscriberToSequence(subscriberId, SEQUENCES.CUSTOMER_ONBOARDING);
    
    return true;
  } catch (error) {
    console.error('Error tracking customer conversion:', error);
    return false;
  }
}

/**
 * Get a subscriber by email
 */
export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  try {
    const response = await fetch(
      `${CONVERTKIT_API_URL}/subscribers?api_secret=${CONVERTKIT_API_SECRET}&email_address=${encodeURIComponent(email)}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('ConvertKit API error finding subscriber:', errorData);
      return null;
    }
    
    const data = await response.json();
    const subscriberData = data.subscribers?.[0];
    
    if (!subscriberData) {
      return null;
    }
    
    return {
      id: subscriberData.id,
      email: subscriberData.email_address,
      first_name: subscriberData.first_name,
      fields: subscriberData.fields,
    };
  } catch (error) {
    console.error('Error getting subscriber by email:', error);
    return null;
  }
}