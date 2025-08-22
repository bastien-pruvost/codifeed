import { MessageSquareCodeIcon } from "lucide-react"

export function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <AppLogoIcon />
      <AppLogoText />
    </div>
  )
}

export function AppLogoIcon() {
  return (
    <div className="flex aspect-square items-center justify-center rounded-lg bg-primary p-1.5 text-primary-foreground">
      <MessageSquareCodeIcon className="size-5" />
    </div>
  )
}

export function AppLogoText() {
  return <div className="flex-1 text-xl font-bold">Codifeed</div>
}
