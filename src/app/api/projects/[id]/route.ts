import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        technologies: true,
        techStack: true,
        images: true,
        github: true,
        link: true,
        status: true,
        published: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
        slug: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const session = await getSession();
    if (!project.published && !session) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const json = await request.json();

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        title: json.title,
        description: json.description,
        content: json.content,
        technologies: json.technologies,
        techStack: json.techStack || [],
        images: json.images || [],
        github: json.github || '',
        link: json.link || '',
        status: json.status,
        published: json.published,
        featured: json.featured,
        slug: json.slug || json.title.toLowerCase().replace(/\s+/g, '-'),
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
