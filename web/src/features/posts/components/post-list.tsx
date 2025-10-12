import type { ComponentProps } from "react"
import { Link } from "@tanstack/react-router"
import { MoreHorizontalIcon, TrashIcon } from "lucide-react"

import type { PostPublic } from "@/types/generated/api.gen"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { P } from "@/components/ui/typography"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"
import { useDeletePostMutation } from "@/features/posts/api/post-mutations"
import { UserAvatar } from "@/features/users/components/user-avatar"
import { useRelativeTimeText } from "@/hooks/use-relative-time"
import { cn } from "@/utils/classnames"

export function PostList({
  children,
  className,
  ...props
}: ComponentProps<typeof Card>) {
  return (
    <Card className={cn("gap-0", className)} {...props}>
      {children}
    </Card>
  )
}

export function PostListHeader({
  children,
  className,
  ...props
}: ComponentProps<typeof CardHeader>) {
  return (
    <CardHeader className={cn("mb-6 gap-0 border-b", className)} {...props}>
      {children}
    </CardHeader>
  )
}

export function PostListContent({
  children,
  className,
  ...props
}: ComponentProps<typeof CardContent>) {
  return (
    <CardContent className={cn("flex flex-col divide-y", className)} {...props}>
      {children}
    </CardContent>
  )
}

interface PostListItemProps extends ComponentProps<"div"> {
  post: PostPublic
}

export function PostListItem({ post, className, ...props }: PostListItemProps) {
  const currentUser = useCurrentUser()
  const isOwnPost = currentUser.id === post.author.id

  return (
    <div className={cn("py-4 first:pt-0 last:pb-0", className)} {...props}>
      <div className="flex items-center gap-3">
        <Link to="/$username" params={{ username: post.author.username }}>
          <UserAvatar user={post.author} className="size-10 shrink-0" />
        </Link>
        <div className="flex-1">
          <Link
            to="/$username"
            params={{ username: post.author.username }}
            className="group flex max-w-fit flex-wrap items-center gap-x-1 gap-y-0.5 font-semibold"
          >
            <span className="group-hover:underline">{post.author.name}</span>
            <span className="text-sm font-normal text-muted-foreground group-hover:underline group-hover:decoration-current">
              @{post.author.username}
            </span>
          </Link>
          {post.createdAt && <PostListItemRelativeTime time={post.createdAt} />}
        </div>
        {isOwnPost && <PostListItemDropdown post={post} />}
      </div>

      <P className="mt-2 ml-13 break-words whitespace-pre-wrap">
        {post.content}
      </P>
    </div>
  )
}

export function PostListItemRelativeTime({ time }: { time: string }) {
  const relativeTime = useRelativeTimeText(time)

  return (
    <div className="text-sm font-normal text-muted-foreground">
      {relativeTime}
    </div>
  )
}

interface PostListItemDropdownProps extends ComponentProps<typeof Button> {
  post: PostPublic
}

export function PostListItemDropdown({
  post,
  className,
  ...props
}: PostListItemDropdownProps) {
  const deletePost = useDeletePostMutation()

  return (
    <Dialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="More options"
            className={className}
            {...props}
          >
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <TrashIcon className="size-4" />
              Delete
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={() => deletePost.mutate(post.id)}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function PostListEmpty({ children }: ComponentProps<typeof P>) {
  children ??= "No posts yet."
  return (
    <P tone="muted" className="text-center">
      {children}
    </P>
  )
}

export function PostListItemSkeleton() {
  return (
    <div className="py-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-24 flex-initial" />
            <Skeleton className="h-3 w-18 flex-initial" />
          </div>
          <Skeleton className="mt-1.5 h-3 max-w-32" />
        </div>
      </div>
      <Skeleton className="mt-3 ml-13 h-4 max-w-96" />
      <Skeleton className="mt-2 ml-13 h-4 max-w-64" />
    </div>
  )
}
