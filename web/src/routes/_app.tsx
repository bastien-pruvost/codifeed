import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { AppHeader } from "@/components/layout/app-header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Wrapper } from "@/components/ui/wrapper"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"
import { userQueries } from "@/features/users/api/user-queries"

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context, location }) => {
    const currentUser = await context.queryClient.ensureQueryData(
      userQueries.currentUser(),
    )
    if (!currentUser) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      })
    }

    return { currentUser }
  },
  component: AppLayout,
})

function AppLayout() {
  const currentUser = useCurrentUser()

  return (
    <SidebarProvider className="flex flex-col">
      <AppHeader currentUser={currentUser} />

      <Wrapper className="flex max-w-5xl flex-1 px-0 sm:px-0 md:pr-0 lg:pr-0">
        <AppSidebar className="top-(--header-height) h-(--page-container-min-height)" />

        <SidebarInset className="overflow-hidden">
          <Outlet />
        </SidebarInset>
      </Wrapper>
    </SidebarProvider>
  )
}
