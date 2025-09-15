import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { components } from "@/types/generated/api.gen"
import { userQueries } from "@/features/users/api/user-queries"
import { api, getData } from "@/services/http-client"

export function useFollowUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (username: string) =>
      getData(
        api.POST("/users/{username}/follow", {
          params: { path: { username } },
        }),
      ),

    // Optimistic update of the user detail
    onMutate: async (username) => {
      await queryClient.cancelQueries({
        queryKey: userQueries.detail(username).queryKey,
      })

      const prev = queryClient.getQueryData(
        userQueries.detail(username).queryKey,
      )

      if (prev) {
        queryClient.setQueryData(userQueries.detail(username).queryKey, {
          ...prev,
          isFollowing: true,
          followersCount: Math.max(0, prev.followersCount + 1),
        })
      }

      return { prev, username }
    },
    onError: (_err, _username, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(
          userQueries.detail(ctx.username).queryKey,
          ctx.prev,
        )
      }
    },
    onSettled: (_data, _error, username) => {
      void queryClient.invalidateQueries({
        queryKey: userQueries.detail(username).queryKey,
      })
      void queryClient.invalidateQueries({
        queryKey: [...userQueries.details(), username, "followers"],
      })
    },
  })
}

export function useUnfollowUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["user", "unfollow"],
    mutationFn: (username: string) =>
      getData(
        api.DELETE("/users/{username}/follow", {
          params: { path: { username } },
        }),
      ),
    onMutate: async (username) => {
      await queryClient.cancelQueries({
        queryKey: userQueries.detail(username).queryKey,
      })

      const prev = queryClient.getQueryData<
        components["schemas"]["UserDetail"]
      >(userQueries.detail(username).queryKey)

      if (prev) {
        queryClient.setQueryData(userQueries.detail(username).queryKey, {
          ...prev,
          isFollowing: false,
          followersCount: Math.max(0, (prev.followersCount ?? 0) - 1),
        })
      }

      return { prev, username }
    },
    onError: (_err, _username, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(
          userQueries.detail(ctx.username).queryKey,
          ctx.prev,
        )
      }
    },
    onSettled: (_data, _error, username) => {
      queryClient.invalidateQueries({
        queryKey: userQueries.detail(username).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: [...userQueries.details(), username, "followers"],
      })
    },
  })
}

// Helper type, derived from current API types environment
// No extra types needed; using generated components["schemas"]["UserDetail"]
