import { type ReactNode } from "react"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { InlineLink } from "@/components/ui/inline-link"
import { Spinner } from "@/components/ui/spinner"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { type UserPublic } from "@/types/generated/api.gen"

import { UserAvatar } from "./user-avatar"

interface UserListItemProps {
  user: UserPublic
}

function UserListItem({ user }: UserListItemProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <UserAvatar user={user} className="size-9" />
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium text-foreground">{user.name}</div>
        <div className="truncate text-sm text-muted-foreground">
          <InlineLink asChild>
            <a href={`/${user.username}`}>@{user.username}</a>
          </InlineLink>
        </div>
      </div>
    </div>
  )
}

interface UserListProps {
  title: string
  users: UserPublic[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => Promise<unknown> | void
  children?: ReactNode
}

export function UserList({
  title,
  users,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  children,
}: UserListProps) {
  const { ref } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  })

  return (
    <Card>
      <CardContent>
        <CardTitle className="mb-4">{title}</CardTitle>
        <div className="flex flex-col divide-y">
          {users.map((user) => (
            <UserListItem key={user.id} user={user} />
          ))}
        </div>
        {children}
        {isFetchingNextPage ? (
          <Spinner className="mx-auto my-8" />
        ) : hasNextPage ? (
          <div ref={ref} className="my-2 h-4" />
        ) : null}
      </CardContent>
    </Card>
  )
}
