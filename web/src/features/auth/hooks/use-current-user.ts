import { useQuery } from "@tanstack/react-query"

import { currentUserQueryOptions } from "@/features/auth/api/current-user-query"

export function useCurrentUser() {
  const { data } = useQuery(currentUserQueryOptions())
  return data
}
