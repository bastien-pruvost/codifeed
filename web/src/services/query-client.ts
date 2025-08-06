import type { MutationState, QueryState } from "@tanstack/react-query"
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { Meta } from "@/types/tanstack-query"
import { ApiError, getErrorMessage, isNetworkError } from "@/utils/errors"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      retryDelay: 1000, // 1 second
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      displayGlobalErrorFromMeta(error, query.meta, query.state)
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      displayGlobalErrorFromMeta(error, mutation.meta, mutation.state)
    },
  }),
})

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (import.meta.env.DEV) return false

  if (error instanceof ApiError) {
    if (error.status >= 400 && error.status < 500) {
      return false
    }
    if (error.status >= 500) {
      return failureCount < 3
    }
  }

  if (isNetworkError(error)) {
    return failureCount < 3
  }

  return false
}

function displayGlobalErrorFromMeta(
  error: unknown,
  meta: Meta | undefined,
  state:
    | QueryState<unknown, unknown>
    | MutationState<unknown, unknown, unknown, unknown>
    | undefined,
) {
  // Don't display global error if disabled in meta data
  if (meta?.disableDefaultGlobalError) return

  // Use custom global error message if provided, otherwise use default error message
  const errorMessage = meta?.globalError
    ? meta.globalError
    : getErrorMessage(error)

  // Only show background error toasts if we have stale data
  if (state?.data !== undefined) {
    toast.error(`Background update failed: ${errorMessage}`)
    return
  }

  // Display global error message
  toast.error(errorMessage)
}
