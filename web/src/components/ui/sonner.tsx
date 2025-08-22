import type { CSSProperties } from "react"
import type { ToasterProps } from "sonner"
import { Toaster as Sonner } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  // const { theme = "system" } = useTheme()

  return (
    <Sonner
      // theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
