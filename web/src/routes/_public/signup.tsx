import { createFileRoute, Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageContainer } from "@/components/ui/page-container"
import { Wrapper } from "@/components/ui/wrapper"
import { useSignupMutation } from "@/features/auth/api/signup-mutation"
import signupImg from "@/features/auth/assets/signup-illustration.webp"
import { getFormDataString } from "@/utils/forms"

export const Route = createFileRoute("/_public/signup")({
  component: SignupPage,
})

function SignupPage() {
  const { mutate: signup } = useSignupMutation()

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.currentTarget)

      signup({
        email: getFormDataString(formData, "email"),
        password: getFormDataString(formData, "password"),
        name: getFormDataString(formData, "name"),
        username: getFormDataString(formData, "username"),
        avatar: null,
      })
    } catch (error) {
      console.error("Signup failed:", error)
    }
  }

  return (
    <PageContainer className="flex items-center justify-center">
      <Wrapper className="max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={handleSignup}>
              <h1 className="text-center text-2xl font-bold">
                Create your account
              </h1>
              <p className="mt-2 text-center text-balance text-muted-foreground">
                Join Codifeed and connect with developers
              </p>

              <div className="mt-8 flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="john_doe"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="********"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Sign up
                </Button>

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
