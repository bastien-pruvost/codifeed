import { Link } from "@tanstack/react-router"
import { ChevronDownIcon, LogOutIcon, UserIcon } from "lucide-react"

import type { UserPublic } from "@/types/generated/api.gen"
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
import { UserAvatar } from "@/features/users/components/user-avatar"

export function UserMenu({ user }: { user: UserPublic }) {
  const { mutate: logout } = useLogoutMutation()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-auto w-fit hover:bg-transparent"
        >
          <UserAvatar user={user} />
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
