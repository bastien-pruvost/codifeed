import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"

import { authKeys } from "@/features/auth/api/_auth-keys"
import { setShouldBeAuthenticated } from "@/features/auth/services/auth-flag-storage"
import { api, getData } from "@/services/http-client"

export function useLogoutMutation() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.POST("/auth/logout", {})
      return getData(response)
    },
    onSuccess: () => {
      setShouldBeAuthenticated(false)
      queryClient.setQueryData<null>(authKeys.currentUser(), null)
      router.history.push("/")
    },
  })
}
