import { api, QUERY_KEYS } from "@/services/api"
import { authUserQueryOptions } from "@/services/api/auth"
import type { LoginCredentials, UserRead } from "@/types/api.gen"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createContext, useCallback, useContext, type ReactNode } from "react"

export interface AuthContext {
  user: UserRead | null | undefined
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({ ...authUserQueryOptions() })
  const isAuthenticated = !!user

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      api.POST("/auth/login", { body: credentials }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.authUser] })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => api.POST("/auth/logout", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.authUser] })
    },
  })

  const login = useCallback(
    (credentials: LoginCredentials) => {
      loginMutation.mutate(credentials)
    },
    [loginMutation],
  )

  const logout = useCallback(() => {
    logoutMutation.mutate()
  }, [logoutMutation])

  return (
    <AuthContext.Provider
      value={{ login, logout, user, isAuthenticated, isLoading }}
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
