import { api, QUERY_KEYS } from "@/services/api"
import type { paths } from "@/types/api.gen"
import { queryOptions, useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

export function authUserQueryOptions() {
  return queryOptions({
    queryKey: [QUERY_KEYS.authUser],
    queryFn: () => api.GET("/auth/me", {}).then((res) => res.data ?? null),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  })
}

export function useLoginMutation() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (
      body: paths["/auth/login"]["post"]["requestBody"]["content"]["application/json"],
    ) => api.POST("/auth/login", { body }),
    onSuccess: () => {
      navigate({ to: "/" })
    },
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (
      body: paths["/auth/register"]["post"]["requestBody"]["content"]["application/json"],
    ) => api.POST("/auth/register", { body }),
  })
}
