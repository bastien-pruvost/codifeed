import type { ApiError } from "@/utils/errors"

interface Meta extends Record<string, unknown> {
  /** Provide a custom global error message to display (in a toast) */
  globalError?: string
  /** Disable all global error display for this query/mutation (maybe for displaying the error in a custom component like a modal or alert) */
  disableDefaultGlobalError?: boolean
}

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError
    queryMeta: Meta
    mutationMeta: Meta
  }
}
