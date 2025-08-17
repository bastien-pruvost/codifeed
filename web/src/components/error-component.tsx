import type { ErrorComponentProps as TanstackErrorComponentProps } from "@tanstack/react-router"
import { useQueryErrorResetBoundary } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useEffect } from "react"

import errorImg from "@/assets/images/error.webp"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page-container"
import { Wrapper } from "@/components/ui/wrapper"
import { getErrorMessage } from "@/utils/errors"

interface ErrorComponentProps extends TanstackErrorComponentProps {
  notFound?: boolean
}

export function ErrorComponent({
  error,
  notFound = false,
}: ErrorComponentProps) {
  const router = useRouter()
  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  useEffect(() => {
    queryErrorResetBoundary.reset()
  }, [queryErrorResetBoundary])
  const message = getErrorMessage(error)

  return (
    <PageContainer>
      <Wrapper className="flex flex-col items-center justify-center gap-4 text-center">
        <img
          src={errorImg}
          alt="Robot error"
          className="aspect-square w-full max-w-64 object-contain"
        />
        <h1 className="text-2xl font-bold">
          {notFound ? "This page does not exist" : "Something went wrong"}
        </h1>
        <p className="text-muted-foreground">{message}</p>
        <Button
          onClick={() => {
            void router.invalidate()
          }}
        >
          Try again
        </Button>
      </Wrapper>
    </PageContainer>
  )
}
