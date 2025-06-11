import { pdf } from '@react-pdf/renderer';
import { put, del, list } from '@vercel/blob';
import { Recipe, MealPlan } from '@/lib/claude';
import RecipeCardPDF from './RecipeCard';
import MealPlanPDF from './MealPlan';
import { prisma } from '@/lib/db';

/**
 * Generate a PDF for a single recipe
 */
export async function generateRecipePDF({
  recipe,
  userId,
}: {
  recipe: Recipe;
  userId: string;
}): Promise<string> {
  try {
    // Create the PDF document
    const pdfDocument = <RecipeCardPDF recipe={recipe} generatedDate={new Date()} />;
    const pdfBuffer = await pdf(pdfDocument).toBuffer();

    // Generate a unique filename
    const filename = `recipes/${userId}/${sanitizeFilename(recipe.name)}-${Date.now()}.pdf`;

    // Store PDF in Vercel Blob
    const blob = await put(filename, pdfBuffer, {
      contentType: 'application/pdf',
      public: true, // Make the file publicly accessible
    });

    // Return the URL of the stored PDF
    return blob.url;
  } catch (error) {
    console.error('Error generating recipe PDF:', error);
    throw new Error('Failed to generate recipe PDF');
  }
}

/**
 * Generate a PDF for a meal plan
 */
export async function generateMealPlanPDF({
  mealPlan,
  userId,
  seasonalFocus,
}: {
  mealPlan: MealPlan;
  userId: string;
  seasonalFocus: string;
}): Promise<string> {
  try {
    // Create the PDF document
    const title = `${seasonalFocus} 5-Day Meal Plan`;
    const pdfDocument = (
      <MealPlanPDF 
        mealPlan={mealPlan} 
        generatedDate={new Date()} 
        title={title}
        seasonalFocus={seasonalFocus}
      />
    );
    const pdfBuffer = await pdf(pdfDocument).toBuffer();

    // Generate a unique filename
    const filename = `meal-plans/${userId}/${sanitizeFilename(seasonalFocus)}-meal-plan-${Date.now()}.pdf`;

    // Store PDF in Vercel Blob
    const blob = await put(filename, pdfBuffer, {
      contentType: 'application/pdf',
      public: true, // Make the file publicly accessible
    });

    // Store the URL in the database
    await prisma.pdfDocument.create({
      data: {
        userId,
        url: blob.url,
        type: 'MEAL_PLAN',
        title,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    // Return the URL of the stored PDF
    return blob.url;
  } catch (error) {
    console.error('Error generating meal plan PDF:', error);
    throw new Error('Failed to generate meal plan PDF');
  }
}

/**
 * Clean up old PDF files to save storage
 */
export async function cleanupOldPDFs(userId: string): Promise<void> {
  try {
    // Find PDFs older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get old PDFs from the database
    const oldPdfs = await prisma.pdfDocument.findMany({
      where: {
        userId,
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    // Delete from Vercel Blob
    for (const pdf of oldPdfs) {
      try {
        // Extract the blob path from the URL
        const url = new URL(pdf.url);
        const pathname = url.pathname;
        
        // Delete the blob
        await del(pathname);
        
        // Delete from database
        await prisma.pdfDocument.delete({
          where: {
            id: pdf.id,
          },
        });
      } catch (error) {
        console.error(`Failed to delete PDF ${pdf.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error cleaning up old PDFs:', error);
  }
}

/**
 * Get all PDFs for a user
 */
export async function getUserPDFs(userId: string): Promise<any[]> {
  try {
    // Get PDFs from the database
    const pdfs = await prisma.pdfDocument.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return pdfs;
  } catch (error) {
    console.error('Error fetching user PDFs:', error);
    return [];
  }
}

/**
 * Helper function to sanitize filenames
 */
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}