import type { Middleware } from "openapi-fetch"
import createFetchClient from "openapi-fetch"

import type { paths } from "@/types/generated/api.gen"
import type { ApiErrorData } from "@/utils/errors"
import { setShouldBeAuthenticated } from "@/features/auth/services/auth-flag-storage"
import { getCookie } from "@/utils/cookies"
import { ApiError } from "@/utils/errors"

const api = createFetchClient<paths>({
  baseUrl: String(import.meta.env.VITE_API_URL),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  credentials: "include",
})

const addCsrfTokenMiddleware: Middleware = {
  onRequest({ request }) {
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

      const contentType = response.headers.get("content-type")

      try {
        if (contentType?.includes("application/json")) {
          responseData = (await response.json()) as ApiErrorData
        } else {
          responseData = await response.text()
        }
      } catch {
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

function refreshToken() {
  return api.POST("/auth/refresh")
}

let refreshPromise: ReturnType<typeof refreshToken> | null = null

const refreshTokenMiddleware: Middleware = {
  async onResponse({ request, response }) {
    if (response.status !== 401) {
      return response
    }

    // Don't retry refresh endpoint itself to avoid infinite loops
    if (request.url.includes("/auth/refresh")) {
      setShouldBeAuthenticated(false)
      return response
    }

    try {
      // Deduplicate refresh requests
      if (!refreshPromise) {
        refreshPromise = refreshToken()
          .then((res) => {
            refreshPromise = null
            return res
          })
          .catch((err) => {
            refreshPromise = null
            throw err
          })
      }

      const refreshResponse = await refreshPromise

      if (refreshResponse.response.ok) {
        // Token refreshed successfully, retry original request
        const clonedRequest = request.clone()

        // Update CSRF token for the retry
        clonedRequest.headers.set(
          "X-CSRF-TOKEN",
          getCookie("csrf_access_token") ?? "",
        )

        // Retry the original request
        return fetch(clonedRequest)
      } else {
        // Token refresh failed, throw error to logout user
        throw new Error("Refresh failed")
      }
    } catch (error) {
      console.error("Token refresh failed", error)
      // Token refresh failed, logout user
      await api.POST("/auth/logout").catch((error) => {
        console.error("Logout failed", error)
      })
      setShouldBeAuthenticated(false)
      return response
    }
  },
}

// The order in which middleware are registered matters.
// For requests, onRequest() will be called in the order registered.
// For responses, onResponse() will be called in reverse order.
// That way the first middleware gets the first “dibs” on requests,
// and the final control over the end response.
api.use(addCsrfTokenMiddleware)
api.use(errorMiddleware)
api.use(refreshTokenMiddleware)

// Utility function to handle API response with proper error checking and type safety
function getData<T>(response: {
  data?: T
  error?: ApiErrorData
  response: Response
}): T {
  if (response.error) {
    throw new ApiError(
      `API request failed: ${response.response.status} ${response.response.statusText}`,
      response.response,
      response.error,
    )
  }

  if (response.data === undefined) {
    throw new ApiError(
      `API request succeeded but returned no data: ${response.response.status} ${response.response.statusText}`,
      response.response,
      null,
    )
  }

  return response.data
}

export { api, getData }
