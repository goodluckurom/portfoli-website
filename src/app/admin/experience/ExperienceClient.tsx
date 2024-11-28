"use client";

import { useState } from "react";
import { Experience } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "@/components/icons";
import { toast } from "@/components/ui/use-toast";

interface ExperienceClientProps {
  experiences: Experience[];
}

export function ExperienceClient({ experiences }: ExperienceClientProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/experiences/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete experience");
      }

      toast({
        description: "Experience deleted successfully",
      });

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Experience</h1>
          <p className="text-muted-foreground">
            Manage your work experience and achievements.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/experience/new">
            <Icons name="add" className="mr-2 h-4 w-4" />
            Add Experience
          </Link>
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((experience) => (
              <TableRow key={experience.id}>
                <TableCell className="font-medium">
                  {experience.position}
                </TableCell>
                <TableCell>{experience.company}</TableCell>
                <TableCell>
                  {format(new Date(experience.startDate), "MMM yyyy")} -{" "}
                  {experience.endDate
                    ? format(new Date(experience.endDate), "MMM yyyy")
                    : "Present"}
                </TableCell>
                <TableCell>
                  {!experience.endDate ? (
                    <Badge>Current</Badge>
                  ) : (
                    <Badge variant="secondary">Past</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <Link href={`/admin/experience/${experience.id}/edit`}>
                        <Icons name="edit" className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isLoading}
                      onClick={() => handleDelete(experience.id)}
                    >
                      <Icons name="trash" className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {experiences.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No experiences found. Add your first work experience.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
