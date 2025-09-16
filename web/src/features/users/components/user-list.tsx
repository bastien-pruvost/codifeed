import { type ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InlineLink } from "@/components/ui/inline-link"
import { UserAvatar } from "@/features/users/components/user-avatar"
import { type UserPublic } from "@/types/generated/api.gen"

interface UserListTitleProps {
  children: ReactNode
}

export function UserListTitle({ children }: UserListTitleProps) {
  return (
    <CardHeader>
      <CardTitle>{children}</CardTitle>
    </CardHeader>
  )
}

interface UserListContentProps {
  children: ReactNode
}

export function UserListContent({ children }: UserListContentProps) {
  return (
    <CardContent className="flex flex-col divide-y">{children}</CardContent>
  )
}

interface UserListItemProps {
  user: UserPublic
}

export function UserListItem({ user }: UserListItemProps) {
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
  children: ReactNode
}

export function UserList({ children }: UserListProps) {
  return <Card>{children}</Card>
}
