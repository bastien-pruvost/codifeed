import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { useRefreshTokenMutation } from "@/features/auth/api/refresh-token-mutation"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"

export const Route = createFileRoute("/_app/home")({
  component: RouteComponent,
})

function RouteComponent() {
  const user = useCurrentUser()
  const { mutate: refreshToken } = useRefreshTokenMutation()
  return (
    <div className="text-center">
      <h1>HOME - FEED</h1>

      <br />

      {user ? (
        <>
          <p>You are authenticated ✅</p>
          <p>Welcome back {user.name}</p>
        </>
      ) : (
        <>
          <p>You are not authenticated ❌</p>
          <p>No user</p>
        </>
      )}

      <br />

      <Button variant="default" onClick={() => refreshToken()}>
        Refresh token
      </Button>
    </div>
  )
}
