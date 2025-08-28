import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { useRefreshTokenMutation } from "@/features/auth/api/refresh-token-mutation"

export const Route = createFileRoute("/_app/home")({
  component: RouteComponent,
})

function RouteComponent() {
  const user = Route.useRouteContext({
    select: (context) => context.user,
  })

  const { mutate: refreshToken } = useRefreshTokenMutation()

  return (
    <div className="text-center">
      <h1>HOME - FEED</h1>

      <br />

      <p>You are authenticated ✅</p>
      <p>Welcome back {user.name}</p>

      <br />

      <Button variant="default" onClick={() => refreshToken()}>
        Refresh token
      </Button>
    </div>
  )
}
