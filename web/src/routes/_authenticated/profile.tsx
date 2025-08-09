import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/profile")({
  component: RouteComponent,
})

function RouteComponent() {
  const { auth } = Route.useRouteContext()

  return (
    <div>
      Hello {auth.user?.firstname} {auth.user?.lastname}
    </div>
  )
}
