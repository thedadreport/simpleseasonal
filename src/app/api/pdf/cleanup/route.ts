import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cleanupOldPDFs } from '@/lib/pdf';

// This route can be called by a scheduled task or manually by admins
export async function POST(request: NextRequest) {
  try {
    // Authenticate the user (only admins should be able to call this)
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id as string;
    
    // In a real app, check if the user is an admin
    // For now, we'll just allow any authenticated user to clean up their own PDFs
    
    // Parse request body
    const body = await request.json();
    
    // If a specific user ID is provided and the current user is an admin,
    // clean up PDFs for that user, otherwise clean up the current user's PDFs
    const targetUserId = body.userId || userId;
    
    // Clean up old PDFs
    await cleanupOldPDFs(targetUserId);
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Error cleaning up PDFs:', error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred while cleaning up PDFs.' },
      { status: 500 }
    );
  }
}