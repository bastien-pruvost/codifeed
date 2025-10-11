import type { VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/utils/classnames"

export const paragraphVariants = cva("", {
  variants: {
    tone: {
      default: "",
      muted: "text-muted-foreground",
    },
    size: {
      default: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
  },
  defaultVariants: {
    tone: "default",
    size: "default",
  },
})

interface ParagraphProps
  extends ComponentProps<"p">,
    VariantProps<typeof paragraphVariants> {}

export function P({
  tone,
  size,
  children,
  className,
  ...props
}: ParagraphProps) {
  return (
    <p className={cn(paragraphVariants({ tone, size }), className)} {...props}>
      {children}
    </p>
  )
}

export function Lead({ children, className, ...props }: ComponentProps<"p">) {
  return (
    <p className={cn("text-xl text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
}

export function H1({ children, className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

export function H2({ children, className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export function H3({ children, className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

export function H4({ children, className, ...props }: ComponentProps<"h4">) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h4>
  )
}

export function Ul({ children, className, ...props }: ComponentProps<"ul">) {
  return (
    <ul className={cn("ml-6 list-disc [&>li]:mt-2", className)} {...props}>
      {children}
    </ul>
  )
}

export function Ol({ children, className, ...props }: ComponentProps<"ol">) {
  return (
    <ol className={cn("ml-6 list-decimal [&>li]:mt-2", className)} {...props}>
      {children}
    </ol>
  )
}

export function Blockquote({
  children,
  className,
  ...props
}: ComponentProps<"blockquote">) {
  return (
    <blockquote className={cn("border-l-2 pl-6 italic", className)} {...props}>
      {children}
    </blockquote>
  )
}

export function Table({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "w-full overflow-y-auto",
        "[&_tr]:m-0 [&_tr]:border-t [&_tr]:p-0 [&_tr]:even:bg-muted",
        "[&_th]:border [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:font-bold [&_th]:[&[align=center]]:text-center [&_th]:[&[align=right]]:text-right",
        "[&_td]:border [&_td]:px-4 [&_td]:py-2 [&_td]:text-left [&_td]:[&[align=center]]:text-center [&_td]:[&[align=right]]:text-right",
        className,
      )}
      {...props}
    >
      <table className="w-full">{children}</table>
    </div>
  )
}

export function Code({
  children,
  className,
  ...props
}: ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  )
}
