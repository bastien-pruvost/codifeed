import { revalidateLogic } from "@tanstack/react-form"
import { createFileRoute, Link } from "@tanstack/react-router"
import { AlertCircleIcon } from "lucide-react"
import z from "zod"

import { useAppForm } from "@/components/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"
import { Wrapper } from "@/components/ui/wrapper"
import { useSignupMutation } from "@/features/auth/api/signup-mutation"
import signupImg from "@/features/auth/assets/signup-illustration.webp"
import { getErrorMessage } from "@/utils/errors"

const searchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
})

const signupSchema = z.object({
  email: z.email({
    error: ({ input }) =>
      input
        ? "Enter a valid email address, like email@example.com"
        : "Email is required",
  }),
  password: z.string().min(1, "Password is required"),
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  avatar: z.string().nullable(),
})

const defaultValues: z.input<typeof signupSchema> = {
  email: "",
  password: "",
  name: "",
  username: "",
  avatar: null,
}

export const Route = createFileRoute("/_public/signup")({
  validateSearch: searchSchema,
  component: SignupPage,
})

function SignupPage() {
  const signupMutation = useSignupMutation()

  const form = useAppForm({
    defaultValues,
    validators: {
      onDynamic: signupSchema,
    },
    validationLogic: revalidateLogic(),
    onSubmit: ({ value }) => {
      signupMutation.mutate(value)
    },
  })

  return (
    <PageContainer className="flex items-center justify-center">
      <Wrapper className="max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form
              className="p-6 md:p-8"
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                void form.handleSubmit()
              }}
            >
              <h1 className="text-center text-2xl font-bold">
                Create your account
              </h1>
              <p className="mt-2 text-center text-balance text-muted-foreground">
                Join Codifeed and connect with developers
              </p>

              <div className="mt-8 flex flex-col gap-6">
                <form.AppField
                  name="name"
                  children={(field) => <field.TextField label="Name" />}
                />
                <form.AppField
                  name="username"
                  children={(field) => <field.TextField label="Username" />}
                />
                <form.AppField
                  name="email"
                  children={(field) => <field.TextField label="Email" />}
                />
                <form.AppField
                  name="password"
                  children={(field) => (
                    <field.TextField label="Password" type="password" />
                  )}
                />

                <Button type="submit" className="w-full">
                  Sign up
                </Button>

                {signupMutation.error && (
                  <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertDescription>
                      {getErrorMessage(signupMutation.error)}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="underline underline-offset-4">
                    Log in
                  </Link>
                </div>
              </div>
            </form>
            <div className="relative hidden md:block">
              <img
                src={signupImg}
                alt=""
                className="h-full w-md border-l border-l-border object-contain p-8 dark:brightness-[0.75] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-xs text-balance text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
          By clicking sign up, you agree to our{" "}
          {/* <Link to="/terms-of-service">Terms of Service</Link> and{" "}
            <Link to="/privacy-policy">Privacy Policy</Link>. */}
        </div>
      </Wrapper>
    </PageContainer>
  )
}
