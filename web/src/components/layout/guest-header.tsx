import { Link } from "@tanstack/react-router"

import { CodifeedLogo } from "@/components/codifeed-logo"
import { Button } from "@/components/ui/button"
import { Wrapper } from "@/components/ui/wrapper"

export function GuestHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/5 shadow-xs shadow-muted/20 backdrop-blur-xs">
      <Wrapper className="flex h-(--header-height) items-center justify-between">
        <Link to="/">
          <CodifeedLogo />
        </Link>

        <div className="flex items-center gap-4">
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
