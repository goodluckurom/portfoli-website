import { NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';
import { decrypt } from '@/lib/auth';

const utapi = new UTApi();

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token || !(await decrypt(token))) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files.length) {
      return NextResponse.json(
        { message: 'No files provided' },
        { status: 400 }
      );
    }

    // Upload to uploadthing
    const responses = await utapi.uploadFiles(files);
    
    const urls = responses
      .filter(response => response.data?.url)
      .map(response => response.data?.url);

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { message: 'Error uploading files' },
      { status: 500 }
    );
  }
}
