import { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ExperienceForm } from "../_components/ExperienceForm";

export const metadata: Metadata = {
  title: "Add Experience",
  description: "Add a new work experience",
};

export default async function NewExperiencePage() {
  const session = await getSession();

  if (!session?.email || session.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl">Add Experience</h1>
        <p className="text-lg text-muted-foreground">
          Add a new work experience to your portfolio
        </p>

        <div className="mt-8">
          <ExperienceForm />
        </div>
      </div>
    </div>
  );
}
