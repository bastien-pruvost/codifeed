import { useAuth } from "@/hooks/use-auth"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/home")({
  component: RouteComponent,
  // loader: ({ context: { queryClient } }) =>
  //   queryClient.ensureQueryData(postsQueryOptions),
})

function RouteComponent() {
  console.log("Home load")
  const auth = useAuth()
  // const routeContext = Route.useRouteContext()

  // const postsQuery = useSuspenseQuery(postsQueryOptions)
  // const posts = postsQuery.data

  // console.log("AUTH FROM HOOK: ", {
  //   user: !!auth.user,
  //   isLoading: auth.isLoading,
  // })
  // console.log("AUTH FROM CONTEXT: ", {
  //   user: !!routeContext.auth.user,
  //   isLoading: routeContext.auth.isLoading,
  // })

  return (
    <div className="text-center">
      <h1>Home</h1>
      <p></p>
      <p>
        {auth.isAuthenticated
          ? "You are authenticated ✅"
          : "You are not authenticated ❌"}
      </p>
      <p>
        {auth.user
          ? `Welcome ${auth.user.firstname} ${auth.user.lastname}`
          : "No user"}
      </p>
    </div>
  )
}
