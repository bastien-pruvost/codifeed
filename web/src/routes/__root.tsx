import type { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const TanStackRouterDevtools = lazy(() =>
  import.meta.env.DEV
    ? import('@tanstack/react-router-devtools').then((mod) => ({
        default: mod.TanStackRouterDevtools,
      }))
    : Promise.resolve({ default: () => null }),
)

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />
      {/* <ReactQueryDevtool buttonPosition="top-right" /> */}
      <Suspense fallback={null}>
        <TanStackRouterDevtools position="bottom-right" />
      </Suspense>
    </>
  )
}
