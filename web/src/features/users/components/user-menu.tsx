import { Link, useRouter } from "@tanstack/react-router"
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
import { useLogoutMutation } from "@/features/auth/api/auth-mutations"
import { UserAvatar } from "@/features/users/components/user-avatar"

export function UserMenu({ user }: { user: UserPublic }) {
  const router = useRouter()
  const logout = useLogoutMutation()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-2!">
          <UserAvatar user={user} />
          <div className="hidden text-sm font-medium md:block">{user.name}</div>
          <ChevronDownIcon className="hidden size-4 md:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
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
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() =>
            logout.mutate(undefined, {
              onSuccess: () => {
                router.history.push("/")
              },
            })
          }
        >
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
