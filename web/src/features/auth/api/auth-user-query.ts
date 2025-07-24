import { queryOptions } from "@tanstack/react-query"

import { shouldBeAuthenticated } from "@/features/auth/services/auth-flag-storage"
import { api } from "@/services/fetch-client"
import { QUERY_KEYS } from "@/services/query-client"

export function authUserQueryOptions(options?: { forceEnabled?: boolean }) {
  return queryOptions({
    queryKey: [QUERY_KEYS.authUser],
    queryFn: () => {
      console.log("-> auth user query called")
      return shouldBeAuthenticated()
        ? api
            .GET("/auth/me", {})
            .then((res) => res.data ?? null)
            .catch((err) => {
              console.log("ERR CATCHED: ", err)
              throw new Error("ERROR: ", err)
            })
        : null
    },
    enabled: shouldBeAuthenticated() ?? options?.forceEnabled,
    meta: {
      errorMessage: "You are not authenticated",
    },
    refetchInterval: 1000 * 60 * 5, // 5 minutes - periodic check for long sessions
    staleTime: 0, // delete

    refetchOnWindowFocus: true, // Check when user returns to tab
    refetchOnMount: true, // Refetch on every component mount
    refetchOnReconnect: true, // Check when network reconnects
  })
}
