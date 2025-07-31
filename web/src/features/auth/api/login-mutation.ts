import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

import type { LoginCredentials, UserRead } from "@/types/generated/api.gen"
import { authQueryKeys } from "@/features/auth/api/query-keys"
import { setShouldBeAuthenticated } from "@/features/auth/services/auth-flag-storage"
import { api } from "@/services/http-client"

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.POST("/auth/login", { body: credentials })
      return response.data
    },
    onSuccess: async (data) => {
      setShouldBeAuthenticated(true)
      queryClient.setQueryData<UserRead>(authQueryKeys.user(), data?.user)
      navigate({ to: "/" })
    },
    meta: {
      disableDefaultGlobalError: true,
    },
  })
}
