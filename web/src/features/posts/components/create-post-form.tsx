import type { ComponentProps } from "react"
import { revalidateLogic, useStore } from "@tanstack/react-form"
import { z } from "zod"

import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { useCreatePostMutation } from "@/features/posts/api/post-mutations"

const MAX_POST_LENGTH = 1024

const createPostFormSchema = z.object({
  content: z
    .string()
    .min(1, "Post content cannot be empty")
    .max(MAX_POST_LENGTH, `Post cannot exceed ${MAX_POST_LENGTH} characters`),
})

const createPostDefaultValues: z.input<typeof createPostFormSchema> = {
  content: "",
}

export function CreatePostForm(props: ComponentProps<"form">) {
  const createPostMutation = useCreatePostMutation()

  const form = useAppForm({
    defaultValues: createPostDefaultValues,
    validators: {
      onDynamic: createPostFormSchema,
    },
    validationLogic: revalidateLogic(),
    onSubmit: ({ value }) => {
      createPostMutation.mutate(value, {
        onSuccess: () => {
          form.reset()
        },
      })
    },
  })

  const contentValue = useStore(form.store, (state) => state.values.content)
  const remainingChars = MAX_POST_LENGTH - contentValue.length
  const isOverLimit = remainingChars < 0

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      {...props}
    >
      <form.AppField
        name="content"
        children={(field) => (
          <field.TextAreaField
            label="What's on your mind?"
            placeholder="What's on your mind?"
            rows={4}
            className="resize-none"
          />
        )}
      />

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`text-sm ${
            isOverLimit
              ? "font-medium text-destructive"
              : remainingChars < 50
                ? "text-muted-foreground"
                : "text-muted-foreground/60"
          }`}
        >
          {remainingChars} characters remaining
        </span>

        <Button
          type="submit"
          disabled={
            createPostMutation.isPending || isOverLimit || !contentValue
          }
        >
          {createPostMutation.isPending ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  )
}
