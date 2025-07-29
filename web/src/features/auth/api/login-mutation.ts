import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import type { LoginCredentials, UserRead } from "@/types/generated/api.gen"
import { setShouldBeAuthenticated } from "@/features/auth/services/auth-flag-storage"
import { api } from "@/services/fetch-client"
import { QUERY_KEYS } from "@/services/query-client"
import { ApiError } from "@/utils/errors"

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.POST("/auth/login", { body: credentials })
      return response.data
    },
    onSuccess: async (data) => {
      setShouldBeAuthenticated(true)
      queryClient.setQueryData<UserRead>([QUERY_KEYS.authUser], data?.user)
      navigate({ to: "/" })
    },
    onError: (error: unknown) => {
      // Perfect type safety with helpful methods!
      if (error instanceof ApiError) {
        // Access all response details with full type safety
        console.log("Error status:", error.status)
        console.log("Error data:", error.data)
        console.log("Response URL:", error.url)

        // Use the helper method for user-friendly messages
        toast.error(error.getUserMessage())

        // // Handle validation errors specifically
        // if (error.isValidationError()) {
        //   const validationErrors = error.getValidationErrors()
        //   console.log('Validation errors:', validationErrors)
        // }
      } else {
        toast.error("Login failed. Please try again.")
      }
    },
  })
}
