import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/home")({
  component: RouteComponent,
  // loader: ({ context: { queryClient } }) =>
  //   queryClient.ensureQueryData(postsQueryOptions),
})

function RouteComponent() {
  console.log("Home load")
  const { auth } = Route.useRouteContext()

  // const postsQuery = useSuspenseQuery(postsQueryOptions)
  // const posts = postsQuery.data
  const user = auth.user

  return (
    <div className="text-center">
      <h1>Home</h1>
      <br />

      {user ? (
        <>
          <p>You are authenticated ✅</p>
          <p>
            Welcome back {user.firstname} {user.lastname}
          </p>
        </>
      ) : (
        <>
          <p>You are not authenticated ❌</p>
          <p>No user</p>
        </>
      )}
    </div>
  )
}
