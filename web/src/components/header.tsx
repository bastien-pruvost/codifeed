import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wrapper } from "@/components/ui/wrapper"
import { useAuth } from "@/hooks/use-auth"
import { Link } from "@tanstack/react-router"
import { LogOutIcon, NetworkIcon } from "lucide-react"
import type { ComponentPropsWithoutRef } from "react"

interface HeaderProps extends ComponentPropsWithoutRef<typeof Wrapper> {
  user?: any
}

export function Header(props: HeaderProps) {
  const { user } = props
  const { logout } = useAuth()

  return (
    <div className="sticky top-0 right-0 left-0 z-50 border-b">
      <Wrapper className="flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <NetworkIcon />
          <span className="text-xl font-medium">Codifeed</span>
        </Link>

        {user ? (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar>
                  <AvatarImage src={user?.avatar} alt={user?.firstname} />
                  <AvatarFallback>
                    {user?.firstname.charAt(0)}
                    {user?.lastname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => logout()}>
                <LogOutIcon />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link to="/login">Login</Link>
            </Button>
            {/* <Button asChild>
            <Link to="/register">Register</Link>
          </Button> */}
          </div>
        )}
      </Wrapper>
    </div>
  )
}
