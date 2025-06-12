import { api, QUERY_KEYS } from "@/services/api"
import { queryOptions } from "@tanstack/react-query"

export const postsQueryOptions = queryOptions({
  queryKey: [QUERY_KEYS.posts],
  queryFn: () => api.GET("/posts", {}),
})
