import { createFileRoute } from "@tanstack/react-router"
import { postsQueryOptions } from "@/services/api/post"

export const Route = createFileRoute("/_unauthenticated/")({
  component: App,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(postsQueryOptions),
})

function App() {
  return (
    <div className="text-center">
      <h1>Landing page</h1>
    </div>
  )
}
