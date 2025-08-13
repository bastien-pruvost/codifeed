export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  profiles: () => [...userKeys.all, "profile"] as const,
  profile: (username: string) => [...userKeys.profiles(), username] as const,
} as const
