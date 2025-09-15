import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page-container"
import { H1, P } from "@/components/ui/typography"
import { Wrapper } from "@/components/ui/wrapper"
import { useRefreshTokenMutation } from "@/features/auth/api/auth-mutations"

export const Route = createFileRoute("/_app/home")({
  component: RouteComponent,
})

function RouteComponent() {
  const user = Route.useRouteContext({
    select: (context) => context.user,
  })

  const refreshTokenMutation = useRefreshTokenMutation()

  return (
    <PageContainer>
      <Wrapper>
        <div className="mb-8 text-center">
          <H1>HOME - FEED</H1>

          <P className="mt-4">You are authenticated ✅</P>
          <P className="mt-4">Welcome back {user.name}</P>

          <Button
            variant="default"
            onClick={() => refreshTokenMutation.mutate()}
            className="mt-4"
          >
            Refresh token
          </Button>
        </div>
      </Wrapper>
    </PageContainer>
  )
}
