import { revalidateLogic } from "@tanstack/react-form"
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { AlertCircleIcon } from "lucide-react"
import { z } from "zod"

import { useAppForm } from "@/components/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { InlineLink } from "@/components/ui/inline-link"
import { PageContainer } from "@/components/ui/page-container"
import { H1, P } from "@/components/ui/typography"
import { Wrapper } from "@/components/ui/wrapper"
import { useLoginMutation } from "@/features/auth/api/auth-mutations"
import loginImg from "@/features/auth/assets/login-illustration.webp"
import { getErrorMessage } from "@/utils/errors"

const searchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
})

export const Route = createFileRoute("/_public/login")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Login" }] }),
  component: LoginPage,
})

const loginFormSchema = z.object({
  email: z.email({
    error: ({ input }) =>
      input
        ? "Enter a valid email address: email@example.com"
        : "Email is required",
  }),
  password: z.string().min(1, "Password is required"),
})

const loginDefaultValues: z.input<typeof loginFormSchema> = {
  email: "",
  password: "",
}

function LoginPage() {
  const router = useRouter()
  const redirectUrl = Route.useSearch({
    select: (search) => search.redirect,
  })

  const loginMutation = useLoginMutation()

  const form = useAppForm({
    defaultValues: loginDefaultValues,
    validators: {
      onDynamic: loginFormSchema,
    },
    validationLogic: revalidateLogic(),
    onSubmit: ({ value }) => {
      loginMutation.mutate(value, {
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
              <H1 className="text-center text-2xl">Welcome back</H1>
              <P tone="muted" className="mt-2 text-center text-balance">
                Login to your Codifeed account
              </P>

              <div className="mt-8 flex flex-col gap-6">
                <form.AppField
                  name="email"
                  children={(field) => (
                    <field.TextField
                      type="text"
                      label="Email"
                      autoComplete="email"
                    />
                  )}
                />
                <div>
                  <form.AppField
                    name="password"
                    children={(field) => (
                      <field.TextField
                        type="password"
                        label="Password"
                        autoComplete="current-password"
                      />
                    )}
                  />
                  <InlineLink
                    asChild
                    className="mt-2 ml-auto block w-fit text-xs text-foreground"
                  >
                    <Link to="/home">Forgot your password?</Link>
                  </InlineLink>
                </div>

                <Button type="submit" className="w-full">
                  Log in
                </Button>

                {loginMutation.error && (
                  <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertDescription>
                      {getErrorMessage(loginMutation.error)}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <InlineLink asChild>
                    <Link to="/signup">Sign up</Link>
                  </InlineLink>
                </div>
              </div>
            </form>

            <div className="hidden border-l md:block">
              <img
                src={loginImg}
                alt="Someone logging in to Codifeed"
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
