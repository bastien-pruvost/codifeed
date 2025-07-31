export const postsQueryKeys = {
  all: ["posts"] as const,
  lists: () => [...postsQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...postsQueryKeys.lists(), { filters }] as const,
  details: () => [...postsQueryKeys.all, "detail"] as const,
  detail: (id: string | number) => [...postsQueryKeys.details(), id] as const,
} as const
