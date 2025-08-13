import { MessageSquareCodeIcon } from "lucide-react"

export function CodifeedLogo() {
  return (
    <div className="flex items-center gap-2">
      <CodifeedLogoIcon />
      <CodifeedLogoText />
    </div>
  )
}

export function CodifeedLogoIcon() {
  return (
    <div className="flex aspect-square items-center justify-center rounded-lg bg-primary p-1.5 text-primary-foreground">
      <MessageSquareCodeIcon className="size-5" />
    </div>
  )
}

export function CodifeedLogoText() {
  return <div className="flex-1 text-xl font-bold">Codifeed</div>
}
