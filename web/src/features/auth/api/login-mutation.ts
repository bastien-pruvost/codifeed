import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter, useSearch } from "@tanstack/react-router"

import type { LoginCredentials, UserPublic } from "@/types/generated/api.gen"
import { authKeys } from "@/features/auth/api/_auth-keys"
import { setShouldBeAuthenticated } from "@/features/auth/services/auth-flag-storage"
import { api, getData } from "@/services/http-client"

export function useLoginMutation() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const redirectUrl = useSearch({
    from: "/_public/login",
    select: (search) => search.redirect,
  })

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.POST("/auth/login", { body: credentials })
      return getData(response)
    },
    onSuccess: (data) => {
      setShouldBeAuthenticated(true)
      queryClient.setQueryData<UserPublic>(authKeys.currentUser(), data.user)
      router.history.push(redirectUrl ?? "/home")
    },
    meta: {
      disableDefaultGlobalError: true,
    },
  })
}
