import type { ComponentPropsWithoutRef } from "react"

import { cn } from "@/utils/classnames"

export function PageContainer({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("py-4 min-h-(--page-container-min-height)", className)}
      {...props}
    >
      {children}
    </div>
  )
}
