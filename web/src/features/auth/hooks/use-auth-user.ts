import { rootRouteId, useRouteContext } from "@tanstack/react-router"

export function useAuthUser() {
  const { auth } = useRouteContext({ from: rootRouteId })
  return auth.user
}
