import { authUserQueryOptions } from "@/services/api/auth"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    // Ensure user data is loaded before checking authentication
    const user = await context.queryClient.ensureQueryData(
      authUserQueryOptions(),
    )

    if (!user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      })
    }
    // return { ...context, auth: { ...context.auth, user } }
  },
})
