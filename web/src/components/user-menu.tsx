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
import { getUserInitials } from "@/features/users/utils"

export function UserMenu({ user }: { user: UserRead }) {
  const { mutate: logout } = useLogoutMutation()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:bg-transparent">
          <Avatar>
            <AvatarImage src={user.avatar ?? ""} alt={user.name} />
            <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
          </Avatar>
          <div className="hidden text-sm font-medium md:block">{user.name}</div>
          <ChevronDownIcon className="hidden size-4 md:block" />
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
