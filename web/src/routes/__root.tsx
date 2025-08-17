import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router"
import { lazy, Suspense } from "react"

import type { RouterContext } from "@/main"
import { Toaster } from "@/components/ui/sonner"
import { currentUserQueryOptions } from "@/features/auth/api/current-user-query"
import { shouldBeAuthenticated } from "@/features/auth/services/auth-flag-storage"

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    if (shouldBeAuthenticated()) {
      await context.queryClient.ensureQueryData(currentUserQueryOptions())
    }
  },
  component: RootRouteComponent,
})

function RootRouteComponent() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <HeadContent />

      <Outlet />

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
