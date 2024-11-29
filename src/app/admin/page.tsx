"use client";

import { useEffect, useState } from "react";
import { FileText, Briefcase, Award, Code, Clock } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface DashboardStats {
  blogs: number;
  projects: number;
  experience: number;
  skills: number;
}

interface RecentItem {
  id: string;
  title: string;
  createdAt: string;
  published: boolean;
  status?: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentBlogs: RecentItem[];
  recentProjects: RecentItem[];
}

const initialStats: DashboardStats = {
  blogs: 0,
  projects: 0,
  experience: 0,
  skills: 0,
};

const stats = [
  {
    name: "Blog Posts",
    href: "/admin/blogs",
    icon: FileText,
    key: "blogs" as const,
    description: "Total number of blog posts",
  },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: Briefcase,
    key: "projects" as const,
    description: "Total number of portfolio projects",
  },
  {
    name: "Experience",
    href: "/admin/experience",
    icon: Award,
    key: "experience" as const,
    description: "Work experience entries",
  },
  {
    name: "Skills",
    href: "/admin/skills",
    icon: Code,
    key: "skills" as const,
    description: "Technical skills and proficiencies",
  },
] as const;

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: initialStats,
    recentBlogs: [],
    recentProjects: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your portfolio dashboard. Manage your content and settings
          here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.name} className="relative overflow-hidden">
            <Link href={item.href}>
              <div className="p-6 flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">{item.name}</h3>
                </div>
                <div className="flex items-center justify-between">
                  {loading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    <div className="space-y-1">
                      <p className="text-3xl font-bold">
                        {dashboardData.stats[item.key]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-200/10" />
            </Link>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Blog Posts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Blog Posts</h2>
            <Link
              href="/admin/blogs/new"
              className="text-sm text-primary hover:underline"
            >
              Create New
            </Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              Array(5)
                .fill(0)
                .map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : dashboardData.recentBlogs.length > 0 ? (
              dashboardData.recentBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{blog.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {formatDistanceToNow(new Date(blog.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                  <Badge variant={blog.published ? "default" : "secondary"}>
                    {blog.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No blog posts yet
              </p>
            )}
          </div>
        </Card>

        {/* Recent Projects */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Projects</h2>
            <Link
              href="/admin/projects/new"
              className="text-sm text-primary hover:underline"
            >
              Create New
            </Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              Array(5)
                .fill(0)
                .map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : dashboardData.recentProjects.length > 0 ? (
              dashboardData.recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{project.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {formatDistanceToNow(new Date(project.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">{project.status}</Badge>
                    <Badge
                      variant={project.published ? "default" : "secondary"}
                    >
                      {project.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No projects yet
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
