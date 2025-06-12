import { Header } from "@/components/header"
import type { AuthContext } from "@/hooks/use-auth"
import type { QueryClient } from "@tanstack/react-query"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { lazy, Suspense } from "react"

const TanStackRouterDevtools = lazy(() =>
  import.meta.env.DEV
    ? import("@tanstack/react-router-devtools").then((module) => ({
        default: module.TanStackRouterDevtools,
      }))
    : Promise.resolve({ default: () => null }),
)

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  auth: AuthContext
}>()({
  component: RootComponent,
  // notFoundComponent: () => <div>Not found</div>,
})

function RootComponent() {
  return (
    <>
      <Header user={false} />
      <Outlet />
      {/* <ReactQueryDevtool buttonPosition="top-right" /> */}
      <Suspense fallback={null}>
        <TanStackRouterDevtools position="bottom-right" />
      </Suspense>
    </>
  )
}
