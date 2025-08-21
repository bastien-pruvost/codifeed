import { revalidateLogic } from "@tanstack/react-form"
import { createFileRoute, Link } from "@tanstack/react-router"
import { AlertCircleIcon } from "lucide-react"
import { z } from "zod"

import { useAppForm } from "@/components/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"
import { Wrapper } from "@/components/ui/wrapper"
import { useLoginMutation } from "@/features/auth/api/login-mutation"
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
  const loginMutation = useLoginMutation()

  const form = useAppForm({
    defaultValues: loginDefaultValues,
    validators: {
      onDynamic: loginFormSchema,
    },
    validationLogic: revalidateLogic(),
    onSubmit: ({ value }) => {
      loginMutation.mutate(value)
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
              <h1 className="text-center text-2xl font-bold">Welcome back</h1>
              <p className="mt-2 text-center text-balance text-muted-foreground">
                Login to your Codifeed account
              </p>

              <div className="mt-8 flex flex-col gap-6">
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

                <Link
                  to="/home"
                  className="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </Link>

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
                  <Link to="/signup" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
            <div className="relative hidden md:block">
              <img
                src={loginImg}
                alt=""
                className="h-full w-md border-l border-l-border object-contain p-8 dark:brightness-[0.75]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-xs text-balance text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
          By clicking login, you agree to our{" "}
          {/* <Link to="/terms-of-service">Terms of Service</Link> and{" "}
            <Link to="/privacy-policy">Privacy Policy</Link>. */}
        </div>
      </Wrapper>
    </PageContainer>
  )
}
