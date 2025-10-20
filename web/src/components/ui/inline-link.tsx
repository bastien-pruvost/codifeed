import type { VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"
import { cva } from "class-variance-authority"
import { Slot as SlotPrimitive } from "radix-ui"

import { cn } from "@/utils/classnames"

const inlineLinkVariants = cva(
  [
    "inline-flex items-center gap-1",
    "text-primary",
    "underline decoration-transparent decoration-1 underline-offset-4 transition-colors",
    "rounded-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  ],
  {
    variants: {
      underline: {
        hover: "hover:decoration-current",
        always: "decoration-current",
        none: "no-underline",
      },
    },
    defaultVariants: { underline: "hover" },
  },
)

interface InlineLinkProps
  extends Omit<ComponentProps<"a">, "color">,
    VariantProps<typeof inlineLinkVariants> {
  asChild?: boolean
}

export function InlineLink({
  asChild,
  underline,
  className,
  ...props
}: InlineLinkProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "a"
  return (
    <Comp
      data-slot="inline-link"
      className={cn(inlineLinkVariants({ underline }), className)}
      {...props}
    />
  )
}
