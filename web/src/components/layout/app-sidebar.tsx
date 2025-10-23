import type { ComponentProps } from "react"
import { HomeIcon, UserIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navData = {
  projects: [
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
      url: "/me",
      icon: UserIcon,
    },
  ],
}

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarContent>
        <SidebarGroup className="p-2 group-data-[collapsible=icon]:hidden">
          {/* <SidebarGroupLabel>Projects</SidebarGroupLabel> */}
          <SidebarMenu>
            {navData.projects.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  size="lg"
                  className="gap-3 text-base [&>svg]:size-5"
                >
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
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
