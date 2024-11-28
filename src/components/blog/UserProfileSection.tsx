"use client";

import { Session } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileSectionProps {
  session: Session;
  variant?: "default" | "single-post";
}

export function UserProfileSection({ session, variant = "default" }: UserProfileSectionProps) {
  if (session) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between p-4 mb-8 bg-card rounded-lg border">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={session.image || ""} alt={session.name || ""} />
            <AvatarFallback>
              {session.name?.charAt(0) || session.email.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{session.name || "User"}</p>
            <p className="text-sm text-muted-foreground">{session.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/profile">
              <Icons name="bookmark" className="mr-2 h-4 w-4" />
              View Bookmarks
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Non-authenticated state
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between p-4 mb-8 bg-card rounded-lg border">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>
            <Icons name="user" className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <p className="font-medium">Welcome to the Blog</p>
          <p className="text-sm text-muted-foreground">
            {variant === "single-post" 
              ? "Sign in to like, comment, and bookmark this post"
              : "Sign in to like, comment, and bookmark posts"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild size="sm">
          <Link href="/auth/login">
            <Icons name="login" className="mr-2 h-4 w-4" />
            Sign In
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/auth/register">
            Create Account
          </Link>
        </Button>
      </div>
    </div>
  );
}
