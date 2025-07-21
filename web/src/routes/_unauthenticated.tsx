import { authUserQueryOptions } from "@/services/api/auth"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_unauthenticated")({
  beforeLoad: async ({ context }) => {
    // Ensure user data is loaded before checking authentication
    const user = await context.queryClient.ensureQueryData(
      authUserQueryOptions(),
    )

    if (user) {
      throw redirect({
        to: "/home",
      })
    }
  },
})
