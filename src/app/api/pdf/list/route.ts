import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserPDFs } from '@/lib/pdf';

export async function GET(request: NextRequest) {
  try {
    // Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id as string;
    
    // Get PDFs for the current user
    const pdfs = await getUserPDFs(userId);
    
    return NextResponse.json({ pdfs });
    
  } catch (error: any) {
    console.error('Error listing PDFs:', error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while listing PDFs.' },
      { status: 500 }
    );
  }
}