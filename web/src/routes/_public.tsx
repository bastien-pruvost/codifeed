import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { PublicHeader } from "@/components/layout/public-header"
import { currentUserQueryOptions } from "@/features/auth/api/current-user-query"

export const Route = createFileRoute("/_public")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(
      currentUserQueryOptions(),
    )
    if (user) {
      throw redirect({ to: "/home" })
    }
  },
  component: UnauthenticatedLayout,
})

function UnauthenticatedLayout() {
  return (
    <div className="relative min-h-screen">
      <DotsBackground />
      <PublicHeader />
      <div className="relative">
        <Outlet />
      </div>
    </div>
  )
}

function DotsBackground() {
  return (
    <div className="absolute h-full w-full bg-[radial-gradient(var(--muted)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:16px_16px]" />
  )
}
