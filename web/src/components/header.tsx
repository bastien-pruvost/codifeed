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
import { Link, useRouter } from "@tanstack/react-router"
import { LogOutIcon, NetworkIcon } from "lucide-react"
import type { ComponentPropsWithoutRef } from "react"

interface HeaderProps extends ComponentPropsWithoutRef<typeof Wrapper> {
  user?: any
}

export function Header({ user }: HeaderProps) {
  const router = useRouter()
  const { logout } = useAuth()

  return (
    <div className="sticky top-0 right-0 left-0 z-50 border-b">
      <Wrapper className="flex items-center justify-between py-3">
        <Link to="/home" className="flex items-center gap-2 text-primary">
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
              <DropdownMenuItem
                onClick={() =>
                  logout().finally(() => router.invalidate({ sync: true }))
                }
              >
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
              <Link to="/signup">Signup</Link>
            </Button>
          </div>
        )}
      </Wrapper>
    </div>
  )
}
