import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

import type { LoginCredentials } from "@/types/generated/api.gen"
import { setShouldBeAuthenticated } from "@/features/auth/services/auth-flag-storage"
import { api } from "@/services/fetch-client"
import { QUERY_KEYS } from "@/services/query-client"

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.POST("/auth/login", { body: credentials })
      return response.data
    },
    onSuccess: async (userData) => {
      setShouldBeAuthenticated(true)
      await queryClient.setQueryData([QUERY_KEYS.authUser], userData)
      navigate({ to: "/" })
    },
  })
}
