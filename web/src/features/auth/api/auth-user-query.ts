import { queryOptions } from "@tanstack/react-query"

import { shouldBeAuthenticated } from "@/features/auth/services/auth-flag-storage"
import { api } from "@/services/fetch-client"
import { QUERY_KEYS } from "@/services/query-client"

export function authUserQueryOptions(options?: { forceEnabled?: boolean }) {
  return queryOptions({
    queryKey: [QUERY_KEYS.authUser],
    queryFn: async () => {
      return shouldBeAuthenticated()
        ? api.GET("/users/me", {}).then((res) => {
            console.log({ res })
            return res.data ?? null
          })
        : null
    },
    enabled: shouldBeAuthenticated() ?? options?.forceEnabled,
    meta: {
      errorMessage: "You are not authenticated",
    },
    staleTime: 0, // delete
    refetchInterval: 1000 * 60 * 5, // 5 minutes - periodic check for long sessions
    refetchOnWindowFocus: true, // Check when user returns to tab
    refetchOnMount: true, // Refetch on every component mount
    refetchOnReconnect: true, // Check when network reconnects
  })
}
