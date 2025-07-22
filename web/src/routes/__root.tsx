import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"
import { useAuth, type AuthContext } from "@/hooks/use-auth"
import { authUserQueryOptions } from "@/services/api/auth"
import { shouldBeAuthenticated } from "@/services/local-storage/auth"

import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { lazy, Suspense } from "react"

interface RouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    console.log("beforeLoad in root")
    const user = shouldBeAuthenticated()
      ? await context.queryClient.ensureQueryData(authUserQueryOptions())
      : null

    return {
      auth: {
        user,
        isAuthenticated: !!user,
        isLoading: false,
      },
    }
  },
  component: RootComponent,
  notFoundComponent: () => (
    <div className="p-8 text-center text-destructive">Not found</div>
  ),
})

function RootComponent() {
  console.log("Root load")
  const auth = useAuth()
  // const context = Route.useRouteContext()

  return (
    <>
      <Header user={auth.user} />
      <Outlet />
      <Toaster />
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
