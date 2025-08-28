import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter, useSearch } from "@tanstack/react-router"

import type { UserCreate, UserRead } from "@/types/generated/api.gen"
import { authKeys } from "@/features/auth/api/_auth-keys"
import { setShouldBeAuthenticated } from "@/features/auth/services/auth-flag-storage"
import { api, getData } from "@/services/http-client"

export function useSignupMutation() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const redirectUrl = useSearch({
    from: "/_public/signup",
    select: (search) => search.redirect,
  })

  return useMutation({
    mutationFn: async (user: UserCreate) => {
      const response = await api.POST("/auth/signup", { body: user })
      return getData(response)
    },
    onSuccess: (data) => {
      setShouldBeAuthenticated(true)
      queryClient.setQueryData<UserRead>(authKeys.currentUser(), data.user)
      router.history.push(redirectUrl ?? "/home")
    },
  })
}
