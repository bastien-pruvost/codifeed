import { createFileRoute } from "@tanstack/react-router"

import { userProfileQueryOptions } from "@/features/users/api/user-profile-query"
import { UserProfilePage } from "@/features/users/pages/user-profile-page"
import { queryClient } from "@/services/query-client"

export const Route = createFileRoute("/_app/$username")({
  loader: async ({ params }) => {
    await queryClient.ensureQueryData(userProfileQueryOptions(params.username))
  },
  component: UserProfilePage,
})
