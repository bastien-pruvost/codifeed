import type { Middleware } from "openapi-fetch"
import createFetchClient from "openapi-fetch"

import type { paths } from "@/types/generated/api.gen"

// import type { Middleware } from "openapi-fetch"

function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  console.log(parts)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
  return null
}

export const api = createFetchClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  credentials: "include",
})

const addCsrfTokenMiddleware: Middleware = {
  // If refresh route add csrf_refresh_token else add csrf_access_token
  async onRequest({ request }) {
    if (request.url.includes("/auth/refresh")) {
      request.headers.set("X-CSRF-TOKEN", getCookie("csrf_refresh_token") ?? "")
    } else {
      request.headers.set("X-CSRF-TOKEN", getCookie("csrf_access_token") ?? "")
    }
  },
}

// const errorMiddleware: Middleware = {
//   async onResponse({ response }) {
//     if (!response.ok) {
//       throw new Error(
//         `${response.url}: ${response.status} ${response.statusText}`,
//       )
//     }
//   },
// }

api.use(addCsrfTokenMiddleware)
// api.use(errorMiddleware)
