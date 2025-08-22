import type { ComponentProps } from "react"
import { LoaderCircleIcon } from "lucide-react"

import { cn } from "@/utils/classnames"

function Spinner({ className, ...props }: ComponentProps<"svg">) {
  return (
    <LoaderCircleIcon
      data-slot="spinner"
      className={cn("animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
