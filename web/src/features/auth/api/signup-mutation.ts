import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

import type { UserCreate } from "@/types/generated/api.gen"
import { setShouldBeAuthenticated } from "@/features/auth/services/auth-flag-storage"
import { api } from "@/services/fetch-client"
import { QUERY_KEYS } from "@/services/query-client"

export function useSignupMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (user: UserCreate) => {
      const response = await api.POST("/auth/signup", { body: user })
      return response.data
    },
    onSuccess: async (user) => {
      setShouldBeAuthenticated(true)
      await queryClient.setQueryData([QUERY_KEYS.authUser], user)
      navigate({ to: "/" })
    },
  })
}
