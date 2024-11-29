import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { socialPlatformData } from "@/lib/social-icons";

// Schema for validating the request body
const settingsSchema = z.object({
  name: z.string().optional(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  resumeUrl: z.string().url().optional().nullable(),
  image: z.string().url().optional(),
  socialLinks: z.array(z.object({
    id: z.string().optional(),
    platform: z.enum([
      "GITHUB",
      "LINKEDIN",
      "TWITTER",
      "INSTAGRAM",
      "FACEBOOK",
      "YOUTUBE",
      "DRIBBBLE",
      "BEHANCE",
      "MEDIUM",
      "DEVTO",
      "WEBSITE",
      "OTHER"
    ]),
    url: z.string().url(),
  })).optional(),
});

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        headline: true,
        location: true,
        resumeUrl: true,
        role: true,
        socialLinks: {
          select: {
            id: true,
            platform: true,
            url: true,
            name: true,
            icon: true,
          },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = settingsSchema.parse(body);

    // Start a transaction to handle social links update
    const user = await prisma.$transaction(async (tx) => {
      // If socialLinks are provided, delete existing ones and create new ones
      if (validatedData.socialLinks) {
        await tx.socialLink.deleteMany({
          where: {
            user: {
              email: session.email,
            },
          },
        });
      }

      return tx.user.update({
        where: {
          email: session.email,
        },
        data: {
          ...validatedData,
          socialLinks: validatedData.socialLinks ? {
            create: validatedData.socialLinks.map(link => ({
              platform: link.platform,
              url: link.url,
              name: socialPlatformData[link.platform].name,
              icon: socialPlatformData[link.platform].icon,
            })),
          } : undefined,
        },
        include: {
          socialLinks: true,
        },
      });
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 });
    }

    console.error("[SETTINGS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
