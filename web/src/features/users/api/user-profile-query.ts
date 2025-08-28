import { queryOptions } from "@tanstack/react-query"

import { userKeys } from "@/features/users/api/_user-keys"
import { api, getData } from "@/services/http-client"

export function userProfileQueryOptions(username: string) {
  return queryOptions({
    queryKey: [...userKeys.profile(username)],
    queryFn: async () => {
      const response = await api.GET("/users/profile/{username}", {
        params: {
          path: {
            username,
          },
        },
      })

      return getData(response)
    },
  })
}
