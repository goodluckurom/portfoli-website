import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getSession, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDynamicConfig } from '@/lib/dynamic';

const f = createUploadthing();

export const dynamic = getDynamicConfig('/api/uploadthing');

export const ourFileRouter = {
  profileImageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const session = await getSession();

      if (!session || !isAdmin(session)) {
        throw new Error("Unauthorized");
      }

      return { userId: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.user.update({
        where: { id: metadata.userId },
        data: { image: file.url },
      });

      return { uploadedBy: metadata.userId };
    }),

  blogImageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const session = await getSession();

      if (!session || !isAdmin(session)) {
        throw new Error("Unauthorized");
      }

      return { userId: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),

  projectImageUploader: f({ image: { maxFileSize: "4MB",maxFileCount:10 } })
    .middleware(async () => {
      const session = await getSession();

      if (!session || !isAdmin(session)) {
        throw new Error("Unauthorized");
      }

      return { userId: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),

  techStackImageUploader: f({ image: { maxFileSize: "2MB" ,maxFileCount:15} })
    .middleware(async () => {
      const session = await getSession();

      if (!session || !isAdmin(session)) {
        throw new Error("Unauthorized");
      }

      return { userId: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),

  skillImageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const session = await getSession();

      if (!session || !isAdmin(session)) {
        throw new Error("Unauthorized");
      }

      return { userId: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),

  resumeUploader: f({ pdf: { maxFileSize: "8MB" } })
    .middleware(async () => {
      const session = await getSession();

      if (!session || !isAdmin(session)) {
        throw new Error("Unauthorized");
      }

      return { userId: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.user.update({
        where: { id: metadata.userId },
        data: { resumeUrl: file.url },
      });

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
