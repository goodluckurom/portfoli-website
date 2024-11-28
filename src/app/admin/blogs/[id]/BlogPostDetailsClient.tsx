"use client";

import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Blog, Comment, User } from "@prisma/client";

type BlogWithComments = Blog & {
  comments: (Comment & {
    user: User;
  })[];
};

interface BlogPostDetailsClientProps {
  initialData: BlogWithComments;
}

export function BlogPostDetailsClient({
  initialData,
}: BlogPostDetailsClientProps) {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogWithComments>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/blogs/${params.id}?includeComments=true`
      );
      if (!response.ok) throw new Error("Failed to fetch post");
      const data = await response.json();
      setPost(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(
        `/api/blogs/${params.id}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete comment");

      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((comment) => comment.id !== commentId),
      }));

      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
    setCommentToDelete(null);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Back button */}
      <Button
        variant="outline"
        onClick={() => router.push("/admin/blogs")}
        className="mb-6"
      >
        <Icons name="chevronleft" className="mr-2 h-4 w-4" />
        Back to Blog List
      </Button>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Icons name="spinner" className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {/* Blog post details */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{post.title}</CardTitle>
                  <CardDescription>
                    Created: {format(new Date(post.createdAt), "PPP")}
                    {post.updatedAt !== post.createdAt && (
                      <> · Updated: {format(new Date(post.updatedAt), "PPP")}</>
                    )}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/admin/blogs/${post.id}/edit`)}
                >
                  <Icons name="pencil" className="mr-2 h-4 w-4" />
                  Edit Post
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>

          {/* Comments section */}
          <Card>
            <CardHeader>
              <CardTitle>Comments ({post.comments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {post.comments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No comments yet
                  </p>
                ) : (
                  post.comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-sm font-medium">
                              {comment.user.name || "Anonymous"}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {format(new Date(comment.createdAt), "PPP")}
                            </CardDescription>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive/90"
                                onClick={() => setCommentToDelete(comment.id)}
                              >
                                <Icons name="trash" className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Comment
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this comment?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() =>
                                    handleDeleteComment(comment.id)
                                  }
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">{comment.content}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
