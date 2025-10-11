import type { ComponentProps } from "react"
import { useClickOutside, useDebouncedValue } from "@mantine/hooks"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Spinner } from "@/components/ui/spinner"
import { userQueries } from "@/features/users/api/user-queries"
import { UserAvatar } from "@/features/users/components/user-avatar"
import { cn } from "@/utils/classnames"

export function SearchBar({
  className,
  ...props
}: ComponentProps<typeof Command>) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [searchValue] = useDebouncedValue(inputValue, 300)
  const isDebouncing = inputValue !== searchValue

  function handleClickOutside() {
    setOpen(false)
    setInputValue("")
  }

  const containerRef = useClickOutside(handleClickOutside)

  const { data: searchResults, isFetching } = useQuery(
    userQueries.search({ q: searchValue, page: 1, itemsPerPage: 10 }),
  )

  const users = searchResults?.data ?? []

  const handleValueChange = (value: string) => {
    setInputValue(value)
    setOpen(!!value.trim())
  }

  return (
    <div className={cn("relative h-9 overflow-visible", className)}>
      <Command
        shouldFilter={false}
        className="absolute inset-x-0 top-0 h-auto rounded-lg border shadow-xs"
        ref={containerRef}
        {...props}
      >
        <CommandInput
          placeholder="Search..."
          value={inputValue}
          onValueChange={handleValueChange}
          onFocus={() => setOpen(!!inputValue.trim())}
        />
        {open && (
          <CommandList>
            <CommandGroup
              heading={
                <div className="flex items-center">
                  Users{" "}
                  {(isFetching || isDebouncing) && users.length > 0 ? (
                    <Spinner className="ml-2 size-4" />
                  ) : null}
                </div>
              }
            >
              {(isFetching || isDebouncing) && users.length === 0 ? (
                <CommandItem value="loading">
                  <Spinner className="mr-2 size-4" /> Searching…
                </CommandItem>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <CommandItem
                    key={user.username}
                    onSelect={() => {
                      void navigate({
                        to: "/$username",
                        params: { username: user.username },
                      })
                      setOpen(false)
                      setInputValue("")
                    }}
                  >
                    <UserAvatar user={user} />
                    {user.name}
                  </CommandItem>
                ))
              ) : (
                <CommandEmpty>No users found</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  )
}
