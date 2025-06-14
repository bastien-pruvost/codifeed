import { api, QUERY_KEYS } from "@/services/api"
import type { LoginCredentials, UserRead } from "@/types/api.gen"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createContext, useCallback, useContext, type ReactNode } from "react"

// const userIdStorageKey = "codifeed.auth.user_id"

// function getStoredUserId() {
//   return localStorage.getItem(userIdStorageKey)
// }

// function setStoredUserId(userId: string | null) {
//   if (userId) {
//     localStorage.setItem(userIdStorageKey, userId)
//   } else {
//     localStorage.removeItem(userIdStorageKey)
//   }
// }

export interface AuthContext {
  user: UserRead | null | undefined
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => void
  logout: () => void
}

const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  const { data: user } = useQuery({
    queryKey: [QUERY_KEYS.authUser],
    queryFn: () => api.GET("/auth/me", {}).then((res) => res.data ?? null),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  })

  const isAuthenticated = !!user

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      api.POST("/auth/login", { body: credentials }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.authUser] })
      // router.invalidate()
      // router.navigate({ to: "/" })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => api.POST("/auth/logout", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.authUser] })
      // router.invalidate()
      // router.navigate({ to: "/login" })
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
    <AuthContext.Provider value={{ login, logout, user, isAuthenticated }}>
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
