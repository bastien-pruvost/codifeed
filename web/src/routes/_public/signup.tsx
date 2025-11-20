import { revalidateLogic } from "@tanstack/react-form"
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { AlertCircleIcon } from "lucide-react"
import z from "zod"

import { useAppForm } from "@/components/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { InlineLink } from "@/components/ui/inline-link"
import { PageContainer } from "@/components/ui/page-container"
import { H1, P } from "@/components/ui/typography"
import { Wrapper } from "@/components/ui/wrapper"
import { useSignupMutation } from "@/features/auth/api/auth-mutations"
import signupImg from "@/features/auth/assets/signup-illustration.webp"

const searchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
})

export const Route = createFileRoute("/_public/signup")({
  validateSearch: searchSchema,
  component: SignupPage,
})

const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  username: z
    .string()
    .min(1, "Username is required")
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Username must contain only letters, numbers, hyphens, and underscores",
    )
    .regex(/^[A-Za-z]/, "Username must start with a letter")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters"),
  email: z
    .email("Enter a valid email address, like email@example.com")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(255, "Password must not exceed 255 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
  avatar: z.null(),
})

const defaultValues: z.input<typeof signupSchema> = {
  name: "",
  username: "",
  email: "",
  password: "",
  avatar: null,
}

function SignupPage() {
  const router = useRouter()
  const redirectUrl = Route.useSearch({
    select: (search) => search.redirect,
  })

  const signupMutation = useSignupMutation()

  const form = useAppForm({
    defaultValues,
    validators: {
      onDynamic: signupSchema,
    },
    validationLogic: revalidateLogic(),
    onSubmit: ({ value }) => {
      signupMutation.mutate(value, {
        onSuccess: () => {
          router.history.push(redirectUrl || "/home")
        },
      })
    },
  })

  return (
    <PageContainer className="flex items-center justify-center">
      <Wrapper className="max-w-md md:max-w-4xl">
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
              <H1 className="text-center text-2xl">Create your account</H1>
              <P tone="muted" className="mt-2 text-center text-balance">
                Join Codifeed and connect with the world
              </P>

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
                    <field.TextField
                      label="Password"
                      type="password"
                      description="At least 8 characters with uppercase, lowercase, number, and special character"
                    />
                  )}
                />

                <Button type="submit" className="w-full">
                  Sign up
                </Button>

                {signupMutation.error && (
                  <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertDescription>
                      {signupMutation.error.getUserMessage()}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <InlineLink asChild>
                    <Link to="/login">Log in</Link>
                  </InlineLink>
                </div>
              </div>
            </form>

            <div className="hidden border-l md:block">
              <img
                src={signupImg}
                alt="Someone signing up to Codifeed"
                className="h-full w-full object-contain p-8 dark-filter"
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-xs text-balance text-muted-foreground">
          By clicking login, you agree to our{" "}
          <InlineLink
            asChild
            underline="always"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link to="/">Terms of Service</Link>
          </InlineLink>{" "}
          and{" "}
          <InlineLink
            asChild
            underline="always"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link to="/">Privacy Policy</Link>
          </InlineLink>
          .
        </div>
      </Wrapper>
    </PageContainer>
  )
}
