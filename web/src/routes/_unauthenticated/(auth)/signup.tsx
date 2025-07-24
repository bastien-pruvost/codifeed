import { createFileRoute, Link } from "@tanstack/react-router"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import signupImg from "@/features/auth/assets/signup-illustration.webp"

export const Route = createFileRoute("/_unauthenticated/(auth)/signup")({
  component: SignupPage,
})

function SignupPage() {
  // const router = useRouter()
  // const signupMutation = useSignupMutation()

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // const formData = new FormData(e.currentTarget)

    // signupMutation.mutate(
    //   {
    //     firstname: formData.get("firstname")?.toString() ?? "",
    //     lastname: formData.get("lastname")?.toString() ?? "",
    //     email: formData.get("email")?.toString() ?? "",
    //     password: formData.get("password")?.toString() ?? "",
    //     avatar: null,
    //   },
    //   {
    //     onSuccess: () => {
    //       router.navigate({ to: "/login" })
    //     },
    //   },
    // )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={handleSignup}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-balance text-muted-foreground">
                      Join Codifeed and connect with developers
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-3">
                      <Label htmlFor="firstname">First name</Label>
                      <Input
                        id="firstname"
                        name="firstname"
                        type="text"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="lastname">Last name</Label>
                      <Input
                        id="lastname"
                        name="lastname"
                        type="text"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
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
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="********"
                      required
                    />
                  </div>
                  {/* <Button
                    type="submit"
                    className="w-full"
                    disabled={signupMutation.isPending}
                  >
                    {signupMutation.isPending
                      ? "Creating account..."
                      : "Sign up"}
                  </Button> */}

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
                  className="absolute inset-0 h-full w-full border-l border-l-border object-contain p-8 dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-center text-xs text-balance text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
            By clicking sign up, you agree to our{" "}
            {/* <Link to="/terms-of-service">Terms of Service</Link> and{" "}
            <Link to="/privacy-policy">Privacy Policy</Link>. */}
          </div>
        </div>
      </div>
    </div>
  )
}
