/**
 * Email templates for Seasonally Simple
 * 
 * This module contains email templates for:
 * - Recipe delivery
 * - Meal plan delivery
 * - Customer welcome emails
 * 
 * All templates use a friendly, authentic tone as if from a friend.
 */

import { Recipe, MealPlan } from '@/lib/claude';

interface TemplateData {
  firstName: string;
  pdfUrl?: string;
  unsubscribeUrl?: string;
}

interface RecipeTemplateData extends TemplateData {
  recipe: Recipe;
}

interface MealPlanTemplateData extends TemplateData {
  mealPlan: MealPlan;
  seasonalFocus: string;
}

interface CustomerTemplateData extends TemplateData {
  productName: string;
  accessUrl: string;
}

/**
 * Generate a recipe delivery email
 */
export function generateRecipeEmail(data: RecipeTemplateData): {
  subject: string;
  html: string;
  text: string;
} {
  const { firstName, recipe, pdfUrl, unsubscribeUrl } = data;
  
  // Get difficulty word with first letter capitalized
  const difficultyWord = recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1).toLowerCase();
  
  // Generate subject line with recipe name
  const subject = `✨ Your ${recipe.name} Recipe Is Ready!`;
  
  // Generate HTML version
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${subject}</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #94a89a;
          font-size: 24px;
          margin-bottom: 20px;
        }
        h2 {
          color: #dd9a7c;
          font-size: 20px;
          margin-top: 25px;
          margin-bottom: 15px;
        }
        p {
          margin-bottom: 15px;
        }
        .button {
          display: inline-block;
          background-color: #94a89a;
          color: white;
          padding: 12px 25px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin: 15px 0;
        }
        .recipe-details {
          background-color: #f8f5f0;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .recipe-details p {
          margin: 5px 0;
        }
        .footer {
          margin-top: 40px;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .ingredients {
          margin-bottom: 20px;
        }
        .ingredients li {
          margin-bottom: 8px;
        }
      </style>
    </head>
    <body>
      <h1>Your ${recipe.name} Recipe</h1>
      
      <p>Hey ${firstName}!</p>
      
      <p>I'm so excited to share this ${recipe.difficulty.toLowerCase()} recipe with you! I love this dish because ${
        recipe.seasonalNote ? 
        'it really captures the essence of ' + recipe.seasonalNote.toLowerCase() : 
        'it\'s so approachable while still being impressive'
      }.</p>
      
      <div class="recipe-details">
        <p><strong>Prep Time:</strong> ${recipe.prepTime}</p>
        <p><strong>Cook Time:</strong> ${recipe.cookTime}</p>
        <p><strong>Difficulty:</strong> ${difficultyWord}</p>
        <p><strong>Servings:</strong> ${recipe.servings}</p>
      </div>
      
      <p>I've attached a beautifully formatted PDF of the recipe that you can print or save to your device. Just click the button below:</p>
      
      <p style="text-align: center;">
        <a href="${pdfUrl}" class="button">Download Your Recipe</a>
      </p>
      
      <h2>A Sneak Peek at the Ingredients</h2>
      
      <div class="ingredients">
        <ul>
          ${recipe.ingredients.slice(0, 5).map(ingredient => `<li>${ingredient}</li>`).join('')}
          ${recipe.ingredients.length > 5 ? '<li>...and a few more simple ingredients!</li>' : ''}
        </ul>
      </div>
      
      <p>I've been using this recipe a lot lately, and I've discovered a few tricks that make it even better:</p>
      
      <ul>
        ${recipe.tips && recipe.tips.length > 0 ? 
          recipe.tips.slice(0, 2).map(tip => `<li>${tip}</li>`).join('') : 
          `<li>Make sure to read through the entire recipe before starting!</li>
           <li>Prep all your ingredients before you begin cooking for a smoother experience.</li>`
        }
      </ul>
      
      <p>I'd love to hear how this recipe turns out for you! If you make it, shoot me a quick reply to this email with how it went.</p>
      
      <p>Happy cooking!</p>
      
      <p>Jess from Seasonally Simple</p>
      
      <p>P.S. If you're enjoying these seasonal recipes, you might love my complete <strong>Seasonal Kitchen Collection</strong> - it includes 50+ premium recipes and 12 done-for-you meal plans. <a href="https://seasonallysimple.com/products">Check it out here</a>!</p>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} Seasonally Simple. All rights reserved.</p>
        <p>You're receiving this email because you signed up at seasonallysimple.com</p>
        <p><a href="${unsubscribeUrl || '#'}">Unsubscribe</a></p>
      </div>
    </body>
    </html>
  `;
  
  // Generate plain text version
  const text = `
Your ${recipe.name} Recipe

Hey ${firstName}!

I'm so excited to share this ${recipe.difficulty.toLowerCase()} recipe with you! I love this dish because ${
  recipe.seasonalNote ? 
  'it really captures the essence of ' + recipe.seasonalNote.toLowerCase() : 
  'it\'s so approachable while still being impressive'
}.

RECIPE DETAILS
Prep Time: ${recipe.prepTime}
Cook Time: ${recipe.cookTime}
Difficulty: ${difficultyWord}
Servings: ${recipe.servings}

I've created a beautifully formatted PDF of the recipe that you can print or save to your device. Download it here:
${pdfUrl}

A SNEAK PEEK AT THE INGREDIENTS
${recipe.ingredients.slice(0, 5).map(ingredient => `- ${ingredient}`).join('\n')}
${recipe.ingredients.length > 5 ? '- ...and a few more simple ingredients!' : ''}

I've been using this recipe a lot lately, and I've discovered a few tricks that make it even better:

${recipe.tips && recipe.tips.length > 0 ? 
  recipe.tips.slice(0, 2).map(tip => `- ${tip}`).join('\n') : 
  `- Make sure to read through the entire recipe before starting!
- Prep all your ingredients before you begin cooking for a smoother experience.`
}

I'd love to hear how this recipe turns out for you! If you make it, shoot me a quick reply to this email with how it went.

Happy cooking!

Jess from Seasonally Simple

P.S. If you're enjoying these seasonal recipes, you might love my complete Seasonal Kitchen Collection - it includes 50+ premium recipes and 12 done-for-you meal plans. Check it out here: https://seasonallysimple.com/products

----
© ${new Date().getFullYear()} Seasonally Simple. All rights reserved.
You're receiving this email because you signed up at seasonallysimple.com
Unsubscribe: ${unsubscribeUrl || '#'}
  `;
  
  return { subject, html, text };
}

/**
 * Generate a meal plan delivery email
 */
export function generateMealPlanEmail(data: MealPlanTemplateData): {
  subject: string;
  html: string;
  text: string;
} {
  const { firstName, mealPlan, seasonalFocus, pdfUrl, unsubscribeUrl } = data;
  
  // Generate subject line with seasonal focus
  const subject = `🍽️ Your ${seasonalFocus} 5-Day Meal Plan is Ready!`;
  
  // Get example meals (first 3)
  const exampleMeals = mealPlan.meals.slice(0, 3).map(meal => meal.name);
  
  // Generate HTML version
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${subject}</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #94a89a;
          font-size: 24px;
          margin-bottom: 20px;
        }
        h2 {
          color: #dd9a7c;
          font-size: 20px;
          margin-top: 25px;
          margin-bottom: 15px;
        }
        p {
          margin-bottom: 15px;
        }
        .button {
          display: inline-block;
          background-color: #94a89a;
          color: white;
          padding: 12px 25px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin: 15px 0;
        }
        .meal-plan-details {
          background-color: #f8f5f0;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .meal-list {
          margin-bottom: 20px;
        }
        .meal-list li {
          margin-bottom: 8px;
        }
        .prep-tips {
          background-color: #f3e9dc;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 40px;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <h1>Your ${seasonalFocus} 5-Day Meal Plan</h1>
      
      <p>Hey ${firstName}!</p>
      
      <p>I'm thrilled to share your brand new 5-day meal plan featuring the best ${seasonalFocus.toLowerCase()} ingredients! This plan will save you time, reduce food waste, and make your weeknight dinners so much easier.</p>
      
      <div class="meal-plan-details">
        <p><strong>Total Estimated Cost:</strong> ${mealPlan.totalEstimatedCost}</p>
        <p><strong>Prep Tips:</strong> ${mealPlan.prepTips.length} practical tips to save time</p>
        <p><strong>Bonus:</strong> Creative leftover ideas included!</p>
      </div>
      
      <p>I've put together a complete package with shopping lists, prep instructions, and all 5 recipes in one convenient PDF. Download it now:</p>
      
      <p style="text-align: center;">
        <a href="${pdfUrl}" class="button">Download Your Meal Plan</a>
      </p>
      
      <h2>What's on the Menu</h2>
      
      <div class="meal-list">
        <ul>
          ${exampleMeals.map(meal => `<li>${meal}</li>`).join('')}
          <li>...and 2 more delicious meals!</li>
        </ul>
      </div>
      
      <h2>Smart Prep Tips</h2>
      
      <div class="prep-tips">
        ${mealPlan.prepTips.slice(0, 2).map(tip => `<p>✓ ${tip}</p>`).join('')}
        ${mealPlan.prepTips.length > 2 ? '<p>...and more time-saving tips in your full meal plan!</p>' : ''}
      </div>
      
      <p>The thing I love most about this meal plan is how it all works together - prep once, use the ingredients multiple times, and reduce food waste. It's designed to make your life easier while still eating deliciously seasonal food.</p>
      
      <p>Let me know how you like it! And if you have any questions, just hit reply - I'm here to help.</p>
      
      <p>Happy cooking!</p>
      
      <p>Jess from Seasonally Simple</p>
      
      <p>P.S. Want a new meal plan like this <em>every week</em>? Check out my <strong>Premium Meal Plan Subscription</strong> for just $9.99/month. <a href="https://seasonallysimple.com/products/premium">Learn more here</a>!</p>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} Seasonally Simple. All rights reserved.</p>
        <p>You're receiving this email because you signed up at seasonallysimple.com</p>
        <p><a href="${unsubscribeUrl || '#'}">Unsubscribe</a></p>
      </div>
    </body>
    </html>
  `;
  
  // Generate plain text version
  const text = `
Your ${seasonalFocus} 5-Day Meal Plan

Hey ${firstName}!

I'm thrilled to share your brand new 5-day meal plan featuring the best ${seasonalFocus.toLowerCase()} ingredients! This plan will save you time, reduce food waste, and make your weeknight dinners so much easier.

MEAL PLAN DETAILS
Total Estimated Cost: ${mealPlan.totalEstimatedCost}
Prep Tips: ${mealPlan.prepTips.length} practical tips to save time
Bonus: Creative leftover ideas included!

I've put together a complete package with shopping lists, prep instructions, and all 5 recipes in one convenient PDF. Download it now:
${pdfUrl}

WHAT'S ON THE MENU
${exampleMeals.map(meal => `- ${meal}`).join('\n')}
- ...and 2 more delicious meals!

SMART PREP TIPS
${mealPlan.prepTips.slice(0, 2).map(tip => `✓ ${tip}`).join('\n')}
${mealPlan.prepTips.length > 2 ? '...and more time-saving tips in your full meal plan!' : ''}

The thing I love most about this meal plan is how it all works together - prep once, use the ingredients multiple times, and reduce food waste. It's designed to make your life easier while still eating deliciously seasonal food.

Let me know how you like it! And if you have any questions, just hit reply - I'm here to help.

Happy cooking!

Jess from Seasonally Simple

P.S. Want a new meal plan like this every week? Check out my Premium Meal Plan Subscription for just $9.99/month. Learn more here: https://seasonallysimple.com/products/premium

----
© ${new Date().getFullYear()} Seasonally Simple. All rights reserved.
You're receiving this email because you signed up at seasonallysimple.com
Unsubscribe: ${unsubscribeUrl || '#'}
  `;
  
  return { subject, html, text };
}

/**
 * Generate a customer welcome email
 */
export function generateCustomerWelcomeEmail(data: CustomerTemplateData): {
  subject: string;
  html: string;
  text: string;
} {
  const { firstName, productName, accessUrl, unsubscribeUrl } = data;
  
  // Generate subject line
  const subject = `🎉 Welcome to ${productName}! Here's Your Access`;
  
  // Generate HTML version
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${subject}</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #94a89a;
          font-size: 24px;
          margin-bottom: 20px;
        }
        h2 {
          color: #dd9a7c;
          font-size: 20px;
          margin-top: 25px;
          margin-bottom: 15px;
        }
        p {
          margin-bottom: 15px;
        }
        .button {
          display: inline-block;
          background-color: #94a89a;
          color: white;
          padding: 12px 25px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin: 15px 0;
        }
        .welcome-box {
          background-color: #f8f5f0;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #94a89a;
        }
        .steps {
          margin-bottom: 20px;
        }
        .steps li {
          margin-bottom: 12px;
        }
        .footer {
          margin-top: 40px;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <h1>Welcome to ${productName}!</h1>
      
      <p>Hey ${firstName}!</p>
      
      <p>I'm so excited to welcome you to ${productName}! Thank you so much for your purchase - I'm thrilled that you've decided to join us.</p>
      
      <div class="welcome-box">
        <h2>Your Access Is Ready</h2>
        <p>You can access all your new content right away by clicking the button below:</p>
        <p style="text-align: center;">
          <a href="${accessUrl}" class="button">Access ${productName}</a>
        </p>
        <p><strong>Bookmark this page</strong> so you can easily return to it anytime!</p>
      </div>
      
      <h2>Getting Started in 3 Easy Steps</h2>
      
      <ol class="steps">
        <li><strong>Log in</strong> using the email address you purchased with (this one!).</li>
        <li><strong>Explore</strong> your new content - I recommend starting with the "Start Here" guide.</li>
        <li><strong>Save your favorites</strong> by clicking the heart icon on any recipe or meal plan.</li>
      </ol>
      
      <p>I'm here to help you make the most of ${productName}. If you have any questions at all, just reply to this email and I'll personally get back to you.</p>
      
      <p>I can't wait to hear what you think!</p>
      
      <p>Happy cooking!</p>
      
      <p>Jess from Seasonally Simple</p>
      
      <p>P.S. I'll be sending you some bonus tips and ideas over the next few days to help you get the most out of your purchase. Keep an eye on your inbox!</p>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} Seasonally Simple. All rights reserved.</p>
        <p>You're receiving this email because you purchased ${productName}.</p>
        <p><a href="${unsubscribeUrl || '#'}">Unsubscribe</a></p>
      </div>
    </body>
    </html>
  `;
  
  // Generate plain text version
  const text = `
Welcome to ${productName}!

Hey ${firstName}!

I'm so excited to welcome you to ${productName}! Thank you so much for your purchase - I'm thrilled that you've decided to join us.

YOUR ACCESS IS READY
You can access all your new content right away by visiting:
${accessUrl}

Bookmark this page so you can easily return to it anytime!

GETTING STARTED IN 3 EASY STEPS
1. Log in using the email address you purchased with (this one!).
2. Explore your new content - I recommend starting with the "Start Here" guide.
3. Save your favorites by clicking the heart icon on any recipe or meal plan.

I'm here to help you make the most of ${productName}. If you have any questions at all, just reply to this email and I'll personally get back to you.

I can't wait to hear what you think!

Happy cooking!

Jess from Seasonally Simple

P.S. I'll be sending you some bonus tips and ideas over the next few days to help you get the most out of your purchase. Keep an eye on your inbox!

----
© ${new Date().getFullYear()} Seasonally Simple. All rights reserved.
You're receiving this email because you purchased ${productName}.
Unsubscribe: ${unsubscribeUrl || '#'}
  `;
  
  return { subject, html, text };
}