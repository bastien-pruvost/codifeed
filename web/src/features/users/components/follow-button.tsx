import { useState } from "react"

import type { components } from "@/types/generated/api.gen"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useFollowUser,
  useUnfollowUser,
} from "@/features/users/api/user-mutations"

interface FollowButtonProps {
  user: components["schemas"]["UserDetail"]
}

export function FollowButton({ user }: FollowButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [hovered, setHovered] = useState(false)

  const follow = useFollowUser()
  const unfollow = useUnfollowUser()

  if (!user.isFollowing) {
    return (
      <Button
        size="sm"
        onClick={() => follow.mutate(user.username)}
        // No loading state; optimistic update handled in mutation
      >
        Follow
      </Button>
    )
  }

  return (
    <>
      <Button
        size="sm"
        variant={hovered ? "destructive" : "secondary"}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setShowConfirm(true)}
      >
        {hovered ? "Unfollow" : "Followed"}
      </Button>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unfollow @{user.username}?</DialogTitle>
            <DialogDescription>
              You will stop seeing updates from this user in your feed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                unfollow.mutate(user.username)
                setShowConfirm(false)
              }}
            >
              Unfollow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
