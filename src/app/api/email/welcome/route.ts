import { NextRequest, NextResponse } from 'next/server';
import { deliverCustomerWelcomeEmail } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface RequestBody {
  email: string;
  productName: string;
  accessUrl: string;
  purchaseAmount: number;
  productType: 'recipe' | 'meal_plan' | 'subscription';
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate the request (only admin or server should call this)
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await request.json() as RequestBody;
    
    // Validate required parameters
    if (!body.email || !body.productName || !body.accessUrl || !body.purchaseAmount || !body.productType) {
      return NextResponse.json(
        { error: 'Missing required parameters.' },
        { status: 400 }
      );
    }
    
    // Send welcome email
    const success = await deliverCustomerWelcomeEmail(
      body.email,
      body.productName,
      body.accessUrl,
      body.purchaseAmount,
      body.productType
    );
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to deliver welcome email.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Error delivering welcome email:', error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while delivering welcome email.' },
      { status: 500 }
    );
  }
}