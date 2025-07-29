import { QueryCache, QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { ApiError, getErrorMessage } from "@/utils/errors"

export const QUERY_KEYS = {
  authUser: "auth-user",
  users: "users",
  posts: "posts",
  comments: "comments",
}

// Helper function to determine if we should retry with type safety
function shouldRetry(failureCount: number, error: unknown): boolean {
  // Don't retry in development
  if (import.meta.env.DEV) return false

  // Handle ApiError
  if (error instanceof ApiError) {
    // Don't retry client errors (4xx)
    if (error.status >= 400 && error.status < 500) {
      return false
    }
    // Retry server errors (5xx) up to 3 times
    if (error.status >= 500) {
      return failureCount < 3
    }
  }

  // Handle network errors
  if (
    error instanceof Error &&
    (error.message?.includes("fetch") || error.name === "NetworkError")
  ) {
    return failureCount < 3
  }

  return false
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: 1000,
      retry: shouldRetry,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.log("Query error:", { query, error })

      // Only show background error toasts if we have stale data
      if (query.state.data !== undefined) {
        toast.error(`Background update failed: ${getErrorMessage(error)}`)
        return
      }

      // Handle specific query error messages from meta
      if (
        query.meta?.errorMessage &&
        typeof query.meta.errorMessage === "string"
      ) {
        toast.error(query.meta.errorMessage)
        return
      }

      // Default error handling for initial loads
      toast.error(getErrorMessage(error))
    },
  }),
})
