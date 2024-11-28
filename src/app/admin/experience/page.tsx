import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {ExperienceClient} from "./ExperienceClient";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Experience Management",
  description: "Manage your work experience",
};

export default async function ExperiencePage() {
  const session = await getSession();

  if (!session?.email || session.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  const experiences = await prisma.experience.findMany({
    orderBy: {
      startDate: "desc",
    },
  });

  return <ExperienceClient experiences={experiences} />;
}
