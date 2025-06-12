import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wrapper } from "@/components/ui/wrapper"
import { Link } from "@tanstack/react-router"
import { LogOutIcon, NetworkIcon } from "lucide-react"
import type { ComponentPropsWithoutRef } from "react"

interface HeaderProps extends ComponentPropsWithoutRef<typeof Wrapper> {
  user?: any
}

export function Header(props: HeaderProps) {
  const { user } = props

  return (
    <Wrapper className="flex items-center justify-between border py-3">
      <Link to="/" className="flex items-center gap-2 text-primary">
        <NetworkIcon />
        <span className="text-xl font-medium">Codifeed</span>
      </Link>

      {user ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar>
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name.charAt(0)}B</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>
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
          <Button asChild>
            <Link to="/register">Register</Link>
          </Button>
        </div>
      )}
    </Wrapper>
  )
}
