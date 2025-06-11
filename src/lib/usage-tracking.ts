import { prisma } from './db';
import { SubscriptionTier } from '@prisma/client';

/**
 * Checks if a user has reached their generation limit based on subscription tier
 * - Free users: 3 generations per month
 * - Premium users: Unlimited generations
 */
export async function checkUserGenerationLimit(userId: string): Promise<boolean> {
  // Get user data with generation counts and subscription tier
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      freeGenerationsUsed: true,
      freeGenerationsReset: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Premium users have unlimited generations
  if (user.subscriptionTier === SubscriptionTier.PREMIUM) {
    return true;
  }

  // Check if we need to reset the monthly counter
  const now = new Date();
  const resetDate = new Date(user.freeGenerationsReset);
  
  // Reset counter if it's past the reset date (1 month later)
  if (now.getTime() > resetDate.getTime()) {
    // Set the reset date to now plus 30 days
    const newResetDate = new Date();
    newResetDate.setDate(newResetDate.getDate() + 30);
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        freeGenerationsUsed: 0,
        freeGenerationsReset: newResetDate,
      },
    });
    
    return true; // They can generate after reset
  }

  // Check if the user has used all free generations
  return user.freeGenerationsUsed < 3;
}

/**
 * Increments the generation count for a user
 */
export async function incrementUserGeneration(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Only increment for free users
  if (user.subscriptionTier === SubscriptionTier.FREE) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        freeGenerationsUsed: { increment: 1 },
      },
    });
  }
}

/**
 * Gets user stats including generation limits and usage
 */
export async function getUserStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      freeGenerationsUsed: true,
      freeGenerationsReset: true,
      createdAt: true,
      mealPlans: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isPremium = user.subscriptionTier === SubscriptionTier.PREMIUM;
  const generationsRemaining = isPremium ? 'Unlimited' : Math.max(0, 3 - user.freeGenerationsUsed);
  const nextResetDate = new Date(user.freeGenerationsReset);
  nextResetDate.setMonth(nextResetDate.getMonth() + 1);

  return {
    generationsUsed: user.freeGenerationsUsed,
    generationsRemaining,
    isPremium,
    memberSince: user.createdAt,
    totalMealPlans: user.mealPlans.length,
    nextResetDate: isPremium ? null : nextResetDate,
  };
}