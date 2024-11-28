"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Project } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  project: Project;
  isAdmin?: boolean;
}

export function ProjectCard({
  project,
  isAdmin = false,
  className,
  ...props
}: ProjectCardProps) {
  return (
    <Card
      className={cn("overflow-hidden h-full flex flex-col", className)}
      {...props}
    >
      {project.images && project.images.length > 0 && (
        <div className="relative aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.images[0]}
            alt={project.title}
            className="object-cover w-full h-full"
          />
          {project.status !== "COMPLETED" && (
            <Badge
              className="absolute top-2 right-2"
              variant={
                project.status === "IN_PROGRESS" ? "default" : "secondary"
              }
            >
              {project.status === "IN_PROGRESS" ? "In Progress" : "Planned"}
            </Badge>
          )}
        </div>
      )}

      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow">
        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="default">
                {tech}
              </Badge>
            ))}
          </div>
        )}

        {/* Tech Stack Images */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((imageUrl, index) => (
              <div key={index} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={`Technology ${index + 1}`}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-background-main"
                />
              </div>
            ))}
          </div>
        )}

        {/* Content Preview */}
        {project.content && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {project.content}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap items-center gap-4">
        <Button asChild variant="default" size="sm">
          <Link href={`/projects/${project.slug}`}>View Details</Link>
        </Button>
        {project.github && (
          <Button asChild variant="ghost" size="sm">
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium"
            >
              GitHub
            </Link>
          </Button>
        )}
        {project.link && (
          <Button asChild variant="ghost" size="sm">
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium"
            >
              Live Demo
            </Link>
          </Button>
        )}
        {isAdmin && (
          <Button asChild variant="ghost" size="sm" className="ml-auto">
            <Link
              href={`/admin/projects/${project.id}`}
              className="text-sm font-medium"
            >
              Edit
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
