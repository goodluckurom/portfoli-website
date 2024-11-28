'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Comment, User } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';

interface CommentListProps {
  comments: (Comment & {
    user: Pick<User, 'name' | 'image'>;
  })[];
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CommentList({
  comments,
  onApprove,
  onDelete,
}: CommentListProps) {
  const [selectedComments, setSelectedComments] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedComments(comments.map((comment) => comment.id));
    } else {
      setSelectedComments([]);
    }
  };

  const handleSelect = (commentId: string, checked: boolean) => {
    if (checked) {
      setSelectedComments([...selectedComments, commentId]);
    } else {
      setSelectedComments(selectedComments.filter((id) => id !== commentId));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedComments.map((id) => onDelete(id)));
      setSelectedComments([]);
      toast.success('Selected comments deleted successfully');
    } catch (error) {
      toast.error('Failed to delete selected comments');
    }
  };

  const handleBulkApprove = async () => {
    try {
      await Promise.all(selectedComments.map((id) => onApprove(id)));
      setSelectedComments([]);
      toast.success('Selected comments approved successfully');
    } catch (error) {
      toast.error('Failed to approve selected comments');
    }
  };

  return (
    <div className="space-y-4">
      {selectedComments.length > 0 && (
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleBulkApprove}
          >
            Approve Selected ({selectedComments.length})
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
          >
            Delete Selected ({selectedComments.length})
          </Button>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedComments.length === comments.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedComments.includes(comment.id)}
                    onCheckedChange={(checked) =>
                      handleSelect(comment.id, !!checked)
                    }
                  />
                </TableCell>
                <TableCell>{comment.user.name}</TableCell>
                <TableCell className="max-w-md">
                  <div className="line-clamp-2">{comment.content}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={comment.approved ? 'default' : 'secondary'}
                  >
                    {comment.approved ? 'Approved' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {!comment.approved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onApprove(comment.id)}
                      >
                        <Icons name='check' className="h-4 w-4" />
                        <span className="sr-only">Approve</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(comment.id)}
                      className="text-red-600"
                    >
                      <Icons name='trash' className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
