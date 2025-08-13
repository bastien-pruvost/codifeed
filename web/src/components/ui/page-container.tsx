import type { ComponentPropsWithoutRef } from "react"

import { cn } from "@/utils/classnames"

export function PageContainer({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("h-[calc(100vh-var(--header-height)-1px)] py-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}
