import { createFileRoute } from "@tanstack/react-router"
import { postsQueryOptions } from "@/services/api/post"
import { useSuspenseQuery } from "@tanstack/react-query"

export const Route = createFileRoute("/")({
  component: App,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(postsQueryOptions),
})

function App() {
  const postsQuery = useSuspenseQuery(postsQueryOptions)
  const posts = postsQuery.data

  console.log({ posts })

  return <div className="text-center">Hello from home.</div>
}
