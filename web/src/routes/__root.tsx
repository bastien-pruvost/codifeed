import { Header } from "@/components/header"
import { useAuth, type AuthContext } from "@/hooks/use-auth"
import { authUserQueryOptions } from "@/services/api/auth"
import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { lazy, Suspense } from "react"

interface RouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  beforeLoad: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({ ...authUserQueryOptions() }),
  notFoundComponent: () => (
    <div className="p-8 text-center text-destructive">Not found</div>
  ),
})

function RootComponent() {
  const auth = useAuth()
  return (
    <>
      <Header user={auth.user} />
      <Outlet />
      {import.meta.env.DEV ? (
        <Suspense fallback={null}>
          {/* <ReactQueryDevtool buttonPosition="top-right" /> */}
          <TanStackRouterDevtools position="bottom-right" />
        </Suspense>
      ) : null}
    </>
  )
}

const TanStackRouterDevtools = lazy(() =>
  import.meta.env.DEV
    ? import("@tanstack/react-router-devtools").then((module) => ({
        default: module.TanStackRouterDevtools,
      }))
    : Promise.resolve({ default: () => null }),
)
