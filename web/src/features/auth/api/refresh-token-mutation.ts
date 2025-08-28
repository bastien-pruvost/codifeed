import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { UserRead } from "@/types/generated/api.gen"
import { authKeys } from "@/features/auth/api/_auth-keys"
import { api, getData } from "@/services/http-client"

export function useRefreshTokenMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.POST("/auth/refresh")
      return getData(response)
    },
    onSuccess: (data) => {
      queryClient.setQueryData<UserRead>(authKeys.currentUser(), data.user)
    },
  })
}
