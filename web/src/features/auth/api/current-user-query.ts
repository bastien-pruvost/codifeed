import { queryOptions } from "@tanstack/react-query"

import { authKeys } from "@/features/auth/api/_auth-keys"
import {
  setShouldBeAuthenticated,
  shouldBeAuthenticated,
} from "@/features/auth/services/auth-flag-storage"
import { api, getData } from "@/services/http-client"

export function currentUserQueryOptions(options?: { forceEnabled?: boolean }) {
  return queryOptions({
    queryKey: authKeys.currentUser(options),
    queryFn: async () => {
      if (!shouldBeAuthenticated() && !options?.forceEnabled) {
        return null
      }
      const userResponse = await api.GET("/users/me", {}).catch((error) => {
        setShouldBeAuthenticated(false)
        throw error
      })
      return getData(userResponse)
    },
    enabled: shouldBeAuthenticated() || options?.forceEnabled,
    refetchInterval: 1000 * 60 * 5, // 5 minutes - periodic check for long sessions
    refetchOnWindowFocus: true, // Check when user returns to tab
    refetchOnMount: true, // Refetch on every component mount
    refetchOnReconnect: true, // Check when network reconnects
  })
}
