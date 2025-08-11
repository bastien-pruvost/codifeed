import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { AlertCircleIcon } from "lucide-react"
import { z } from "zod"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageContainer } from "@/components/ui/page-container"
import { Wrapper } from "@/components/ui/wrapper"
import { useLoginMutation } from "@/features/auth/api/login-mutation"
import loginImg from "@/features/auth/assets/login-illustration.webp"
import { getErrorMessage } from "@/utils/errors"

const rootSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute("/_unauthenticated/(auth)/login")({
  validateSearch: zodValidator(rootSearchSchema),
  head: () => {
    return {
      meta: [
        {
          title: "Login",
        },
      ],
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const search = Route.useSearch()

  const loginMutation = useLoginMutation()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    await loginMutation.mutateAsync({
      email: formData.get("email")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? "",
    })

    // Navigate to redirect URL or home
    router.history.push(search.redirect ?? "/home")
  }

  return (
    <PageContainer className="flex items-center justify-center bg-muted">
      <Wrapper className="max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={handleLogin}>
              <h1 className="text-center text-2xl font-bold">Welcome back</h1>
              <p className="mt-2 text-center text-balance text-muted-foreground">
                Login to your Codifeed account
              </p>

              <div className="mt-8 flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="me@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="********"
                    required
                  />
                </div>
                {/* <Link
                    to="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link> */}
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
                className="h-full w-md border-l border-l-border object-contain p-8 dark:brightness-[0.2] dark:grayscale"
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
