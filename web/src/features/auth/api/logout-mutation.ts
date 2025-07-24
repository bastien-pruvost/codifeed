import { useMutation, useQueryClient } from "@tanstack/react-query"

import { setShouldBeAuthenticated } from "@/features/auth/services/auth-flag-storage"
import { api } from "@/services/fetch-client"
import { QUERY_KEYS } from "@/services/query-client"

export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.POST("/auth/logout", {})
      return response.data
    },
    onSuccess: async () => {
      setShouldBeAuthenticated(false)
      await queryClient.setQueryData([QUERY_KEYS.authUser], null)
    },
  })
}
