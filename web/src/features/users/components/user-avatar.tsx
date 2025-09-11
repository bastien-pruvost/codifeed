import type { ComponentProps } from "react"

import type { UserPublic } from "@/types/generated/api.gen"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserInitials } from "@/features/users/utils"

interface UserAvatarProps extends ComponentProps<typeof Avatar> {
  user: Pick<UserPublic, "avatar" | "name" | "username">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarImage src={user.avatar ?? ""} alt={user.name} />
      <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
    </Avatar>
  )
}
