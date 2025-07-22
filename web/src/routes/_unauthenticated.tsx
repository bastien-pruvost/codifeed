import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_unauthenticated")({
  beforeLoad: async ({ context }) => {
    if (context.auth.user) {
      throw redirect({
        to: "/home",
      })
    }
  },
})
