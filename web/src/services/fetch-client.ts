import type { Middleware } from "openapi-fetch"
import createFetchClient from "openapi-fetch"

import type { paths } from "@/types/generated/api.gen"
import type { ApiErrorData } from "@/utils/errors"
import { getCookie } from "@/utils/cookies"
import { ApiError } from "@/utils/errors"

// import type { Middleware } from "openapi-fetch"

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
    return request
  },
}

const errorMiddleware: Middleware = {
  async onResponse({ response }) {
    if (!response.ok) {
      let responseData: ApiErrorData = null

      // Try to parse response based on content type
      const contentType = response.headers.get("content-type")

      try {
        if (contentType?.includes("application/json")) {
          responseData = await response.json()
        } else {
          responseData = await response.text()
        }
      } catch {
        // If parsing fails, responseData remains null
        responseData = null
      }

      throw new ApiError(
        `API request failed: ${response.status} ${response.statusText}`,
        response,
        responseData,
      )
    }
  },
}

api.use(addCsrfTokenMiddleware)
api.use(errorMiddleware)
