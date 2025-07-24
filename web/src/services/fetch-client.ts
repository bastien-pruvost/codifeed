// import type { Middleware } from "openapi-fetch"

import createFetchClient from "openapi-fetch"

import type { paths } from "@/types/generated/api.gen"

export const api = createFetchClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  credentials: "include",
})

// const errorMiddleware: Middleware = {
//   async onResponse({ response }) {
//     if (!response.ok) {
//       throw new Error(
//         `${response.url}: ${response.status} ${response.statusText}`,
//       )
//     }
//   },
// }

// api.use(errorMiddleware)
