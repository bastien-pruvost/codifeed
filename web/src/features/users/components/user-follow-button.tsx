import type { ComponentProps } from "react"
import { useState } from "react"

import type { UserPublic } from "@/types/generated/api.gen"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "@/features/users/api/user-mutations"

interface FollowButtonProps extends ComponentProps<typeof Button> {
  user: UserPublic
}

export function FollowButton({ user, ...props }: FollowButtonProps) {
  const [hovered, setHovered] = useState(false)

  const follow = useFollowUserMutation()
  const unfollow = useUnfollowUserMutation()

  if (!user.isFollowing) {
    return (
      <Button size="sm" onClick={() => follow.mutate(user.username)} {...props}>
        Follow
      </Button>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={hovered ? "destructive" : "secondary"}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          {...props}
        >
          {hovered ? "Unfollow" : "Followed"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unfollow @{user.username}?</DialogTitle>
          <DialogDescription>
            You will stop seeing updates from this user in your feed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={() => unfollow.mutate(user.username)}
            >
              Unfollow
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
