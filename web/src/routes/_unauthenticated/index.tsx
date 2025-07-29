import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_unauthenticated/")({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <h1>Landing page</h1>
    </div>
  )
}
