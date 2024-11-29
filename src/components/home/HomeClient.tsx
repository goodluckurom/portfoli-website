"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Experience, User, SocialLink, Project, Blog } from "@prisma/client";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { SkillsSection } from "@/components/home/SkillsSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { BlogSection } from "@/components/home/BlogSection";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ContactForm from "@/components/contact/ContactForm";
import { Skeleton } from "@/components/ui/skeleton";
import { FloatingBall } from "@/components/FloatingBall";
import { SocialLinks } from "@/components/social-links";

interface BlogWithCounts extends Blog {
  user: {
    name: string | null;
  };
  _count: {
    comments: number;
    likes: number;
    bookmarks: number;
  };
  liked: boolean;
  bookmarked: boolean;
}

interface HomeClientProps {
  initialData: {
    user: (User & { socialLinks: SocialLink[] }) | null;
    experiences: Experience[];
    skills: any[];
    projects: Project[];
    blogs: BlogWithCounts[];
  };
}

export function HomeClient({ initialData }: HomeClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
    setIsLoading(false);
  }, [initialData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <main className="min-h-screen bg-background">
     

      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-2/3" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-24 w-full" />
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              ) : (
                <>
                  <motion.h1
                    variants={itemVariants}
                    className="text-4xl md:text-6xl font-bold"
                  >
                    Hi, I'm{" "}
                    <span className="text-primary-500">{data.user?.name}</span>
                  </motion.h1>
                  <motion.h2
                    variants={itemVariants}
                    className="text-xl text-muted-foreground"
                  >
                    {data.user?.headline || "Your Title"}
                  </motion.h2>
                  <motion.p
                    variants={itemVariants}
                    className="text-lg text-muted-foreground/80"
                  >
                    {data.user?.bio || "Your Bio"}
                  </motion.p>
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap gap-4"
                  >
                    <Button asChild size="lg">
                      <Link href="/projects">View Projects</Link>
                    </Button>
                    {data.user?.resumeUrl && (
                      <Button asChild variant="outline" size="lg">
                        <Link
                          href={data.user.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Icons name="fileText" className="mr-2 h-4 w-4" />
                          Download Resume
                        </Link>
                      </Button>
                    )}
                  </motion.div>
                  {data.user?.socialLinks &&
                    data.user.socialLinks.length > 0 && (
                      <motion.div
                        variants={itemVariants}
                        className="flex gap-4"
                      >
                        <SocialLinks links={data.user.socialLinks} />
                      </motion.div>
                    )}
                </>
              )}
            </motion.div>
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="show"
              className="relative flex justify-center w-full md:w-auto -mt-14"
            >
              {data.user?.image && (
                <Image
                  src={data.user.image}
                  alt={data.user.name || "Profile"}
                  height={900}
                  width={700}
                  className="object-cover rounded-t-2xl max-h-[80vh] md:max-h-[800px] w-auto"
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, black 80%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 80%, transparent 100%)",
                  }}
                  priority
                />
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <ExperienceSection experiences={data.experiences} isLoading={isLoading} />

      {/* Skills Section */}
      <SkillsSection skills={data.skills} isLoading={isLoading} />

      {/* Projects Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              ease: "easeOut",
            },
          },
        }}
      >
        <ProjectsSection projects={data.projects} isLoading={isLoading} />
      </motion.div>

      {/* Blog Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              ease: "easeOut",
            },
          },
        }}
      >
        <BlogSection blogs={data.blogs} isLoading={isLoading} />
      </motion.div>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left side - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                  Let's Create Something Amazing Together
                </h2>
                <p className="text-lg text-muted-foreground">
                  Have a project in mind or just want to chat? I'm always excited to collaborate on new ideas and challenges.
                </p>
              </div>

              <div className="space-y-6">
                {data.user?.email && (
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
                      <Icons name="mail" className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a href={`mailto:${data.user.email}`} className="text-lg hover:text-primary-500 transition-colors">
                        {data.user.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {data.user?.location && (
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
                      <Icons name="mapPin" className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="text-lg">{data.user.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {data.user?.socialLinks && data.user.socialLinks.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Follow me on</p>
                  <div className="flex gap-4">
                    <SocialLinks links={data.user.socialLinks} />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right side - Contact Form Dialog */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg blur opacity-30"></div>
              <div className="relative p-8 bg-card rounded-lg border shadow-lg space-y-6">
                <h3 className="text-2xl font-semibold">Send a Message</h3>
                <p className="text-muted-foreground">
                  Fill out the form below and I'll get back to you as soon as possible.
                </p>
                <ContactForm />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
