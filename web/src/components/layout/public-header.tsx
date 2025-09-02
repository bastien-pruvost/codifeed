import { Link } from "@tanstack/react-router"

import { AppLogo } from "@/components/app-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Wrapper } from "@/components/ui/wrapper"

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-b-transparent bg-background/80 backdrop-blur-md">
      <Wrapper className="flex h-(--header-height) items-center justify-between gap-2 sm:gap-3">
        <Link to="/">
          <AppLogo className="**:data-[slot=app-logo-text]:hidden *:data-[slot=app-logo-text]:sm:block" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Button variant="outline" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
      </Wrapper>
    </header>
  )
}
