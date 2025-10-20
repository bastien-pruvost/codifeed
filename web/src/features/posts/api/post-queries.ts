import { infiniteQueryOptions } from "@tanstack/react-query"

import { api, getData } from "@/services/http-client"

export const postQueries = {
  // All
  all: () => ["posts"],

  // Lists
  lists: () => [...postQueries.all(), "lists"],

  // User
  byUser: (username: string) => [...postQueries.lists(), "user", username],

  byUserInfinite: ({
    username,
    itemsPerPage,
  }: {
    username: string
    itemsPerPage: number
  }) =>
    infiniteQueryOptions({
      queryKey: [...postQueries.byUser(username), "infinite", itemsPerPage],
      queryFn: ({ pageParam }) =>
        getUserPosts({ username, itemsPerPage, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.meta.hasMore ? allPages.length + 1 : undefined,
      staleTime: 1000 * 60 * 2, // 2 minute
    }),

  // Feed
  feed: () => [...postQueries.lists(), "feed"],

  feedInfinite: ({ itemsPerPage }: { itemsPerPage: number }) =>
    infiniteQueryOptions({
      queryKey: [...postQueries.feed(), "infinite", itemsPerPage],
      queryFn: ({ pageParam }) =>
        getFeedPosts({ itemsPerPage, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.meta.hasMore ? allPages.length + 1 : undefined,
      staleTime: 1000 * 60 * 2, // 2 minute
    }),
}

interface GetUserPostsOptions {
  username: string
  page: number
  itemsPerPage: number
}

function getUserPosts({ username, page, itemsPerPage }: GetUserPostsOptions) {
  return getData(
    api.GET("/posts/user/{username}", {
      params: { path: { username }, query: { page, itemsPerPage } },
    }),
  )
}

interface GetFeedPostsOptions {
  page: number
  itemsPerPage: number
}

function getFeedPosts({ page, itemsPerPage }: GetFeedPostsOptions) {
  return getData(
    api.GET("/posts/feed", { params: { query: { page, itemsPerPage } } }),
  )
}
