import type { ComponentProps, ReactNode } from "react"
import { Slot } from "@radix-ui/react-slot"
import {
  createFormHook,
  createFormHookContexts,
  useStore,
} from "@tanstack/react-form"
import { createContext, useContext, useId } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/utils/classnames"

// Tanstack Form Contexts
export const { formContext, fieldContext, useFormContext, useFieldContext } =
  createFormHookContexts()

// Tanstack Form Hooks
export const { useAppForm, withForm } = createFormHook({
  formContext,
  fieldContext,
  fieldComponents: {
    TextField,
    CheckboxField,
  },
  formComponents: {
    FormSubmitButton,
  },
})

// -- Custom Form Item Context --

interface FormItemContextValue {
  fieldId: string
  fieldDescriptionId: string
  fieldMessageId: string
  errors: unknown[]
}

const FormItemContext = createContext<FormItemContextValue | undefined>(
  undefined,
)

function FormItemProvider({ children }: { children: ReactNode }) {
  const genId = useId()
  const field = useFieldContext()

  const errors = useStore(field.store, (state) => {
    return state.meta.errors as unknown[]
  })

  const id = `${field.name}-${genId}`

  const value = {
    fieldId: `${id}-form-field`,
    fieldDescriptionId: `${id}-form-field-description`,
    fieldMessageId: `${id}-form-field-error`,
    errors,
  }

  return <FormItemContext value={value}>{children}</FormItemContext>
}

function useFormItem() {
  const formItemContext = useContext(FormItemContext)

  if (!formItemContext) {
    throw new Error(
      "useFormItem should be used within <FormItem> (or FormItemProvider)",
    )
  }

  return formItemContext
}

// -- Form Field Blocks --

function FormItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <FormItemProvider>
      <div data-slot="form-item" className={cn("group grid gap-2", className)}>
        {children}
      </div>
    </FormItemProvider>
  )
}

function FormLabel({ className, ...props }: ComponentProps<typeof Label>) {
  const { fieldId } = useFormItem()
  return (
    <Label
      htmlFor={fieldId}
      data-slot="form-label"
      className={className}
      {...props}
    />
  )
}

function FormControl({ ...props }: ComponentProps<typeof Slot>) {
  const { errors, fieldId, fieldDescriptionId, fieldMessageId } = useFormItem()

  return (
    <Slot
      id={fieldId}
      data-slot="form-control"
      aria-invalid={errors.length > 0}
      aria-describedby={
        errors.length > 0
          ? `${fieldDescriptionId} ${fieldMessageId}`
          : `${fieldDescriptionId}`
      }
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: ComponentProps<"p">) {
  const { fieldDescriptionId } = useFormItem()
  return (
    <p
      id={fieldDescriptionId}
      data-slot="form-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: ComponentProps<"p">) {
  const { fieldMessageId, errors } = useFormItem()

  const fieldError = errors.length > 0 ? errors[0] : null
  if (!fieldError) return null

  let message: string | null = null

  if (typeof fieldError === "string") {
    message = fieldError
  } else if (
    typeof fieldError === "object" &&
    "message" in fieldError &&
    typeof fieldError.message === "string"
  ) {
    message = fieldError.message
  } else {
    throw new Error(
      "Field error must be a string or an object with a message string property",
    )
  }

  return (
    <p
      id={fieldMessageId}
      data-slot="form-message"
      className={cn("text-sm whitespace-pre-line text-destructive", className)}
      {...props}
    >
      {message}
    </p>
  )
}

function FormSubmitButton({
  disabled,
  ...props
}: ComponentProps<typeof Button>) {
  const form = useFormContext()
  return (
    <form.Subscribe
      selector={(state) => ({ isSubmitting: state.isSubmitting })}
    >
      {({ isSubmitting }) => (
        <Button type="submit" disabled={isSubmitting || disabled} {...props} />
      )}
    </form.Subscribe>
  )
}

// -- Form Fields --

interface FieldProps {
  label: ReactNode
  description?: ReactNode | null
}

interface TextFieldProps extends FieldProps, ComponentProps<typeof Input> {}

function TextField({ label, description, ...props }: TextFieldProps) {
  const field = useFieldContext<string>()

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          type="text"
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          {...props}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}

interface CheckboxFieldProps
  extends FieldProps,
    ComponentProps<typeof Checkbox> {}

function CheckboxField({ label, description, ...props }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>()

  return (
    <FormItem>
      <div className="flex items-center gap-2">
        <FormControl>
          <Checkbox
            name={field.name}
            checked={field.state.value}
            onCheckedChange={(checked) => field.handleChange(checked === true)}
            {...props}
          />
        </FormControl>
        <FormLabel>{label}</FormLabel>
      </div>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}
