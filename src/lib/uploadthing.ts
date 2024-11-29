import { generateComponents } from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react/hooks";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

// Only import and use UTApi in server components or API routes
export const deleteUploadThing = async (fileKey: string) => {
  const response = await fetch("/api/uploadthing/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileKey }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete file");
  }

  return response.json();
};
