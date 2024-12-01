import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getDynamicConfig } from '@/lib/dynamic';

export const dynamic = getDynamicConfig('/api/projects');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const take = parseInt(searchParams.get('take') || '10');

    const where = {
      published: true,
      ...(featured && { featured: true }),
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
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
        orderBy: {
          createdAt: 'desc',
        },
        take,
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      projects,
      pagination: {
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Server-side authentication check
  const session = await getSession();
  
  if (!session || session?.role!=='ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  try {
    const json = await request.json();

    const project = await prisma.project.create({
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
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
