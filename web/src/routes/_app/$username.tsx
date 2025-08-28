import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { PageContainer } from "@/components/ui/page-container"
import { Wrapper } from "@/components/ui/wrapper"
import { userProfileQueryOptions } from "@/features/users/api/user-profile-query"

export const Route = createFileRoute("/_app/$username")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      userProfileQueryOptions(params.username),
    )
  },
  component: UserProfilePage,
})

export function UserProfilePage() {
  const username = Route.useParams({ select: (params) => params.username })
  const { data: userProfile } = useSuspenseQuery(
    userProfileQueryOptions(username),
  )

  return (
    <PageContainer>
      <Wrapper>
        <Card>
          <CardHeader>
            <CardTitle>{userProfile.username}</CardTitle>
          </CardHeader>
        </Card>
      </Wrapper>
    </PageContainer>
  )
}
