import { api, QUERY_KEYS } from "@/services/api"
import { shouldCheckAuth } from "@/services/local-storage/auth"
import { queryOptions } from "@tanstack/react-query"

export function authUserQueryOptions(options?: { forceEnabled?: boolean }) {
  return queryOptions({
    queryKey: [QUERY_KEYS.authUser],
    queryFn: () =>
      shouldCheckAuth()
        ? api.GET("/auth/me", {}).then((res) => res.data ?? null)
        : null,
    enabled: options?.forceEnabled,
    refetchInterval: 1000 * 60 * 5, // 5 minutes - periodic check for long sessions
    refetchOnWindowFocus: true, // Check when user returns to tab
    refetchOnMount: true, // Refetch on every component mount
    refetchOnReconnect: true, // Check when network reconnects
  })
}

// export function useLoginMutation() {
//   return useMutation({
//     mutationFn: (
//       body: paths["/auth/login"]["post"]["requestBody"]["content"]["application/json"],
//     ) => api.POST("/auth/login", { body }),
//     onSuccess: () => {
//       navigate({ to: "/" })
//     },
//   })
// }

// export function useSignupMutation() {
//   return useMutation({
//     mutationFn: (
//       body: paths["/auth/signup"]["post"]["requestBody"]["content"]["application/json"],
//     ) => api.POST("/auth/signup", { body }),
//   })
// }
