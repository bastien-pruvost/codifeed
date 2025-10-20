import { useInfiniteQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo } from "react"

import { PageContainer } from "@/components/ui/page-container"
import { Wrapper } from "@/components/ui/wrapper"
import { postQueries } from "@/features/posts/api/post-queries"
import { CreatePostForm } from "@/features/posts/components/create-post-form"
import {
  PostList,
  PostListContent,
  PostListEmpty,
  PostListHeader,
  PostListItem,
  PostListItemSkeleton,
} from "@/features/posts/components/post-list"
import {
  InfiniteScroll,
  InfiniteScrollTrigger,
} from "@/hooks/use-infinite-scroll"

export const Route = createFileRoute("/_app/home")({
  loader: ({ context }) => {
    void context.queryClient.ensureInfiniteQueryData(
      postQueries.feedInfinite({ itemsPerPage: 20 }),
    )
  },
  component: HomePage,
})

function HomePage() {
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(postQueries.feedInfinite({ itemsPerPage: 20 }))

  const postItems = useMemo(
    () => posts?.pages.flatMap((p) => p.data) ?? [],
    [posts],
  )
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
          <PostList>
            <PostListHeader>
              <CreatePostForm />
            </PostListHeader>
            <PostListContent>
              {postItems.length === 0 ? (
                isLoading ? (
                  <PostListItemSkeleton />
                ) : (
                  <PostListEmpty>
                    There are no posts yet. Follow some users to get started.
                  </PostListEmpty>
                )
              ) : (
                postItems.map((post) => (
                  <PostListItem key={post.id} post={post} />
                ))
              )}
            </PostListContent>
            <InfiniteScrollTrigger />
          </PostList>
        </InfiniteScroll>
      </Wrapper>
    </PageContainer>
  )
}
