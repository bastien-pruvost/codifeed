import { cn } from "@/lib/utils"
import type { ComponentPropsWithoutRef } from "react"

interface WrapperProps extends ComponentPropsWithoutRef<"div"> {}

export function Wrapper({ children, className, ...props }: WrapperProps) {
  return (
    <div className={cn("mx-auto max-w-7xl px-4", className)} {...props}>
      {children}
    </div>
  )
}
