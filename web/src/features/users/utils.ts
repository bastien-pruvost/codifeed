import type { UserRead } from "@/types/generated/api.gen"

export function getUserInitials(user: UserRead) {
  const displayName = user.name || user.username
  return (displayName || "?").slice(0, 1).toUpperCase()
}
