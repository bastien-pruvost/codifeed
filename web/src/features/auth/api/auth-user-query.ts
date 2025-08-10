import { queryOptions } from "@tanstack/react-query"

import { authQueryKeys } from "@/features/auth/api/query-keys"
import {
  setShouldBeAuthenticated,
  shouldBeAuthenticated,
} from "@/features/auth/services/auth-flag-storage"
import { api } from "@/services/http-client"

export function authUserQueryOptions(options?: { forceEnabled?: boolean }) {
  return queryOptions({
    queryKey: [...authQueryKeys.user(), options],
    queryFn: async () => {
      if (!shouldBeAuthenticated() && !options?.forceEnabled) {
        return null
      }
      const userResponse = await api.GET("/users/me", {}).catch(() => {
        console.error("Failed to load user data")
        setShouldBeAuthenticated(false)
        return null
      })
      return userResponse?.data ?? null
    },
    enabled: shouldBeAuthenticated() || options?.forceEnabled,
    staleTime: 0, // delete
    refetchInterval: 1000 * 60 * 5, // 5 minutes - periodic check for long sessions
    refetchOnWindowFocus: true, // Check when user returns to tab
    refetchOnMount: true, // Refetch on every component mount
    refetchOnReconnect: true, // Check when network reconnects
  })
}
