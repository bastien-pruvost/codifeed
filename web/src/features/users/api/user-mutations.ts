import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { userQueries } from "@/features/users/api/user-queries"
import { api, getData } from "@/services/http-client"

export function useFollowUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (username: string) =>
      getData(
        api.POST("/users/{username}/follow", {
          params: { path: { username } },
        }),
      ),
    onSuccess: (user) => {
      toast.success(`You are now following @${user.username} !`)
    },
    // Optimistic update
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

      return { prev }
    },
    onError: (_err, username, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(
          userQueries.detail(username).queryKey,
          ctx.prev,
        )
      }
    },
    onSettled: async (_data, _error) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: userQueries.details(),
        }),
        queryClient.invalidateQueries({
          queryKey: userQueries.lists(),
        }),
      ])
    },
  })
}

export function useUnfollowUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["user", "unfollow"],
    mutationFn: (username: string) =>
      getData(
        api.DELETE("/users/{username}/follow", {
          params: { path: { username } },
        }),
      ),
    onSuccess: (user) => {
      toast.success(`You don't follow @${user.username} anymore!`)
    },
    // Optimistic update
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
          isFollowing: false,
          followersCount: Math.max(0, prev.followersCount - 1),
        })
      }

      return { prev }
    },
    onError: (_err, username, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(
          userQueries.detail(username).queryKey,
          ctx.prev,
        )
      }
    },
    onSettled: async (_data, _error) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: userQueries.details(),
        }),
        queryClient.invalidateQueries({
          queryKey: userQueries.lists(),
        }),
      ])
    },
  })
}
