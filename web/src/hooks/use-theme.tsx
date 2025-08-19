import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useState } from "react"

import {
  getLocalStorageItem,
  LOCAL_STORAGE_KEYS,
  setLocalStorageItem,
} from "@/services/local-storage"

type Theme = "dark" | "light" | "system"

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>({
  theme: "system",
  setTheme: () => null,
})

export function ThemeProvider({
  defaultTheme = "system",
  storageKey = LOCAL_STORAGE_KEYS.theme,
  children,
  ...props
}: {
  defaultTheme?: Theme
  storageKey?: string
  children: ReactNode
}) {
  const [theme, setTheme] = useState<Theme>(() =>
    getLocalStorageItem<Theme>(storageKey, defaultTheme),
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setLocalStorageItem<Theme>(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const themeContext = useContext(ThemeContext)

  if (!themeContext) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return themeContext
}
