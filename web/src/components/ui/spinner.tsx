import { cn } from "@/lib/utils"
import { LoaderCircle } from "lucide-react"

interface SpinnerProps extends React.ComponentProps<"svg"> {}

function Spinner({ className, ...props }: SpinnerProps) {
  return <LoaderCircle className={cn("animate-spin", className)} {...props} />
}

export { Spinner }
