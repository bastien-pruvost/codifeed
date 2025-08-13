import type { ComponentPropsWithoutRef } from "react"
import { Link } from "@tanstack/react-router"

import type { UserRead } from "@/types/generated/api.gen"
import { CodifeedLogo } from "@/components/codifeed-logo"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Wrapper } from "@/components/ui/wrapper"
import { UserMenu } from "@/components/user-menu"
import { SearchBar } from "@/features/search/components/search-bar"

interface HeaderProps extends ComponentPropsWithoutRef<typeof Wrapper> {
  user: UserRead
}

export function AppHeader({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 shadow-sm shadow-muted/50 backdrop-blur-md">
      <Wrapper
        width="full"
        className="flex h-(--header-height) w-full items-center justify-between gap-4"
      >
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4 md:hidden"
          />

          <Link to="/home">
            <CodifeedLogo />
          </Link>
        </div>
        <div className="flex grow items-center justify-end gap-2">
          <SearchBar className="w-full max-w-xs" />

          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />

          <UserMenu user={user} />
        </div>
      </Wrapper>
    </header>
  )
}
