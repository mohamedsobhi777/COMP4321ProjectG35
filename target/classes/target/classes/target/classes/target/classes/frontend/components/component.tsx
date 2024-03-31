/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/lXxx5Sziyvd
 */
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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


function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
