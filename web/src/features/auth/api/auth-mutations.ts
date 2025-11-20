import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { LoginCredentials, UserCreate } from "@/types/generated/api.gen"
import { setShouldBeAuthenticated } from "@/features/auth/services/auth-flag-storage"
import { userQueries } from "@/features/users/api/user-queries"
import { api, getData } from "@/services/http-client"

export function useLoginMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) =>
      getData(api.POST("/auth/login", { body: credentials })),
    onSuccess: async (user) => {
      setShouldBeAuthenticated(true)
      queryClient.setQueryData(userQueries.currentUser().queryKey, user)
      return queryClient.invalidateQueries({
        predicate: (q) =>
          q.queryKey.length !== userQueries.currentUser().queryKey.length ||
          q.queryKey.some(
            (key, index) => key !== userQueries.currentUser().queryKey[index],
          ),
      })
    },
    meta: {
      disableDefaultGlobalError: true,
    },
  })
}

export function useSignupMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (user: UserCreate) =>
      getData(api.POST("/auth/signup", { body: user })),
    onSuccess: async (user) => {
      setShouldBeAuthenticated(true)
      queryClient.setQueryData(userQueries.currentUser().queryKey, user)
      return queryClient.invalidateQueries({
        predicate: (q) =>
          q.queryKey.length !== userQueries.currentUser().queryKey.length ||
          q.queryKey.some(
            (key, index) => key !== userQueries.currentUser().queryKey[index],
          ),
      })
    },
    meta: {
      disableDefaultGlobalError: true,
    },
  })
}

export function useRefreshTokenMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => getData(api.POST("/auth/refresh")),
    onSuccess: (user) => {
      queryClient.setQueryData(userQueries.currentUser().queryKey, user)
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => getData(api.POST("/auth/logout", {})),
    onMutate: () => {
      setShouldBeAuthenticated(false)
    },
    onSuccess: async () => {
      await queryClient.cancelQueries()
      queryClient.clear()
    },
  })
}
