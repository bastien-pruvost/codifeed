import { queryOptions } from "@tanstack/react-query"

import { api } from "@/services/fetch-client"
import { QUERY_KEYS } from "@/services/query-client"

export const postsQueryOptions = queryOptions({
  queryKey: [QUERY_KEYS.posts],
  queryFn: () => api.GET("/posts", {}),
})
