import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { UserRead } from "@/types/generated/api.gen"
import { authKeys } from "@/features/auth/api/_auth-keys"
import { api } from "@/services/http-client"

export function useRefreshTokenMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.POST("/auth/refresh")
      return response.data
    },
    onSuccess: async (data) => {
      queryClient.setQueryData<UserRead>(authKeys.currentUser(), data?.user)
    },
  })
}
