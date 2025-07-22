import { QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import ReactDOM from "react-dom/client"

// Import the generated route tree
import reportWebVitals from "@/reportWebVitals.ts"
import { routeTree } from "@/routeTree.gen.ts"

import { AuthProvider, useAuth } from "@/hooks/use-auth"
import { queryClient } from "@/services/api"
import "@/styles/global.css"
import { Spinner } from "@/components/ui/spinner"
import { Suspense } from "react"

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient, auth: undefined! },
  defaultPreload: false, // TODO: change to "intent" in production
  defaultPreloadStaleTime: 0,
  // defaultStructuralSharing: true,
  // defaultViewTransition: true,
  scrollRestoration: true,
})

// Render the app
const rootElement = document.getElementById("app")
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    // <StrictMode>
    <App />,
    // </StrictMode>,
  )
}

// Wrap the router in all the providers / contexts
function App() {
  console.log("App load")
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner className="size-8" />
        </div>
      }
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </QueryClientProvider>
    </Suspense>
  )
}

// Provide the auth context to the router
function Router() {
  console.log("Router load")
  const auth = useAuth()
  return <RouterProvider router={router} context={{ queryClient, auth }} />
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
