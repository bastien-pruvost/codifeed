import type { ComponentProps } from "react"
import { Link } from "@tanstack/react-router"
import { useState } from "react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { UserAvatar } from "@/features/users/components/user-avatar"
import { cn } from "@/utils/classnames"

const users = [
  {
    name: "John Doe",
    username: "johndoe",
    avatar: "https://avatar.iran.liara.run/public/1",
  },
  {
    name: "Jane Doe",
    username: "janedoe",
    avatar: "https://avatar.iran.liara.run/public/2",
  },
  {
    name: "Jean Bar",
    username: "jeanbar",
    avatar: "https://avatar.iran.liara.run/public/3",
  },
  {
    name: "Franklin D. Roosevelt",
    username: "franklin",
    avatar: "https://avatar.iran.liara.run/public/4",
  },
]

export function SearchBar({
  className,
  ...props
}: ComponentProps<typeof Command>) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const handleValueChange = (value: string) => {
    setInputValue(value)
    setOpen(!!value)
  }

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) =>
        user.name.toLowerCase().includes(inputValue.toLowerCase()),
      )
    : []

  console.log("filteredUsers", filteredUsers)
  return (
    <Command
      shouldFilter={false}
      className={cn("rounded-lg border shadow-md", className)}
      {...props}
    >
      <CommandInput
        placeholder="Search..."
        onValueChange={handleValueChange}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      />
      {open && (
        <CommandList>
          <CommandGroup heading="Users">
            {filteredUsers.length > 0 &&
              filteredUsers.map((user) => (
                <CommandItem asChild key={user.username} value={user.username}>
                  <Link to="/$username" params={{ username: user.username }}>
                    <UserAvatar user={user} />
                    {user.name}
                  </Link>
                </CommandItem>
              ))}
            <CommandEmpty>No users found</CommandEmpty>
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
