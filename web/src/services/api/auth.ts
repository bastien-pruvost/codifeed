import { api } from "@/services/api"
import type { paths } from "@/types/api.gen"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

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
