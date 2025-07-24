import { QueryCache, QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const QUERY_KEYS = {
  authUser: "auth-user",
  users: "users",
  posts: "posts",
  comments: "comments",
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: 1000,
      retry: (failureCount, error) => {
        // In development, don't retry
        if (import.meta.env.DEV) {
          return false
        }
        // In production, retry if it's a server error (5xx)
        if ("status" in error && Number(error.status) >= 500) {
          return true
        }
        return failureCount < 3
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (
        query.meta?.errorMessage &&
        typeof query.meta.errorMessage === "string"
      ) {
        toast.error(query.meta.errorMessage)
      } else {
        toast.error(`Something went wrong: ${error.message}`)
      }
    },
  }),
})
