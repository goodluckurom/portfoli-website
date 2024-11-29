import { NextResponse } from "next/server";
import { utapi } from "@/lib/uploadthing.server";

export async function POST(request: Request) {
  try {
    const { fileKey } = await request.json();
    
    if (!fileKey) {
      return NextResponse.json(
        { error: "File key is required" },
        { status: 400 }
      );
    }

    await utapi.deleteFiles(fileKey);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[UPLOADTHING_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
