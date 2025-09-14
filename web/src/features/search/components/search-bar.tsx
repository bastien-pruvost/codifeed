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

  const { data, isFetching } = useQuery(
    userQueries.listBySearch(searchValue, 1, 10),
  )

  const users = data?.data ?? []

  const handleValueChange = (value: string) => {
    setInputValue(value)
    setOpen(!!value.trim())
  }

  return (
    <Command
      shouldFilter={false}
      className={cn("rounded-lg border shadow-xs", className)}
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
  )

  // return (
  //   <form {...props}>
  //     <div className="relative">
  //       <Label htmlFor="search" className="sr-only">
  //         Search
  //       </Label>
  //       <Input id="search" placeholder="Search..." className="pl-8" />
  //       <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
  //     </div>
  //   </form>
  // )
}
