import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo } from "react"

import { PageContainer } from "@/components/ui/page-container"
import { Wrapper } from "@/components/ui/wrapper"
import { userQueries } from "@/features/users/api/user-queries"
import { UserList } from "@/features/users/components/user-list"

export const Route = createFileRoute("/_app/$username/followers")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureInfiniteQueryData(
      userQueries.followersInfinite({
        username: params.username,
        itemsPerPage: 5,
      }),
    )
  },
  component: FollowersPage,
})

function FollowersPage() {
  const username = Route.useParams({ select: (p) => p.username })

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      userQueries.followersInfinite({ username, itemsPerPage: 5 }),
    )

  const items = useMemo(() => {
    const originalItems = data.pages.flatMap((p) => p.data)
    const multipliedItems = []

    for (let i = 0; i < 4; i++) {
      multipliedItems.push(
        ...originalItems.map((user, index) => ({
          ...user,
          id: `${user.id}_${i}_${index}`,
        })),
      )
    }

    return multipliedItems
  }, [data])

  return (
    <PageContainer>
      <Wrapper>
        <UserList
          title="Followers"
          users={items}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={() => void fetchNextPage()}
        />
      </Wrapper>
    </PageContainer>
  )
}
