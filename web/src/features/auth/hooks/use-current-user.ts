// import {
//   useLocation,
//   useNavigate,
//   useParentMatches,
//   useRouteContext,
//   useRouter,
// } from "@tanstack/react-router"

// export function useCurrentUser() {
//   const router = useRouter()

//   const location = useLocation()
//   const user = useRouteContext({
//     from: "__root__",
//     select: (context) => context.user,
//   })

//   // if (!user) {
//   //   router.history.push("/login", {
//   //     search: { redirect: location.href },
//   //   })
//   //   return null
//   // }

//   return user
// }
