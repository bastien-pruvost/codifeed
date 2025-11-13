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
