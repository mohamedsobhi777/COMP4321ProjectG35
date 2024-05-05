/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/lXxx5Sziyvd
 */
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"

export function Component() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] px-4">
      <div className="flex w-full max-w-md items-center space-x-2 border border-gray-200 rounded-lg dark:border-gray-800 dark:border-gray-800">
        <Input className="flex-1 w-0 rounded-lg" placeholder="Search..." type="search" />
        <Button className="h-10 w-10 rounded-lg" type="submit">
          <SearchIcon className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </div>
  )
}

