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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import HeroSection from "@/components/hero";
import { MoonLoader, BounceLoader } from 'react-spinners'

export const dynamic = 'force-dynamic';

export default function Component() {

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [results, setResults] = useState<any[] | undefined>([]);

  const searchParams = useSearchParams()
  const router = useRouter();
  const query = searchParams.get('query') || ""
  const pathname = usePathname();
  const { replace } = useRouter();

  const form = useForm<SearchTermType>({
    resolver: zodResolver(searchTermSchema),
    defaultValues: {
      query
    },
  });

  function updateSearchParam({ key, value }: {
    key: string,
    value: string
  }): string {
    const params = new URLSearchParams(searchParams);
    if (value) {
      // set the search parameter if value is not empty
      params.set(key, value)
    } else {
      params.delete(key)
    }
    return `${pathname}?${params.toString()}`
  }

  function updateSearchParamForCurrentPage({ key, value }: {
    key: string,
    value: string
  }) {

    const newUrl = updateSearchParam({ key, value })
    replace(newUrl)
  }


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
      form.setValue("query", query)
    }
  }, [query])


  const resetSearch = () => {
    updateSearchParamForCurrentPage({ key: "query", value: "" });
    form.setValue("query", "");
    setResults(undefined)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] px-4">

      {/* <h1 className="py-6 text-2xl">
        COMP4321 Search Engine
      </h1> */}
      <HeroSection resetSearch={resetSearch} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl mx-auto w-full">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className=" flex flex-row gap-2 items-center">


            <FormField
              name="query"
              disabled={isPending}
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <div className="rounded-full shadow-lg p-2 flex items-center">
                      <input
                        placeholder="Search the web"
                        type="text"
                        {...field}
                        className="flex-1 bg-transparent px-4 py-2 focus:outline-none"
                      />
                      <Button
                        className="rounded-full py-0 px-2"
                      >
                        {
                          isPending
                            ? <BounceLoader size={24} color="#2463EB" />
                            : <Search className="w-5 h-5 mx-1 text-gray-500 dark:text-gray-400" />
                        }
                      </Button>
                    </div>
                  </FormControl>
                  {/* <FormDescription>
                    This is the title of your artwork
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <Button type="submit" disabled={isPending} className="text-white bg-black text-sm px-4 h-full border-2 border-black">
              <Search className="" />
            </Button> */}
          </div>
        </form>
      </Form>

      {
        results !== undefined && (
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
        )
      }

    </div>
  )
}

