export const authKeys = {
  all: ["auth"] as const,
  currentUser: (options?: { forceEnabled?: boolean }) =>
    [...authKeys.all, "currentUser", { options }] as const,
} as const
