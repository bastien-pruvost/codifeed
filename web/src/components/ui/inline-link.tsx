import type { VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/utils/classnames"

const inlineLinkVariants = cva(
  [
    "inline-flex items-center gap-1 font-medium",
    "underline decoration-transparent decoration-2 underline-offset-4 transition-colors",
    "rounded-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  ],
  {
    variants: {
      tone: {
        primary: "text-primary",
        muted: "text-primary/70",
        danger: "text-destructive",
      },
      underline: {
        hover: "hover:decoration-current",
        always: "decoration-current",
        none: "no-underline",
      },
    },
    defaultVariants: { tone: "primary", underline: "hover" },
  },
)

interface InlineLinkProps
  extends ComponentProps<"a">,
    VariantProps<typeof inlineLinkVariants> {
  asChild?: boolean
}

export function InlineLink({
  asChild,
  tone,
  underline,
  className,
  ...props
}: InlineLinkProps) {
  const Comp = asChild ? Slot : "a"
  return (
    <Comp
      data-slot="inline-link"
      className={cn(inlineLinkVariants({ tone, underline, className }))}
      {...props}
    />
  )
}
