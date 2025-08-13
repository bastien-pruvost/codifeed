import { Link } from "@tanstack/react-router"
import { ArrowUpRightIcon } from "lucide-react"
import { SiGithub } from "react-icons/si"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page-container"
import { Wrapper } from "@/components/ui/wrapper"
import landingIllustration from "@/features/marketing/assets/landing-illustration.webp"

export function LandingPage() {
  return (
    <>
      {/* <LandingPageBackground /> */}

      <PageContainer className="z-10 flex items-center justify-center">
        <Wrapper className="flex flex-col items-center justify-center gap-12 lg:flex-row">
          <div className="grow basis-2/3">
            <Badge className="rounded-full border-none bg-gradient-to-br from-primary via-primary/60 via-70% to-primary py-1">
              v0.1.0 - Work in progress
            </Badge>
            <h1 className="mt-6 max-w-2xl text-4xl font-bold sm:text-5xl xl:text-6xl">
              The social network for developers
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground sm:text-xl">
              Share your code, showcase your projects, and connect with other
              developers. Build your professional network while learning from
              the community. Join thousands of engineers already sharing their
              journey.
            </p>
            <div className="mt-12 flex items-center gap-4">
              <Button asChild size="lg" variant="default">
                <Link to="/signup">
                  Get Started <ArrowUpRightIcon className="size-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a
                  href="https://github.com/codifeed/codifeed"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub <SiGithub className="size-5" />
                </a>
              </Button>
            </div>
            <div className="mt-6 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Log in
              </Link>
            </div>
          </div>
          <img
            className="w-xs sm:w-sm xl:w-md"
            src={landingIllustration}
            alt="Réseau social pour développeurs"
          />
        </Wrapper>
      </PageContainer>
    </>
  )
}
