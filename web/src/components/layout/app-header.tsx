import type { ComponentProps } from "react"
import { Link } from "@tanstack/react-router"

import type { UserPublic } from "@/types/generated/api.gen"
import { AppLogo } from "@/components/app-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Wrapper } from "@/components/ui/wrapper"
import { SearchBar } from "@/features/search/components/search-bar"
import { UserMenu } from "@/features/users/components/user-menu"

interface HeaderProps extends ComponentProps<typeof Wrapper> {
  user: UserPublic
}

export function AppHeader({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 shadow-sm shadow-muted/50 backdrop-blur-md">
      <Wrapper
        width="full"
        className="flex h-(--header-height) max-w-5xl items-center justify-between gap-3 sm:gap-4"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <SidebarTrigger className="md:hidden" />
          <Link to="/home">
            <AppLogo className="**:data-[slot=app-logo-text]:hidden *:data-[slot=app-logo-text]:sm:block" />
          </Link>
        </div>

        <div className="relative h-9 w-full max-w-xs overflow-visible">
          <SearchBar className="absolute top-0 left-0 h-auto w-full" />
        </div>

        <div className="flex items-center justify-end gap-3 sm:gap-4">
          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      </Wrapper>
    </header>
  )
}
