import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { AppHeader } from "@/components/layout/app-header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useAuthUser } from "@/features/auth/hooks/use-auth-user"

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.user) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const user = useAuthUser()

  if (!user) {
    return null
  }

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
