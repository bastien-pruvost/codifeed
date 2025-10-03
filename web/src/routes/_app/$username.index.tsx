import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { CalendarIcon, LinkIcon, MapPinIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { InlineLink } from "@/components/ui/inline-link"
import { PageContainer } from "@/components/ui/page-container"
import { P } from "@/components/ui/typography"
import { Wrapper } from "@/components/ui/wrapper"
import { userQueries } from "@/features/users/api/user-queries"
import { FollowButton } from "@/features/users/components/follow-button"
import { UserAvatar } from "@/features/users/components/user-avatar"
import { Route as AppRoute } from "@/routes/_app"

export const Route = createFileRoute("/_app/$username/")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      userQueries.detail(params.username),
    )
  },
  component: UserProfilePage,
})

function UserProfilePage() {
  const username = Route.useParams({ select: (params) => params.username })
  const { data: user } = useSuspenseQuery(userQueries.detail(username))
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
            <div className="flex items-center gap-4">
              <UserAvatar user={user} className="size-12 shrink md:size-20" />

              <div className="flex-1">
                <CardTitle className="text-xl leading-tight sm:text-2xl">
                  {user.name}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  @{user.username}
                </CardDescription>
              </div>
            </div>

            <div className="sm:col-span-2">
              {user.profile.bio ? (
                <P className="text-base">{user.profile.bio}</P>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
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

              <div className="mt-4 flex items-center gap-6 text-sm">
                <InlineLink asChild className="text-foreground">
                  <Link
                    to="/$username/following"
                    params={{ username: user.username }}
                  >
                    <div>
                      <span className="font-medium">{user.followingCount}</span>{" "}
                      <span className="text-muted-foreground">Following</span>
                    </div>
                  </Link>
                </InlineLink>

                <InlineLink asChild className="text-foreground">
                  <Link
                    to="/$username/followers"
                    params={{ username: user.username }}
                  >
                    <div>
                      <span className="font-medium">{user.followersCount}</span>{" "}
                      <span className="text-muted-foreground">Followers</span>
                    </div>
                  </Link>
                </InlineLink>
              </div>
            </div>

            {isOwnProfile ? (
              <Button variant="outline" size="sm">
                Edit profile
              </Button>
            ) : (
              <FollowButton user={user} />
            )}
          </CardContent>
        </Card>
      </Wrapper>
    </PageContainer>
  )
}
