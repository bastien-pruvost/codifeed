import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter, useSearch } from "@tanstack/react-router"

import type { LoginCredentials, UserRead } from "@/types/generated/api.gen"
import { authKeys } from "@/features/auth/api/_auth-keys"
import { setShouldBeAuthenticated } from "@/features/auth/services/auth-flag-storage"
import { api } from "@/services/http-client"

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const search = useSearch({ strict: false })
  const router = useRouter()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.POST("/auth/login", { body: credentials })
      return response.data
    },
    onSuccess: (data) => {
      setShouldBeAuthenticated(true)
      queryClient.setQueryData<UserRead>(authKeys.currentUser(), data?.user)
      router.history.push(search.redirect ?? "/home")
    },
    meta: {
      disableDefaultGlobalError: true,
    },
  })
}
