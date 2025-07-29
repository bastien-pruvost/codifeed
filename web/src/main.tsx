import type { QueryClient } from "@tanstack/react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import {
  createRouter,
  ErrorComponent,
  RouterProvider,
} from "@tanstack/react-router"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import type { UserRead } from "@/types/generated/api.gen"
import { reportWebVitals } from "@/reportWebVitals"
import { routeTree } from "@/routeTree.gen"
import { queryClient } from "@/services/query-client"

import "@/styles/global.css"

import { Spinner } from "@/components/ui/spinner"

export interface RouterContext {
  queryClient: QueryClient
  auth: {
    user: UserRead
    isAuthenticated: boolean
  }
}

const defaultRouterContext: RouterContext = {
  queryClient,
  auth: undefined!,
}

// Create a new router instance
const router = createRouter({
  routeTree,
  context: defaultRouterContext,
  defaultPreload: false, // TODO: change to "intent" in production
  defaultPreloadStaleTime: 0,
  // defaultStructuralSharing: true,
  // defaultViewTransition: true,
  scrollRestoration: true,
  defaultPendingComponent: () => (
    <div className={`p-2 text-2xl`}>
      <Spinner />
    </div>
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
})

// Wrap the Router in all the providers / contexts
function App() {
  console.log("App mount")
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

// Render the app
const rootElement = document.getElementById("app")
if (rootElement && !rootElement.innerHTML) {
  console.log("React render app")
  const root = createRoot(rootElement)
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
