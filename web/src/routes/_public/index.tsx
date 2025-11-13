import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowUpRightIcon } from "lucide-react"
import { SiGithub as GithubIcon } from "react-icons/si"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InlineLink } from "@/components/ui/inline-link"
import { PageContainer } from "@/components/ui/page-container"
import { Wrapper } from "@/components/ui/wrapper"
import landingIllustration from "@/features/marketing/assets/landing-illustration.webp"

export const Route = createFileRoute("/_public/")({
  component: LandingPage,
})

function LandingPage() {
  return (
    <>
      <PageContainer className="flex items-center justify-center">
        <Wrapper className="flex flex-col items-center justify-center gap-12 lg:flex-row">
          <div className="grow basis-2/3">
            <Badge className="rounded-full border-none bg-gradient-to-br from-primary via-primary/60 via-70% to-primary py-1">
              v0.1.0
            </Badge>
            <h1 className="mt-6 max-w-2xl text-4xl font-bold sm:text-5xl xl:text-6xl">
              The open-source social network
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground sm:text-xl">
              Share your thoughts, showcase your interests, and connect with
              other users. Build your network while engaging with the community.
              Join thousands of users already sharing their journey.
            </p>
            <div className="mt-12 flex items-center gap-4">
              <Button asChild size="lg" variant="default">
                <Link to="/signup">
                  Get Started <ArrowUpRightIcon className="size-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a
                  href="https://github.com/bastien-pruvost/codifeed"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub <GithubIcon className="size-5" />
                </a>
              </Button>
            </div>
            <div className="mt-6 text-sm">
              Already have an account?{" "}
              <InlineLink asChild>
                <Link to="/login">Log in</Link>
              </InlineLink>
            </div>
          </div>
          <img
            className="w-xs dark-filter sm:w-sm xl:w-md"
            src={landingIllustration}
            alt="Réseau social pour développeurs"
          />
        </Wrapper>
      </PageContainer>
    </>
  )
}
