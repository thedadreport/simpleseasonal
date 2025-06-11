import "next-auth";
import { SubscriptionTier } from "@prisma/client";

declare module "next-auth" {
  /**
   * Extend the built-in Session interface
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      subscriptionTier: "FREE" | "PREMIUM";
    };
  }

  /**
   * Extend the built-in User interface
   */
  interface User {
    subscriptionTier: SubscriptionTier;
    freeGenerationsUsed: number;
    freeGenerationsReset: Date;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the built-in JWT interface
   */
  interface JWT {
    id: string;
    subscriptionTier: SubscriptionTier;
  }
}