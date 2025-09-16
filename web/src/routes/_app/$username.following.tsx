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

export const Route = createFileRoute("/_app/$username/following")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureInfiniteQueryData(
      userQueries.followingInfinite({
        username: params.username,
        itemsPerPage: 5,
      }),
    )
  },
  component: UserFollowingPage,
})

function UserFollowingPage() {
  const username = Route.useParams({ select: (p) => p.username })

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      userQueries.followingInfinite({ username, itemsPerPage: 5 }),
    )

  const items = useMemo(() => {
    return data.pages.flatMap((p) => p.data)
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
            <UserListTitle>Following</UserListTitle>
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
