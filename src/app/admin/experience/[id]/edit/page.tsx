import { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ExperienceForm } from "../../_components/ExperienceForm";
import { getDynamicConfig } from '@/lib/dynamic';

export const metadata: Metadata = {
  title: "Edit Experience",
  description: "Edit work experience",
};

export const dynamic = getDynamicConfig('/admin/experience/[id]/edit');

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditExperiencePage({ params }: PageProps) {
 // Server-side authentication check
  const session = await getSession();
  
  if (!session || session?.role!=='ADMIN') {
    redirect("/");
  }
  const experience = await prisma.experience.findUnique({
    where: { id: params.id },
  });

  if (!experience) {
    redirect("/admin/experience");
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl">Edit Experience</h1>
        <p className="text-lg text-muted-foreground">
          Update your work experience details
        </p>

        <div className="mt-8">
          <ExperienceForm experience={experience} />
        </div>
      </div>
    </div>
  );
}
