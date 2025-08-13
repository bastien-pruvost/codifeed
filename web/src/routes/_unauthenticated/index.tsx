import { createFileRoute } from "@tanstack/react-router"

import { LandingPage } from "@/features/marketing/pages/landing-page"

export const Route = createFileRoute("/_unauthenticated/")({
  component: LandingPage,
})
