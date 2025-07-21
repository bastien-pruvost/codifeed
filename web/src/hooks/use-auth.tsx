import { api, QUERY_KEYS } from "@/services/api"
import { authUserQueryOptions } from "@/services/api/auth"
import {
  shouldCheckAuth,
  setShouldCheckAuth,
} from "@/services/local-storage/auth"
import type { LoginCredentials, UserRead } from "@/types/api.gen"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  type ReactNode,
} from "react"

export interface AuthContext {
  user: UserRead | null | undefined
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refresh: () => void
}

const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  const { data: user, isLoading, isError } = useQuery(authUserQueryOptions())

  // isAuthenticated should be false if loading, error, or no user
  const isAuthenticated = !!user

  // Clear auth flag if auth query fails
  useEffect(() => {
    if (isError && shouldCheckAuth()) {
      setShouldCheckAuth(false)
      queryClient.setQueryData([QUERY_KEYS.authUser], null)
    }
  }, [isError, queryClient])

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.POST("/auth/login", { body: credentials })
      if (response.error) {
        throw new Error("Login failed")
      }
      return response.data
    },
    onSuccess: (userData) => {
      // Set auth flag to enable future auth queries
      setShouldCheckAuth(true)
      // Set the user data in the cache
      queryClient.setQueryData([QUERY_KEYS.authUser], userData)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.POST("/auth/logout", {})
      if (response.error) {
        throw new Error("Logout failed")
      }
      return response.data
    },
    onSuccess: () => {
      // Clear auth flag and auth data
      setShouldCheckAuth(false)
      // Clear the user data in the cache
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.authUser] })
      // queryClient.setQueryData([QUERY_KEYS.authUser], null)
    },
  })

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      await loginMutation.mutateAsync(credentials)
    },
    [loginMutation],
  )

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync()
  }, [logoutMutation])

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.authUser] })
  }, [queryClient])

  return (
    <AuthContext.Provider
      value={{ login, logout, refresh, user, isAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
