import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter, useSearch } from "@tanstack/react-router"

import type { LoginCredentials, UserCreate } from "@/types/generated/api.gen"
import { setShouldBeAuthenticated } from "@/features/auth/services/auth-flag-storage"
import { userQueries } from "@/features/users/api/user-queries"
import { api, getData } from "@/services/http-client"

export const authMutations = {
  useLogin,
  useLogout,
  useSignup,
  useRefreshToken,
}

function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const redirectUrl = useSearch({
    from: "/_public/login",
    select: (search) => search.redirect,
  })

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) =>
      getData(api.POST("/auth/login", { body: credentials })),
    onSuccess: async (data) => {
      setShouldBeAuthenticated(true)
      await queryClient.invalidateQueries()
      queryClient.setQueryData(userQueries.currentUser().queryKey, data.user)
      router.history.push(redirectUrl || "/home")
    },
    meta: {
      disableDefaultGlobalError: true,
    },
  })
}

function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => getData(api.POST("/auth/logout", {})),
    onSuccess: async () => {
      setShouldBeAuthenticated(false)
      await queryClient.invalidateQueries()
      queryClient.setQueryData<null>(userQueries.currentUser().queryKey, null)
      router.history.push("/")
    },
  })
}

function useSignup() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const redirectUrl = useSearch({
    from: "/_public/signup",
    select: (search) => search.redirect,
  })

  return useMutation({
    mutationFn: async (user: UserCreate) =>
      getData(api.POST("/auth/signup", { body: user })),
    onSuccess: async (data) => {
      setShouldBeAuthenticated(true)
      await queryClient.invalidateQueries()
      queryClient.setQueryData(userQueries.currentUser().queryKey, data.user)
      router.history.push(redirectUrl || "/home")
    },
  })
}

function useRefreshToken() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => getData(api.POST("/auth/refresh")),
    onSuccess: (data) => {
      queryClient.setQueryData(userQueries.currentUser().queryKey, data.user)
    },
  })
}
