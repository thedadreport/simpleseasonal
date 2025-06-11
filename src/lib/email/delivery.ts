/**
 * Email delivery module for Seasonally Simple
 * 
 * This module handles sending emails via ConvertKit:
 * - Recipe delivery
 * - Meal plan delivery
 * - Customer onboarding
 * - Transactional emails
 */

import { Recipe, MealPlan } from '@/lib/claude';
import { 
  trackRecipeDownload, 
  trackMealPlanDownload, 
  trackCustomerConversion,
  getSubscriberByEmail,
  FIELDS
} from './convertkit';
import { 
  generateRecipeEmail, 
  generateMealPlanEmail, 
  generateCustomerWelcomeEmail 
} from './templates';

// ConvertKit API Configuration
const CONVERTKIT_API_URL = 'https://api.convertkit.com/v3';
const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;

/**
 * Get unsubscribe URL for a subscriber
 */
async function getUnsubscribeUrl(subscriberId: number): Promise<string> {
  const baseUrl = 'https://seasonallysimple.com/unsubscribe';
  return `${baseUrl}?sid=${subscriberId}`;
}

/**
 * Send an email via ConvertKit's API
 */
async function sendEmail(
  to: string,
  subject: string,
  content: { html: string; text: string },
): Promise<boolean> {
  try {
    // Send email via ConvertKit broadcast API
    const response = await fetch(`${CONVERTKIT_API_URL}/broadcasts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_secret: CONVERTKIT_API_SECRET,
        subject,
        content: content.html,
        description: `Sent to ${to}`,
        email_address: to,
        public: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('ConvertKit API error sending email:', errorData);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Deliver a recipe via email
 */
export async function deliverRecipeEmail(
  email: string,
  firstName: string,
  recipe: Recipe,
  pdfUrl: string,
  dietaryRestrictions: string[] = [],
  familySize: number = 2,
  cookingSkill: string = 'intermediate',
): Promise<boolean> {
  try {
    // First track the download and subscriber info in ConvertKit
    const subscriberId = await trackRecipeDownload(
      email,
      firstName,
      recipe,
      dietaryRestrictions,
      familySize,
      cookingSkill,
    );
    
    if (!subscriberId) {
      console.error('Failed to track recipe download in ConvertKit');
      return false;
    }
    
    // Get unsubscribe URL
    const unsubscribeUrl = await getUnsubscribeUrl(subscriberId);
    
    // Generate email content
    const emailData = generateRecipeEmail({
      firstName,
      recipe,
      pdfUrl,
      unsubscribeUrl,
    });
    
    // Send email
    return await sendEmail(email, emailData.subject, {
      html: emailData.html,
      text: emailData.text,
    });
  } catch (error) {
    console.error('Error delivering recipe email:', error);
    return false;
  }
}

/**
 * Deliver a meal plan via email
 */
export async function deliverMealPlanEmail(
  email: string,
  firstName: string,
  mealPlan: MealPlan,
  seasonalFocus: string,
  pdfUrl: string,
  dietaryRestrictions: string[] = [],
  familySize: number = 2,
  budget: string = 'moderate',
): Promise<boolean> {
  try {
    // First track the download and subscriber info in ConvertKit
    const subscriberId = await trackMealPlanDownload(
      email,
      firstName,
      mealPlan,
      seasonalFocus,
      dietaryRestrictions,
      familySize,
      budget,
    );
    
    if (!subscriberId) {
      console.error('Failed to track meal plan download in ConvertKit');
      return false;
    }
    
    // Get unsubscribe URL
    const unsubscribeUrl = await getUnsubscribeUrl(subscriberId);
    
    // Generate email content
    const emailData = generateMealPlanEmail({
      firstName,
      mealPlan,
      seasonalFocus,
      pdfUrl,
      unsubscribeUrl,
    });
    
    // Send email
    return await sendEmail(email, emailData.subject, {
      html: emailData.html,
      text: emailData.text,
    });
  } catch (error) {
    console.error('Error delivering meal plan email:', error);
    return false;
  }
}

/**
 * Deliver a customer welcome email
 */
export async function deliverCustomerWelcomeEmail(
  email: string,
  productName: string,
  accessUrl: string,
  purchaseAmount: number,
  productType: 'recipe' | 'meal_plan' | 'subscription',
): Promise<boolean> {
  try {
    // Track the purchase in ConvertKit
    const success = await trackCustomerConversion(
      email,
      purchaseAmount,
      productType,
    );
    
    if (!success) {
      console.error('Failed to track customer conversion in ConvertKit');
      return false;
    }
    
    // Get subscriber data
    const subscriber = await getSubscriberByEmail(email);
    
    if (!subscriber) {
      console.error('Failed to get subscriber data from ConvertKit');
      return false;
    }
    
    // Get first name or use "there" as fallback
    const firstName = subscriber.first_name || 'there';
    
    // Get unsubscribe URL
    const unsubscribeUrl = await getUnsubscribeUrl(subscriber.id!);
    
    // Generate email content
    const emailData = generateCustomerWelcomeEmail({
      firstName,
      productName,
      accessUrl,
      unsubscribeUrl,
    });
    
    // Send email
    return await sendEmail(email, emailData.subject, {
      html: emailData.html,
      text: emailData.text,
    });
  } catch (error) {
    console.error('Error delivering customer welcome email:', error);
    return false;
  }
}

/**
 * Process a new email capture from the modal
 */
export async function processEmailCapture(
  email: string,
  firstName: string,
  downloadType: 'recipe' | 'meal_plan',
  recipe?: Recipe,
  mealPlan?: MealPlan,
  seasonalFocus?: string,
  pdfUrl?: string,
): Promise<boolean> {
  try {
    if (downloadType === 'recipe' && recipe && pdfUrl) {
      // Send recipe email
      return await deliverRecipeEmail(
        email,
        firstName,
        recipe,
        pdfUrl,
      );
    } else if (downloadType === 'meal_plan' && mealPlan && seasonalFocus && pdfUrl) {
      // Send meal plan email
      return await deliverMealPlanEmail(
        email,
        firstName,
        mealPlan,
        seasonalFocus,
        pdfUrl,
      );
    } else {
      console.error('Invalid email capture data');
      return false;
    }
  } catch (error) {
    console.error('Error processing email capture:', error);
    return false;
  }
}