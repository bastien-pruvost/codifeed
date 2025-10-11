import { Link } from "@tanstack/react-router"
import { type ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"
import { UserAvatar } from "@/features/users/components/user-avatar"
import { FollowButton } from "@/features/users/components/user-follow-button"
import { type UserPublic } from "@/types/generated/api.gen"

interface UserListProps {
  children: ReactNode
}

export function UserList({ children }: UserListProps) {
  return <Card>{children}</Card>
}

interface UserListContentProps {
  children: ReactNode
}

export function UserListTitle({ children }: UserListTitleProps) {
  return (
    <CardHeader>
      <CardTitle>{children}</CardTitle>
    </CardHeader>
  )
}

interface UserListItemProps {
  user: UserPublic
}

export function UserListContent({ children }: UserListContentProps) {
  return (
    <CardContent className="flex flex-col divide-y">{children}</CardContent>
  )
}

interface UserListTitleProps {
  children: ReactNode
}

export function UserListItem({ user }: UserListItemProps) {
  const currentUser = useCurrentUser()

  const isCurrentUser = currentUser.id === user.id

  return (
    <div className="flex items-center gap-3 py-3">
      <Link to="/$username" params={{ username: user.username }}>
        <UserAvatar user={user} className="size-10 shrink-0" />
      </Link>

      <Link
        to="/$username"
        params={{ username: user.username }}
        className="group flex-1 font-semibold"
      >
        <div className="group-hover:underline">{user.name}</div>
        <div className="text-sm font-normal text-muted-foreground group-hover:underline group-hover:decoration-current">
          @{user.username}
        </div>
      </Link>

      {!isCurrentUser && <FollowButton user={user} />}
    </div>
  )
}
