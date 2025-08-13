import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { useRefreshTokenMutation } from "@/features/auth/api/refresh-token-mutation"

export const Route = createFileRoute("/_authenticated/home")({
  component: RouteComponent,
  // loader: ({ context: { queryClient } }) =>
  //   queryClient.ensureQueryData(postsQueryOptions),
})

function RouteComponent() {
  const { auth } = Route.useRouteContext()

  // const postsQuery = useSuspenseQuery(postsQueryOptions)
  // const posts = postsQuery.data
  const user = auth.user
  const { mutateAsync: refreshToken } = useRefreshTokenMutation()
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

      <Button
        variant="outline"
        onClick={() => {
          refreshToken()
        }}
      >
        Refresh token
      </Button>
    </div>
  )
}
