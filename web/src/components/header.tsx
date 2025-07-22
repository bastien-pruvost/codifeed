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
import type { UserRead } from "@/types/api.gen"
import { Link, useNavigate } from "@tanstack/react-router"
import { LogOutIcon, MessageSquareCode } from "lucide-react"
import type { ComponentPropsWithoutRef } from "react"

interface HeaderProps extends ComponentPropsWithoutRef<typeof Wrapper> {
  user?: UserRead
}

export function Header({ user }: HeaderProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 right-0 left-0 z-50 border-b">
      <Wrapper className="flex items-center justify-between py-3">
        <Link to="/home" className="flex items-center gap-2.5 text-primary">
          <MessageSquareCode className="size-7" />
          <span className="mb-1 text-2xl font-semibold">Codifeed</span>
        </Link>

        {user ? (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar>
                  <AvatarImage
                    src={user?.avatar ?? ""}
                    alt={`${user?.firstname} ${user?.lastname}`}
                  />
                  <AvatarFallback>
                    {user?.firstname.charAt(0)}
                    {user?.lastname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={async () => {
                  await logout().then(() => navigate({ to: "/" }))
                }}
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
