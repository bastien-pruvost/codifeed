import type { ToasterProps } from "sonner"
import { Toaster as Sonner } from "sonner"

import { useTheme } from "@/hooks/use-theme"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      richColors
      theme={theme}
      position="top-center"
      offset="calc(var(--header-height) + 0.5rem)"
      className="toaster group"
      // style={
      //   {
      //     "--normal-bg": "var(--popover)",
      //     "--normal-text": "var(--popover-foreground)",
      //     "--normal-border": "var(--border)",
      //   } as CSSProperties
      // }
      {...props}
    />
  )
}

export { Toaster }
