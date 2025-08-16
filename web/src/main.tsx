import type { QueryClient } from "@tanstack/react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import {
  createRouter,
  ErrorComponent,
  RouterProvider,
} from "@tanstack/react-router"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { Spinner } from "@/components/ui/spinner"
import { reportWebVitals } from "@/reportWebVitals"
import { routeTree } from "@/routeTree.gen"
import { queryClient } from "@/services/query-client"

import "@/styles/global.css"

import { ThemeProvider } from "@/hooks/use-theme"

export interface RouterContext {
  queryClient: QueryClient
}

const defaultRouterContext: RouterContext = {
  queryClient,
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

// Wrap the Router with all providers
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

// Render the app
const rootElement = document.getElementById("app")
if (rootElement && !rootElement.innerHTML) {
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
  .then(() => {
    console.info("Web vitals reported")
  })
  .catch((error) => {
    console.error("Error reporting web vitals", error)
  })

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
