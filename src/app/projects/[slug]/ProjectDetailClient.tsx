'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeContext } from '@/providers/ThemeProvider';
import { MDXRemote } from 'next-mdx-remote';
import { cn } from '@/lib/utils';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { ImageViewer } from '@/components/ui/image-viewer';

interface ProjectClientProps {
  project: Project;
  mdxSource: any;
}

export function ProjectClient({ project, mdxSource }: ProjectClientProps) {
  const { isDark } = useThemeContext();
  const [parent] = useAutoAnimate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    if (!project.images?.length) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % project.images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [project.images]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    if (!project.images?.length) return;
    setCurrentSlide((prev) => (prev + 1) % project.images.length);
  };

  const prevSlide = () => {
    if (!project.images?.length) return;
    setCurrentSlide((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <article className="container max-w-5xl mx-auto py-10 px-4" ref={parent}>
      {/* Back Button */}
      <Link
        href="/projects"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Projects
      </Link>

      {/* Title and Description */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {project.description}
        </p>
      </div>

      {/* Tech Stack Icons */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {project.techStack.map((tech, index) => (
              <div key={index} className="relative group">
                <img
                  src={tech}
                  alt={`Technology ${index + 1}`}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-background transition-transform hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Carousel */}
      {project.images && project.images.length > 0 && (
        <ImageViewer images={project.images} title={project.title} />
      )}

      {/* Technologies */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Technologies Used</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="default" className="text-base px-4 py-2">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none mb-12">
        <MDXRemote {...mdxSource} />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6">
        {project.github && (
          <Link href={project.github} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="gap-2">
              <Github className="w-5 h-5" />
              View Source
            </Button>
          </Link>
        )}
        {project.link && (
          <Link href={project.link} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gap-2">
              <ExternalLink className="w-5 h-5" />
              Visit Project
            </Button>
          </Link>
        )}
      </div>
    </article>
  );
}
