import { useSuspenseQuery } from "@tanstack/react-query"

import { userQueries } from "@/features/users/api/user-queries"

export function useCurrentUser() {
  const { data: currentUser } = useSuspenseQuery(userQueries.currentUser())
  if (!currentUser) {
    throw new Error(
      "Current user is null in a protected route. `useCurrentUser` must be used within a `_app` route.",
    )
  }
  return currentUser
}

export function useOptionalCurrentUser() {
  const { data: currentUser } = useSuspenseQuery(userQueries.currentUser())
  return currentUser
}
