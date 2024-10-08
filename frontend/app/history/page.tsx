
'use client';

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useLocalStorage } from 'usehooks-ts';



export type QueryType = {
    query: string;
    timestamp: Date;
}

export default function HistoryPage() {
    const [historyQueries, setHistoryQueries] = useLocalStorage<QueryType[]>('historyQueries', [], { initializeWithValue: false })

    const handleRemove = (title: string, _i: number) => {
        toast.success(`Deleted '${title}' successfully!`)
        setHistoryQueries((prev) => prev.filter((item, i) => i !== _i));
    }

    return (
        <div className="w-full  bg-white p-8">

            <div className='py-4'>
                <Button variant={"secondary"} asChild>
                    <Link href="/">
                        <ArrowLeft className='w-5 h-5 mr-1' /> Back to Search
                    </Link>
                </Button>
            </div>

            <div className="py-20 pb-2 mx-auto text-center  items-center max-w-3xl">
                <Link
                    href="/"
                    className=" text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl hover:cursor-pointer"
                >
                    <span className="text-blue-600 text-3xl">
                        COMP4321
                    </span>
                    <br />
                    Search Engine
                </Link>
            </div>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Your Search History</h1>
                <div className="w-full max-w-md mt-8">
                    {
                        historyQueries.length === 0
                        && <h2 className="text-lg font-medium text-center w-full text-red-400 mb-4">You have no search history</h2>
                    }
                    <div className="space-y-4">
                        {
                            historyQueries.map((query, i) => (
                                <div key={i} className="flex items-center justify-between bg-gray-100 p-4 rounded-md">
                                    <div>
                                        <p className="text-sm text-gray-900 mb-1">{query.query}</p>
                                        <p className="text-xs text-gray-500">{query.timestamp.toString()}</p>
                                    </div>
                                    <Button onClick={() => handleRemove(query.query, i)} size="sm" variant="ghost">
                                        Remove
                                    </Button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}