import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { AppHeader } from "@/components/layout/app-header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { currentUserQueryOptions } from "@/features/auth/api/current-user-query"

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryClient.ensureQueryData(
      currentUserQueryOptions(),
    )
    if (!user) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      })
    }
    return { user }
  },
  component: AppLayout,
})

function AppLayout() {
  // const { data: user } = useSuspenseQuery(currentUserQueryOptions())
  const { user } = Route.useRouteContext()

  return (
    <div className="">
      <SidebarProvider className="flex flex-col">
        <AppHeader user={user} />

        <div className="flex flex-1">
          <AppSidebar />

          <SidebarInset className="overflow-hidden">
            <Outlet />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
