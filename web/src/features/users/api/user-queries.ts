import { keepPreviousData, queryOptions } from "@tanstack/react-query"

import {
  setShouldBeAuthenticated,
  shouldBeAuthenticated,
} from "@/features/auth/services/auth-flag-storage"
import { api, getData } from "@/services/http-client"

export const userQueries = {
  all: () => ["users"],

  lists: () => [...userQueries.all(), "list"],
  list: (filters: string) =>
    queryOptions({
      queryKey: [...userQueries.lists(), { filters }],
      queryFn: () => getUserList(filters),
    }),
  listBySearch: (q: string, page = 1, itemsPerPage = 5) =>
    queryOptions({
      queryKey: [...userQueries.lists(), "search", { q, page, itemsPerPage }],
      // Ensure in-flight requests are cancelled when the key changes
      queryFn: ({ signal }) =>
        getUserListBySearch(q, page, itemsPerPage, signal),
      enabled: Boolean(q && q.trim().length > 0),
      staleTime: 1000 * 30, // 30 seconds
      placeholderData: keepPreviousData,
    }),

  details: () => [...userQueries.all(), "profile"],
  detail: (username: string) =>
    queryOptions({
      queryKey: [...userQueries.details(), username],
      queryFn: () => getUserDetail(username),
    }),

  currentUser: () =>
    queryOptions({
      queryKey: [...userQueries.all(), "currentUser"],
      queryFn: () => getCurrentUser(),
      enabled: shouldBeAuthenticated(),
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchInterval: 1000 * 60 * 5, // 5 minutes - periodic check for long sessions
    }),
}

function getUserList(_filters: string) {
  return null
}

function getUserListBySearch(
  q: string,
  page: number,
  itemsPerPage: number,
  signal?: AbortSignal,
) {
  return getData(
    api.GET("/users/search", {
      params: {
        query: {
          q,
          page,
          itemsPerPage,
        },
      },
      signal,
    }),
  )
}

function getUserDetail(username: string) {
  return getData(
    api.GET("/users/{username}", { params: { path: { username } } }),
  )
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
