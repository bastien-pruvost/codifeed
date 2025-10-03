import {
  infiniteQueryOptions,
  keepPreviousData,
  queryOptions,
} from "@tanstack/react-query"

import {
  setShouldBeAuthenticated,
  shouldBeAuthenticated,
} from "@/features/auth/services/auth-flag-storage"
import { api, getData } from "@/services/http-client"

export const userQueries = {
  // All
  all: () => ["users"],

  // Current
  currentUser: () =>
    queryOptions({
      queryKey: [...userQueries.all(), "current"],
      queryFn: () => getCurrentUser(),
      enabled: shouldBeAuthenticated(),
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchInterval: 1000 * 60 * 5, // 5 minutes - periodic check for long sessions
    }),

  // Lists
  lists: () => [...userQueries.all(), "lists"],

  search: ({
    q,
    page,
    itemsPerPage,
  }: {
    q: string
    page: number
    itemsPerPage: number
  }) =>
    queryOptions({
      queryKey: [...userQueries.lists(), "search", q, page, itemsPerPage],
      queryFn: ({ signal }) => searchUsers({ q, page, itemsPerPage, signal }),
      enabled: q.trim().length > 0,
      staleTime: 1000 * 30, // 30 seconds
      placeholderData: keepPreviousData,
    }),

  followers: (username: string) => [
    ...userQueries.lists(),
    "followers",
    username,
  ],

  followersInfinite: ({
    username,
    itemsPerPage,
  }: {
    username: string
    itemsPerPage: number
  }) =>
    infiniteQueryOptions({
      queryKey: [...userQueries.followers(username), "infinite", itemsPerPage],
      queryFn: ({ pageParam }) =>
        getUserFollowers({ username, itemsPerPage, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.meta.hasMore ? allPages.length + 1 : undefined,
      staleTime: 1000 * 60 * 2, // 2 minute
    }),

  following: (username: string) => [
    ...userQueries.lists(),
    "following",
    username,
  ],

  followingInfinite: ({
    username,
    itemsPerPage,
  }: {
    username: string
    itemsPerPage: number
  }) =>
    infiniteQueryOptions({
      queryKey: [...userQueries.following(username), "infinite", itemsPerPage],
      queryFn: ({ pageParam }) =>
        getUserFollowing({ username, itemsPerPage, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.meta.hasMore ? allPages.length + 1 : undefined,
      staleTime: 1000 * 60 * 2, // 2 minute
    }),

  // Details
  details: () => [...userQueries.all(), "detail"],

  detail: (username: string) =>
    queryOptions({
      queryKey: [...userQueries.details(), username],
      queryFn: () => getUserDetail({ username }),
      staleTime: 1000 * 60 * 2, // 2 minute
    }),
}

function getCurrentUser() {
  if (!shouldBeAuthenticated()) {
    return null
  }
  return getData(
    api.GET("/users/me", {}).catch((error) => {
      setShouldBeAuthenticated(false)
      throw error
    }),
  )
}

type SearchUsersOptions = {
  q: string
  page: number
  itemsPerPage: number
  signal: AbortSignal
}

function searchUsers({ q, page, itemsPerPage, signal }: SearchUsersOptions) {
  return getData(
    api.GET("/users/search", {
      params: { query: { q, page, itemsPerPage } },
      signal,
    }),
  )
}

type GetUserFollowersOptions = {
  username: string
  page: number
  itemsPerPage: number
}

function getUserFollowers({
  username,
  page,
  itemsPerPage,
}: GetUserFollowersOptions) {
  return getData(
    api.GET("/users/{username}/followers", {
      params: { path: { username }, query: { page, itemsPerPage } },
    }),
  )
}

type GetUserFollowingOptions = {
  username: string
  page: number
  itemsPerPage: number
}

function getUserFollowing({
  username,
  page,
  itemsPerPage,
}: GetUserFollowingOptions) {
  return getData(
    api.GET("/users/{username}/following", {
      params: { path: { username }, query: { page, itemsPerPage } },
    }),
  )
}

type GetUserDetailOptions = {
  username: string
}

function getUserDetail({ username }: GetUserDetailOptions) {
  return getData(
    api.GET("/users/{username}", { params: { path: { username } } }),
  )
}
