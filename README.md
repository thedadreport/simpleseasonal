# Seasonally Simple

An AI-powered meal planning platform for busy families.

## Project Overview

Seasonally Simple is a "Profitable Day 1" web application that helps busy families with meal planning through AI-generated recipes and meal plans.

### Core Features

- AI recipe generation with Claude API
- Email capture for marketing
- Payment processing with Stripe
- PDF meal plan delivery
- Seasonal ingredients focus

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: Claude API (Anthropic)
- **Payments**: Stripe
- **Email**: ConvertKit
- **PDF**: React PDF
- **Hosting**: Vercel

## API Connection Setup

This guide will help you connect all required APIs to test the complete flow:
1. Generate a recipe with Claude AI
2. Create a PDF of the recipe
3. Email the PDF to users via ConvertKit

### Step 1: Anthropic API (Claude AI)

1. Create an account at [Anthropic](https://console.anthropic.com/)
2. Generate an API key from your dashboard
3. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```

### Step 2: Vercel Blob Storage (PDF Storage)

1. Push your repository to GitHub
2. Create a Vercel account at [Vercel](https://vercel.com)
3. Import your GitHub repository in Vercel
4. Get your BLOB token:
   - Run `npx vercel link` to link your local project
   - Run `npx vercel env pull .env.local` to add environment variables
   - Or manually add from Vercel Dashboard > Project Settings > Storage
5. Add to `.env.local`:
   ```
   BLOB_READ_WRITE_TOKEN=your_token_here
   ```

### Step 3: ConvertKit (Email Delivery)

1. Create a ConvertKit account at [ConvertKit](https://convertkit.com)
2. Get your API credentials from Account Settings > API
3. Create tags in ConvertKit for:
   - Recipe downloads
   - Meal plan downloads
   - Seasonal interests (Summer, Fall, Winter, Spring)
   - User types (Free, Customer, Premium)
   - Engagement levels
4. Create sequences for:
   - Recipe nurture
   - Meal plan nurture
   - Customer onboarding
5. Add to `.env.local`:
   ```
   CONVERTKIT_API_KEY=your_key_here
   CONVERTKIT_API_SECRET=your_secret_here
   CONVERTKIT_TAG_RECIPE_DOWNLOAD=tag_id_here
   CONVERTKIT_TAG_MEAL_PLAN_DOWNLOAD=tag_id_here
   # Add other tag IDs
   CONVERTKIT_SEQUENCE_RECIPE_NURTURE=sequence_id_here
   CONVERTKIT_SEQUENCE_MEAL_PLAN_NURTURE=sequence_id_here
   CONVERTKIT_SEQUENCE_CUSTOMER_ONBOARDING=sequence_id_here
   ```

### Step 4: Database Connection

1. Set up a PostgreSQL database (locally or using a service like Railway/Supabase)
2. Add to `.env.local`:
   ```
   DATABASE_URL=your_db_connection_string
   ```

### Step 5: Authentication (NextAuth)

1. Generate a secure secret: `openssl rand -base64 32`
2. Add to `.env.local`:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_generated_secret
   ```

### Step 6: Testing the Flow

1. Start the development server: `npm run dev`
2. Navigate to the recipe generator page
3. Generate a recipe with seasonal ingredients
4. Check that the PDF is created and stored in Vercel Blob
5. Submit an email to receive the recipe
6. Verify the email is received with the PDF attachment

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/seasonally-simple.git
cd seasonally-simple
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Then edit `.env.local` with your actual configuration values.

4. Set up the database
```bash
npx prisma migrate dev --name init
```

5. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app`: Next.js app router pages and API routes
- `/src/components`: Reusable UI components
- `/src/lib`: Utility functions and shared logic
- `/prisma`: Database schema and migrations
- `/public`: Static assets

## License

This project is licensed under the MIT License - see the LICENSE file for details.# simpleseasonal
