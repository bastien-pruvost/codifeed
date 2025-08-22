import { Link } from "@tanstack/react-router"

import { AppLogo } from "@/components/codifeed-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Wrapper } from "@/components/ui/wrapper"

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 shadow-xs shadow-muted/20 backdrop-blur-md">
      <Wrapper className="flex h-(--header-height) items-center justify-between">
        <Link to="/">
          <AppLogo />
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
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
