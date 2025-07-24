import type { ComponentPropsWithoutRef } from "react"

import { cn } from "@/utils/classnames"

export function Wrapper({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("mx-auto max-w-7xl px-4", className)} {...props}>
      {children}
    </div>
  )
}
