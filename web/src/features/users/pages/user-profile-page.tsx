import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"

import { userProfileQueryOptions } from "@/features/users/api/user-profile-query"

export function UserProfilePage() {
  const params = useParams({ from: "/_app/$username" })
  const { data: userProfile } = useSuspenseQuery(
    userProfileQueryOptions(params.username),
  )

  return (
    <div>
      <h1>User Profile</h1>
    </div>
  )
}
