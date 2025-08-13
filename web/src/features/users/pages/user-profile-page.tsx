import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"

import { userProfileQueryOptions } from "@/features/users/api/user-profile-query"

export function UserProfilePage() {
  const params = useParams({ from: "/_authenticated/$username" })
  const { data: userProfile } = useSuspenseQuery(
    userProfileQueryOptions(params.username),
  )

  console.log(userProfile)

  return <div>Hello {userProfile?.name}</div>
}
