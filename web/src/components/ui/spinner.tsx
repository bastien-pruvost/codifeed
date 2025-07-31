import { LoaderCircleIcon } from "lucide-react"

import { cn } from "@/utils/classnames"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderCircleIcon className={cn("animate-spin", className)} {...props} />
  )
}

export { Spinner }
