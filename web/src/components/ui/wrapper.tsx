import type { VariantProps } from "class-variance-authority"
import type { ComponentPropsWithoutRef } from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/utils/classnames"

const wrapperVariants = cva("mx-auto px-4 sm:px-6 lg:px-8", {
  variants: {
    width: {
      default: "max-w-7xl",
      full: "max-w-full",
    },
  },
  defaultVariants: {
    width: "default",
  },
})

export function Wrapper({
  children,
  className,
  width,
  ...props
}: ComponentPropsWithoutRef<"div"> & VariantProps<typeof wrapperVariants>) {
  return (
    <div
      className={cn(wrapperVariants({ width, className }), className)}
      {...props}
    >
      {children}
    </div>
  )
}
