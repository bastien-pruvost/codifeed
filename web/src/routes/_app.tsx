import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { AppHeader } from "@/components/layout/app-header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Wrapper } from "@/components/ui/wrapper"
import { userQueries } from "@/features/users/api/user-queries"

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryClient.ensureQueryData(
      userQueries.currentUser(),
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
    <SidebarProvider className="block">
      <AppHeader user={user} />

      <Wrapper className="flex max-w-5xl flex-1 px-0 sm:px-0 md:pr-0 lg:pr-0">
        <AppSidebar />

        <SidebarInset className="overflow-hidden">
          <Outlet />
        </SidebarInset>

        {/* <Sidebar variant="floating" side="right" /> */}
      </Wrapper>
    </SidebarProvider>
  )
}
