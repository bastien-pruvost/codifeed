import type { ComponentProps } from "react"
import { MessageSquareCodeIcon } from "lucide-react"

import { cn } from "@/utils/classnames"

export function AppLogo({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="app-logo"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <AppLogoIcon />
      <AppLogoText />
    </div>
  )
}

export function AppLogoIcon() {
  return (
    <div
      data-slot="app-logo-icon"
      className="flex aspect-square items-center justify-center rounded-lg bg-primary p-2 text-primary-foreground"
    >
      <MessageSquareCodeIcon className="size-5" />
    </div>
  )
}

export function AppLogoText() {
  return (
    <div data-slot="app-logo-text" className="flex-1 text-xl font-bold">
      Codifeed
    </div>
  )
}
