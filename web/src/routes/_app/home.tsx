import { createFileRoute } from "@tanstack/react-router"

import type { PostPublic } from "@/types/generated/api.gen"
import { PageContainer } from "@/components/ui/page-container"
import { Wrapper } from "@/components/ui/wrapper"
import { CreatePostForm } from "@/features/posts/components/create-post-form"
import {
  PostList,
  PostListContent,
  PostListEmpty,
  PostListHeader,
} from "@/features/posts/components/post-list"

export const Route = createFileRoute("/_app/home")({
  component: HomePage,
})

function HomePage() {
  const postItems = [] satisfies PostPublic[]
  return (
    <PageContainer>
      <Wrapper>
        <PostList>
          <PostListHeader>
            <CreatePostForm />
          </PostListHeader>
          <PostListContent>
            {/* {postItems.map((post) => (
              <PostListItem key={post.id} post={post} />
            ))} */}
            {postItems.length === 0 && (
              <PostListEmpty>
                There are no posts yet. Follow some users to get started.
              </PostListEmpty>
            )}
          </PostListContent>
        </PostList>
      </Wrapper>
    </PageContainer>
  )
}
