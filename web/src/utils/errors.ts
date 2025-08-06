import type { ErrorResponse } from "@/types/generated/api.gen"

// Define possible API error response types
export type ApiErrorData = ErrorResponse | string | null

// Custom API Error class with proper typing
export class ApiError extends Error {
  public readonly response: Response
  public readonly data: ApiErrorData
  public readonly status: number
  public readonly url: string

  constructor(message: string, response: Response, data: ApiErrorData) {
    super(message)
    this.name = "ApiError"
    this.response = response
    this.data = data
    this.status = response.status
    this.url = response.url

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }

  // Helper method to get a user-friendly error message
  getUserMessage(): string {
    if (!this.data) {
      return this.getDefaultMessage()
    }

    // Handle responses with a message field
    if (
      typeof this.data === "object" &&
      "message" in this.data &&
      this.data.message
    ) {
      return this.data.message
    }

    // Handle plain text responses
    if (typeof this.data === "string") {
      return this.data
    }

    return this.getDefaultMessage()
  }

  private getDefaultMessage(): string {
    switch (this.status) {
      case 400:
        return "Bad request"
      case 401:
        return "You are not authenticated"
      case 403:
        return "You don't have permission for this action"
      case 404:
        return "Resource not found"
      case 409:
        return "Resource already exists"
      case 422:
        return "Validation error"
      case 429:
        return "Too many requests. Please try again later"
      case 500:
        return "Internal server error. Please try again"
      case 502:
        return "Service temporarily unavailable"
      case 503:
        return "Service temporarily unavailable"
      default:
        return `Request failed with status ${this.status}`
    }
  }

  // // Helper method to check if this is a validation error
  // isValidationError(): boolean {
  //   return this.status === 422
  // }

  // // Helper method to get validation errors if available
  // getValidationErrors(): ValidationErrorModel[] {
  //   if (this.isValidationError() && Array.isArray(this.data)) {
  //     return this.data
  //   }
  //   return []
  // }
}

// Helper function to extract meaningful error messages with type safety
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.getUserMessage()
  }
  if (isNetworkError(error)) {
    return "Network error. Please check your connection"
  }
  if (error instanceof Error) {
    return error.message
  }

  // Fallback for unknown error types
  return "An unexpected error occurred"
}

export function isNetworkError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message?.includes("fetch") ||
      error.name === "NetworkError" ||
      !navigator.onLine)
  )
}
