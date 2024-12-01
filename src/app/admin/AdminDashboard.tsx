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

const statsItems = [
  {
    icon: FileText,
    label: "Total Blogs",
    key: "blogs" as const,
    description: "Published and draft blog posts",
  },
  {
    icon: Briefcase,
    label: "Projects",
    key: "projects" as const,
    description: "Completed and ongoing projects",
  },
  {
    icon: Award,
    label: "Experience",
    key: "experience" as const,
    description: "Years of professional experience",
  },
  {
    icon: Code,
    label: "Skills",
    key: "skills" as const,
    description: "Technical skills and proficiencies",
  },
] as const;

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: initialStats,
    recentBlogs: [],
    recentProjects: [],
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsItems.map(({ icon: Icon, label, key, description }) => (
          <Card key={key} className="p-6">
            <div className="flex items-center gap-4">
              <Icon className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-2xl font-bold">
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    dashboardData.stats[key]
                  )}
                </h3>
                <p className="text-muted-foreground">{label}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </Card>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Blogs */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Blogs</h2>
            <Link
              href="/admin/blogs"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.recentBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{blog.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(blog.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge variant={blog.published ? "default" : "secondary"}>
                    {blog.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Projects */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Projects</h2>
            <Link
              href="/admin/projects"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(project.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
                    {project.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
