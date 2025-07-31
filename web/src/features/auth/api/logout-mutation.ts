import { useMutation, useQueryClient } from "@tanstack/react-query"

import { authQueryKeys } from "@/features/auth/api/query-keys"
import { setShouldBeAuthenticated } from "@/features/auth/services/auth-flag-storage"
import { api } from "@/services/http-client"

export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.POST("/auth/logout", {})
      return response.data
    },
    onSuccess: async () => {
      setShouldBeAuthenticated(false)
      queryClient.setQueryData<null>(authQueryKeys.user(), null)
    },
  })
}
