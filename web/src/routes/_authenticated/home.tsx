import { useAuth } from "@/hooks/use-auth"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/home")({
  component: RouteComponent,
  // loader: ({ context: { queryClient } }) =>
  //   queryClient.ensureQueryData(postsQueryOptions),
})

function RouteComponent() {
  const auth = useAuth()
  // const postsQuery = useSuspenseQuery(postsQueryOptions)
  // const posts = postsQuery.data
  const routeContext = Route.useRouteContext()

  console.log({ routeContext })

  return (
    <div className="text-center">
      <h1>Home</h1>
      <p></p>
      <p>
        {auth.isAuthenticated
          ? "You are authenticated"
          : "You are not authenticated"}
      </p>
      <p>
        {auth.user
          ? `Welcome ${auth.user.firstname} ${auth.user.lastname}`
          : "No user"}
      </p>
    </div>
  )
}
