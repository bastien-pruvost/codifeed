import createFetchClient from "openapi-fetch"
import type { paths } from "@/types/api.gen"
import { QueryClient } from "@tanstack/react-query"

export const QUERY_KEYS = {
  authUser: "auth-user",
  users: "users",
  posts: "posts",
  comments: "comments",
}

export const api = createFetchClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  credentials: "include",
})

export const queryClient = new QueryClient()
