import type { paths } from "@/types/generated/api.gen"
import { api } from "@/services/fetch-client"
import { QUERY_KEYS } from "@/services/query-client"

export function userQueryOptions(
  userId: paths["/users/{user_id}"]["get"]["parameters"]["path"]["user_id"],
) {
  return {
    queryKey: [QUERY_KEYS.users, userId],
    queryFn: () =>
      api.GET("/users/{user_id}", { params: { path: { user_id: userId } } }),
  }
}
