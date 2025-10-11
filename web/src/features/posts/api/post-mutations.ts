import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { PostCreate } from "@/types/generated/api.gen"
import { postQueries } from "@/features/posts/api/post-queries"
import { api, getData } from "@/services/http-client"
import { getErrorMessage } from "@/utils/errors"

export function useCreatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (post: PostCreate) =>
      getData(api.POST("/posts", { body: post })),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postQueries.lists() })
      toast.success("Post created successfully!")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
