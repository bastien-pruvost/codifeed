import { Link } from "@tanstack/react-router"
import { ChevronDownIcon, LogOutIcon, UserIcon } from "lucide-react"

import type { UserRead } from "@/types/generated/api.gen"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLogoutMutation } from "@/features/auth/api/logout-mutation"

export function UserMenu({ user }: { user: UserRead }) {
  const { mutateAsync: logout } = useLogoutMutation()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:bg-transparent">
          <Avatar>
            <AvatarImage src={user.avatar ?? ""} alt={user.name ?? ""} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium">{user.name}</div>
          <ChevronDownIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="text-sm font-medium">{user.name}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            @{user.username}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/$username" params={{ username: user.username }}>
            <UserIcon />
            Your profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={() => logout()}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
