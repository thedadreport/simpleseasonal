import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import EmailProvider from 'next-auth/providers/email';
import { prisma } from './db';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || 'smtp.example.com',
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER || '',
          pass: process.env.EMAIL_SERVER_PASSWORD || '',
        },
      },
      from: process.env.EMAIL_FROM || 'no-reply@seasonallysimple.com',
    }),
  ],
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.subscriptionTier = user.subscriptionTier;
      }
      return token;
    },
    async session({ session, token, user }) {
      // When using JWT for sessions
      if (token) {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.subscriptionTier = token.subscriptionTier as 'FREE' | 'PREMIUM';
        }
      }
      
      // When using database sessions
      if (user) {
        if (session.user) {
          session.user.id = user.id;
          session.user.subscriptionTier = user.subscriptionTier as 'FREE' | 'PREMIUM';
        }
      }
      
      return session;
    },
  },
  events: {
    createUser: async ({ user }) => {
      // Create default user preferences when a new user is created
      await prisma.userPreferences.create({
        data: {
          userId: user.id,
          familySize: 2,
          childrenCount: 0,
          dietaryRestrictions: [],
          allergies: [],
          cuisinePreferences: [],
        },
      });
    },
  },
};