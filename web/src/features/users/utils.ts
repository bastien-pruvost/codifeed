import type { UserPublic } from "@/types/generated/api.gen"

export function getUserInitials(user: UserPublic) {
  const displayName = user.name || user.username
  return (displayName || "?").slice(0, 1).toUpperCase()
}
