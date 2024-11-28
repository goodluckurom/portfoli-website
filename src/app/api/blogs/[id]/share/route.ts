import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// POST /api/blogs/[id]/share - Track blog share
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { platform } = await request.json();

    // For now, we'll just track the share event in analytics
    // In the future, you might want to store this in a separate ShareEvent model
    console.log(`Blog ${params.id} shared on ${platform}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to track share:', error);
    return NextResponse.json(
      { error: 'Failed to track share' },
      { status: 500 }
    );
  }
}
