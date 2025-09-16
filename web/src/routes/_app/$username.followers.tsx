import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo } from "react"

import { PageContainer } from "@/components/ui/page-container"
import { Wrapper } from "@/components/ui/wrapper"
import { userQueries } from "@/features/users/api/user-queries"
import {
  UserList,
  UserListContent,
  UserListItem,
  UserListTitle,
} from "@/features/users/components/user-list"
import {
  InfiniteScroll,
  InfiniteScrollTrigger,
} from "@/hooks/use-infinite-scroll"

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      userQueries.followersInfinite({ username, itemsPerPage: 5 }),
    )

  const items = useMemo(() => {
    const originalItems = data.pages.flatMap((p) => p.data)
    const multipliedItems = []
    for (let i = 0; i < 4; i++) {
      multipliedItems.push(
        ...originalItems.map((item) => ({
          ...item,
          id: `${item.id}_${i}`,
        })),
      )
    }
    return multipliedItems
  }, [data])

  return (
    <PageContainer>
      <Wrapper>
        <InfiniteScroll
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          options={{
            rootMargin: "50% 0px",
          }}
        >
          <UserList>
            <UserListTitle>Followers</UserListTitle>
            <UserListContent>
              {items.map((user) => (
                <UserListItem key={user.id} user={user} />
              ))}
            </UserListContent>
            <InfiniteScrollTrigger />
          </UserList>
        </InfiniteScroll>
      </Wrapper>
    </PageContainer>
  )
}
