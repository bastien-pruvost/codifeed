import { api, QUERY_KEYS } from "@/services/api"
import { authUserQueryOptions } from "@/services/api/auth"
import { setShouldBeAuthenticated } from "@/services/local-storage/auth"
import type {
  LoginCredentials,
  LogoutResponse,
  UserRead,
} from "@/types/api.gen"
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
  type UseMutateAsyncFunction,
} from "@tanstack/react-query"
import { createContext, useContext, type ReactNode } from "react"

export interface AuthContext {
  user: UserRead | undefined
  isAuthenticated: boolean
  isLoading: boolean
  login: UseMutateAsyncFunction<
    UserRead | undefined,
    Error,
    LoginCredentials,
    unknown
  >
  logout: UseMutateAsyncFunction<
    LogoutResponse | undefined,
    Error,
    void,
    unknown
  >
}

const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log("AuthProvider load")
  const queryClient = useQueryClient()

  const { data: user, isLoading, isError } = useQuery(authUserQueryOptions())

  // Clear auth flag if auth query fails
  // useEffect(() => {
  //   if (shouldCheckAuth() && isError) {
  //     setShouldCheckAuth(false)
  //     queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.authUser] })
  //   }
  // }, [isError, queryClient])

  const { mutateAsync: login } = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.POST("/auth/login", { body: credentials })
      return response.data
    },
    onSuccess: async (userData) => {
      // Set auth flag to enable future auth queries
      setShouldBeAuthenticated(true)
      // Set the user data in the cache
      await queryClient.setQueryData([QUERY_KEYS.authUser], userData)
    },
  })

  const { mutateAsync: logout } = useMutation({
    mutationFn: async () => {
      const response = await api.POST("/auth/logout", {})
      return response.data
    },
    onSuccess: async () => {
      // Clear auth flag to disable future auth queries
      setShouldBeAuthenticated(false)
      // Clear the user data from the cache
      await queryClient.setQueryData([QUERY_KEYS.authUser], null)
    },
  })

  // if (isLoading) {
  //   return (
  //     <div className="flex h-screen w-screen items-center justify-center">
  //       <Spinner className="size-8" />
  //     </div>
  //   )
  // }

  console.log("user: ", user)

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        user,
        isAuthenticated: !!user,
        isLoading,
      }}
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
