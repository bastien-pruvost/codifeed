import type { ReactNode } from "react"
import { useIntersection } from "@mantine/hooks"
import { createContext, useContext, useEffect } from "react"

import { Spinner } from "@/components/ui/spinner"

interface InfiniteQueryOptions {
  fetchNextPage: () => Promise<unknown> | void
  hasNextPage: boolean
  isFetchingNextPage: boolean
}

interface InfiniteScrollContextValue extends InfiniteQueryOptions {
  entry: IntersectionObserverEntry | null
  observerRef: (element: HTMLElement | null) => void
}

interface InfiniteScrollProviderProps extends InfiniteQueryOptions {
  options: IntersectionObserverInit
  children: ReactNode
}

const InfiniteScrollContext = createContext<
  InfiniteScrollContextValue | undefined
>(undefined)

export function InfiniteScroll({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  options,
  children,
}: InfiniteScrollProviderProps) {
  const { ref: observerRef, entry } = useIntersection(options)

  return (
    <InfiniteScrollContext
      value={{
        entry,
        observerRef,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
      }}
    >
      {children}
    </InfiniteScrollContext>
  )
}

export function useInfiniteScroll() {
  const context = useContext(InfiniteScrollContext)

  if (!context) {
    throw new Error("useInfiniteScroll must be used within an InfiniteScroll")
  }

  return context
}

export function InfiniteScrollTrigger() {
  const { fetchNextPage, hasNextPage, isFetchingNextPage, entry, observerRef } =
    useInfiniteScroll()

  useEffect(() => {
    if (hasNextPage && entry?.isIntersecting && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage])

  return isFetchingNextPage ? (
    <Spinner className="mx-auto my-8" />
  ) : hasNextPage ? (
    <div ref={observerRef} className="h-4" />
  ) : null
}
