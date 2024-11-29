import { getSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Pass the request to getSession to handle cookies properly
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    

    return NextResponse.json({ 
      user: {
        id: session.id,
        role: session.role,
        email: session.email,
        name: session.name,
        image: session.image
      } 
    });
  } catch (error) {
    console.error('Error in /api/auth/user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user session' }, 
      { status: 500 }
    );
  }
}
