import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { GuestHeader } from "@/components/layout/guest-header"
import { currentUserQueryOptions } from "@/features/auth/api/current-user-query"

export const Route = createFileRoute("/_unauthenticated")({
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
    <div className="relative min-h-screen w-full">
      <UnauthenticatedLayoutBackground />
      <GuestHeader />
      <div className="relative">
        <Outlet />
      </div>
    </div>
  )
}

function UnauthenticatedLayoutBackground() {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `,
        backgroundSize: "20px 30px",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        maskImage:
          "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
      }}
    />
  )
}
