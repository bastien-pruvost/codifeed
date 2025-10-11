import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  formatDistanceToNow,
} from "date-fns"
import { useEffect, useState } from "react"

export function useRelativeTimeText(time: string) {
  const [relativeTime, setRelativeTime] = useState(() =>
    getRelativeTimeText(time),
  )

  useEffect(() => {
    const optimizedDelay = getOptimizedDelay(time)

    const interval = setInterval(() => {
      const newRelativeTime = getRelativeTimeText(time)
      setRelativeTime(newRelativeTime)
    }, optimizedDelay)

    return () => clearInterval(interval)
  }, [time])

  return relativeTime
}

function getRelativeTimeText(time: string) {
  return formatDistanceToNow(new Date(time), {
    addSuffix: true,
    includeSeconds: true,
  })
}

function getOptimizedDelay(timestamp: string) {
  const now = new Date()
  const postTime = new Date(timestamp)

  const minutesAgo = differenceInMinutes(now, postTime)
  const hoursAgo = differenceInHours(now, postTime)
  const daysAgo = differenceInDays(now, postTime)

  if (minutesAgo < 1) return 3 * 1000 // 3 seconds for less than 1 minute
  if (minutesAgo < 5) return 30 * 1000 // 30 seconds for less than 5 minutes
  if (minutesAgo < 60) return 60 * 1000 // 1 minute for less than 1 hour
  if (hoursAgo < 24) return 30 * 60 * 1000 // 30 minutes for less than 1 day
  if (daysAgo < 7) return 60 * 60 * 1000 // 1 hour for less than 1 week
  return 60 * 60 * 1000 // 1 hour for older posts
}
