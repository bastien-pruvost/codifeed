import type { ComponentProps } from "react"
import { Link } from "@tanstack/react-router"
import { HomeIcon, UserIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const user = useCurrentUser()

  const NAV_DATA = {
    main: [
      {
        name: "Home",
        url: "/home",
        icon: HomeIcon,
      },
      // {
      //   name: "Explore",
      //   url: "/explore",
      //   icon: TelescopeIcon,
      // },
      {
        name: "My Profile",
        url: `/${user.username}`,
        icon: UserIcon,
      },
    ],
  }

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarContent>
        <SidebarGroup className="p-2 group-data-[collapsible=icon]:hidden">
          {/* <SidebarGroupLabel>main</SidebarGroupLabel> */}
          <SidebarMenu>
            {NAV_DATA.main.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  size="lg"
                  className="gap-3 text-base [&>svg]:size-5"
                >
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter>
        Footer
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  )
}
