import ReactDOM from "react-dom/client"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { QueryClientProvider } from "@tanstack/react-query"

// Import the generated route tree
import { routeTree } from "@/routeTree.gen.ts"
import reportWebVitals from "@/reportWebVitals.ts"

import "@/styles/global.css"
import { AuthProvider, useAuth } from "@/hooks/use-auth"
import { queryClient } from "@/services/api"
import { StrictMode } from "react"

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient, auth: undefined! },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  // defaultStructuralSharing: true,
  // defaultViewTransition: true,
  scrollRestoration: true,
})

// Provide the auth context to the router
function Router() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ queryClient, auth }} />
}

// Wrap the router in all the providers / contexts
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  )
}

// Render the app
const rootElement = document.getElementById("app")
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
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
