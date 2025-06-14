import { createFileRoute } from "@tanstack/react-router"
// import { postsQueryOptions } from "@/services/api/post"
import { useAuth } from "@/hooks/use-auth"
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

  const authFromContext = useAuth()

  const auth = authFromContext
  console.log({ posts })
  console.log(document.location)

  return (
    <div className="text-center">
      <p>{auth.isAuthenticated ? "Authenticated" : "Not Authenticated"}</p>
      <p>
        {auth.user
          ? `Welcome ${auth.user.firstname} ${auth.user.lastname}`
          : "No user"}
      </p>
    </div>
  )
}
