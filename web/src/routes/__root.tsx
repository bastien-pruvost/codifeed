import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router"
import { lazy, Suspense } from "react"

import type { RouterContext } from "@/main"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/sonner"
import { authUserQueryOptions } from "@/features/auth/api/auth-user-query"
import { shouldBeAuthenticated } from "@/features/auth/services/auth-flag-storage"

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    const user = shouldBeAuthenticated()
      ? await context.queryClient.ensureQueryData(authUserQueryOptions())
      : null
    return { auth: { user } }
  },
  component: RootComponent,
  notFoundComponent: () => (
    <div className="p-8 text-center text-destructive">Not found</div>
  ),
})

function RootComponent() {
  const { auth } = Route.useRouteContext()

  return (
    <>
      <HeadContent />
      <Header user={auth.user} />
      <Outlet />
      <Toaster position="top-center" richColors />

      {import.meta.env.DEV ? (
        <Suspense fallback={null}>
          <TanStackRouterDevtools position="bottom-left" />
          <ReactQueryDevtools buttonPosition="bottom-right" />
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

const ReactQueryDevtools = lazy(() =>
  import.meta.env.DEV
    ? import("@tanstack/react-query-devtools").then((module) => ({
        default: module.ReactQueryDevtools,
      }))
    : Promise.resolve({ default: () => null }),
)
