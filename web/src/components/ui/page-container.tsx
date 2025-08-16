import type { ComponentPropsWithoutRef } from "react"

import { cn } from "@/utils/classnames"

export function PageContainer({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "min-h-[calc(100svh-var(--header-height)-1px)] py-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
