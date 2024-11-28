'use client';

import { Experience } from '@prisma/client';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, MapPin } from 'lucide-react';
import Link from 'next/link';

interface ExperienceSectionProps {
  experiences: Experience[];
  isLoading?: boolean;
}

export function ExperienceSection({ experiences, isLoading }: ExperienceSectionProps) {
  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Experience</h2>
          <p className="text-muted-foreground">My professional journey and work experience</p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-0 md:left-1/2 h-full w-1 bg-gradient-to-b from-primary-500 via-primary-400 to-primary-300/50 transform -translate-x-1/2 blur-[1px]" />
          <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-gradient-to-b from-primary-500 via-primary-400 to-primary-300 transform -translate-x-1/2" />

          {/* Experience Cards */}
          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 ${
                  index % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 w-5 h-5 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full transform -translate-x-1/2 z-10 shadow-lg ring-4 ring-background-main dark:ring-background-main" />

                {/* Content */}
                <div className={`${index % 2 === 0 ? 'md:text-right' : ''} ${
                  index % 2 === 0 ? 'md:col-start-1' : 'md:col-start-2'
                }`}>
                  <Card className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="space-y-1">
                        <CardTitle className="text-xl font-bold">{experience.position}</CardTitle>
                        <CardDescription className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            {experience.companyUrl ? (
                              <Link 
                                href={experience.companyUrl} 
                                target="_blank"
                                className="hover:text-primary transition-colors"
                              >
                                {experience.company}
                              </Link>
                            ) : (
                              experience.company
                            )}
                          </div>
                          {experience.location && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {experience.location}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant={experience.current ? "default" : "secondary"}>
                              {format(new Date(experience.startDate), 'MMM yyyy')} -{' '}
                              {experience.endDate
                                ? format(new Date(experience.endDate), 'MMM yyyy')
                                : 'Present'}
                            </Badge>
                            <Badge variant="outline">{experience.type}</Badge>
                          </div>
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-line mb-4">
                        {experience.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="bg-muted">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Empty Column for Layout */}
                <div className={index % 2 === 0 ? 'md:col-start-2' : 'md:col-start-1'} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
