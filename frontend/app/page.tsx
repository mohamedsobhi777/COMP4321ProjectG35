'use client';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { SearchTermType, searchTermSchema } from "@/schemas"
import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchAction } from "@/actions/searchAction";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import SearchResultCard from "@/components/search-results";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';

export default function Component() {

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [results, setResults] = useState<any[]>([]);

  const searchParams = useSearchParams()
  const router = useRouter();
  const query = searchParams.get('query') || ""

  const form = useForm<SearchTermType>({
    resolver: zodResolver(searchTermSchema),
    defaultValues: {
      query
    },
  });

  const onSubmit = (values: SearchTermType) => {

    startTransition(() => {
      router.replace(`/?query=${values.query}`, { scroll: false });
      searchAction(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.results) {
            // toast.success(data.success)
            setResults(data.results);
            setError(undefined)
            // router.push("/profile")
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  useEffect(() => {
    if (query.length > 0) {
      onSubmit({ query });
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] px-4">

      <h1 className="py-6 text-2xl">
        COMP4321 Search Engine
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl mx-auto w-full">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className=" flex flex-row gap-2 items-center">


            <FormField
              name="query"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  {/* <FormLabel>Search </FormLabel> */}
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Search..."
                      {...field}
                      className="block p-4 text-sm border border-gray-300 rounded-lg text-white"
                    />
                  </FormControl>
                  {/* <FormDescription>
                    This is the title of your artwork
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="text-white bg-black text-sm px-4 h-full border-2 border-black">
              <Search className="" />
            </Button>
          </div>
        </form>
      </Form>

      <div className="flex flex-col py-4">
        <div>
          {results.length} Results
        </div>
        <div className="flex flex-col gap-4 w-full">
          {results.map((result) => (
            <SearchResultCard
              key={result.id}
              data={result}
              similarResultsLink={`/?query=${query} ${(result.keywords.map((word: any) => word.wordId)).join(' ')}`}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

