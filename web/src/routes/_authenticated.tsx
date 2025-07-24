import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    console.log("_authenticated beforeLoad")
    if (!context.auth.user) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      })
    }

    // return { auth: { isAuthenticated: true, user } }
  },
})
