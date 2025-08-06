/* eslint-disable react/prop-types */
import { SearchIcon } from "lucide-react"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"

export function Search(
  {className, ...props}
) {
  return (
    <div className="">
      <SearchIcon className=" absolute translate-y-1/2 translate-x-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        className={cn("md:w-[250px] lg:w-[300px] min-w-250px font-normal pl-8", className)}
        {...props}
      />
    </div>
  )
}