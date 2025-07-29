import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { UserRead } from "@/types/generated/api.gen"
import { api } from "@/services/fetch-client"
import { QUERY_KEYS } from "@/services/query-client"

export function useRefreshTokenMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.POST("/auth/refresh")
      return response.data
    },
    onSuccess: async (data) => {
      queryClient.setQueryData<UserRead>([QUERY_KEYS.authUser], data?.user)
    },
  })
}
