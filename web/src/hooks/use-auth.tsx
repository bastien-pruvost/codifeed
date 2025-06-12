import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

const userIdStorageKey = "codifeed.auth.user_id"

function getStoredUserId() {
  return localStorage.getItem(userIdStorageKey)
}

function setStoredUserId(userId: string | null) {
  if (userId) {
    localStorage.setItem(userIdStorageKey, userId)
  } else {
    localStorage.removeItem(userIdStorageKey)
  }
}

export interface AuthContext {
  userId: string | null
  isAuthenticated: boolean
  login: (userId: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(getStoredUserId())
  const isAuthenticated = !!userId

  const logout = useCallback(async () => {
    setStoredUserId(null)
    setUserId(null)
  }, [])

  const login = useCallback(async (userId: string) => {
    setStoredUserId(userId)
    setUserId(userId)
  }, [])

  useEffect(() => {
    setUserId(getStoredUserId())
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
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
