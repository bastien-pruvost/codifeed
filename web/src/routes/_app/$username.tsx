import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { CalendarIcon, LinkIcon, MapPinIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { InlineLink } from "@/components/ui/inline-link"
import { PageContainer } from "@/components/ui/page-container"
import { P } from "@/components/ui/typography"
import { Wrapper } from "@/components/ui/wrapper"
import { userProfileQueryOptions } from "@/features/users/api/user-profile-query"
import { getUserInitials } from "@/features/users/utils"
import { Route as AppRoute } from "@/routes/_app"

export const Route = createFileRoute("/_app/$username")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      userProfileQueryOptions(params.username),
    )
  },
  component: UserProfilePage,
})

export function UserProfilePage() {
  const username = Route.useParams({ select: (params) => params.username })
  const { data: user } = useSuspenseQuery(userProfileQueryOptions(username))
  const { user: currentUser } = AppRoute.useRouteContext()

  const isOwnProfile = currentUser.id === user.id

  const formattedBirthdate = user.profile.birthdate
    ? new Date(user.profile.birthdate).toLocaleDateString()
    : ""

  const ensureProtocol = (url: string) =>
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`

  return (
    <PageContainer>
      <Wrapper>
        <Card>
          <CardContent className="grid grid-cols-1 items-center gap-4 sm:grid-flow-col sm:grid-cols-[1fr_auto] sm:grid-rows-[auto_auto]">
            <div className="flex items-center gap-4 sm:gap-8">
              <Avatar className="size-12 shrink md:size-20">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : null}
                <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <CardTitle className="text-xl leading-tight sm:text-2xl">
                  {user.name}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  @{user.username}
                </CardDescription>
              </div>
            </div>

            <div>
              {user.profile.bio ? (
                <P className="text-base">{user.profile.bio}</P>
              ) : null}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {user.profile.location ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPinIcon className="size-4" />
                    <span>{user.profile.location}</span>
                  </span>
                ) : null}

                {user.profile.website ? (
                  <span className="inline-flex items-center gap-1.5">
                    <LinkIcon className="size-4" />
                    <InlineLink
                      href={ensureProtocol(user.profile.website)}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {user.profile.website}
                    </InlineLink>
                  </span>
                ) : null}

                {formattedBirthdate ? (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarIcon className="size-4" />
                    <span>Born {formattedBirthdate}</span>
                  </span>
                ) : null}
              </div>
            </div>

            {isOwnProfile ? (
              <Button variant="outline" size="sm">
                Edit profile
              </Button>
            ) : (
              <Button size="sm">Follow</Button>
            )}
          </CardContent>
        </Card>
      </Wrapper>
    </PageContainer>
  )
}
