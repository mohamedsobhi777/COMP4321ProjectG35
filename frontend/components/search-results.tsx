'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { ExternalLink, File, LinkIcon } from 'lucide-react';
import { pageInfo } from '@prisma/client';
import { clampText } from '@/lib/text';
import { TermType } from '@/actions/searchAction';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
// import { scoreToColor } from '@/lib/color';

type Props = {
    data: {
        id: string;
        score: number;
        pageInfo: pageInfo;
        keywords: TermType[];
    };
    similarResultsLink: string;
}

const SearchResultCard = ({ data, similarResultsLink }: Props) => {
    const router = useRouter();
    const scoreToColor = (score: number) => {
        switch (score) {
            case 0: return '!bg-score-0'
            case 1: return '!bg-score-1'
            case 2: return '!bg-score-2'
            case 3: return '!bg-score-3'
            case 4: return '!bg-score-4'
            case 5: return '!bg-score-5'
            case 6: return '!bg-score-6'
            case 7: return '!bg-score-7'
            case 8: return '!bg-score-8'
            case 9: return '!bg-score-9'
            case 10: return '!bg-score-10'
            case 11: return '!bg-score-11'
            case 12: return '!bg-score-12'
            case 13: return '!bg-score-13'
            case 14: return '!bg-score-14'
            case 15: return '!bg-score-15'
            case 16: return '!bg-score-16'
            case 17: return '!bg-score-17'
            case 18: return '!bg-score-18'
            case 19: return '!bg-score-19'
            case 20: return '!bg-score-20'
            case 21: return '!bg-score-21'
            case 22: return '!bg-score-22'
            case 23: return '!bg-score-23'
            case 24: return '!bg-score-24'
            case 25: return '!bg-score-25'
            case 26: return '!bg-score-26'
            case 27: return '!bg-score-27'
            case 28: return '!bg-score-28'
            case 29: return '!bg-score-29'
            case 30: return '!bg-score-30'
            case 31: return '!bg-score-31'
            case 32: return '!bg-score-32'
            case 33: return '!bg-score-33'
            case 34: return '!bg-score-34'
            case 35: return '!bg-score-35'
            case 36: return '!bg-score-36'
            case 37: return '!bg-score-37'
            case 38: return '!bg-score-38'
            case 39: return '!bg-score-39'
            case 40: return '!bg-score-40'
            case 41: return '!bg-score-41'
            case 42: return '!bg-score-42'
            case 43: return '!bg-score-43'
            case 44: return '!bg-score-44'
            case 45: return '!bg-score-45'
            case 46: return '!bg-score-46'
            case 47: return '!bg-score-47'
            case 48: return '!bg-score-48'
            case 49: return '!bg-score-49'
            case 50: return '!bg-score-50'
            case 51: return '!bg-score-51'
            case 52: return '!bg-score-52'
            case 53: return '!bg-score-53'
            case 54: return '!bg-score-54'
            case 55: return '!bg-score-55'
            case 56: return '!bg-score-56'
            case 57: return '!bg-score-57'
            case 58: return '!bg-score-58'
            case 59: return '!bg-score-59'
            case 60: return '!bg-score-60'
            case 61: return '!bg-score-61'
            case 62: return '!bg-score-62'
            case 63: return '!bg-score-63'
            case 64: return '!bg-score-64'
            case 65: return '!bg-score-65'
            case 66: return '!bg-score-66'
            case 67: return '!bg-score-67'
            case 68: return '!bg-score-68'
            case 69: return '!bg-score-69'
            case 70: return '!bg-score-70'
            case 71: return '!bg-score-71'
            case 72: return '!bg-score-72'
            case 73: return '!bg-score-73'
            case 74: return '!bg-score-74'
            case 75: return '!bg-score-75'
            case 76: return '!bg-score-76'
            case 77: return '!bg-score-77'
            case 78: return '!bg-score-78'
            case 79: return '!bg-score-79'
            case 80: return '!bg-score-80'
            case 81: return '!bg-score-81'
            case 82: return '!bg-score-82'
            case 83: return '!bg-score-83'
            case 84: return '!bg-score-84'
            case 85: return '!bg-score-85'
            case 86: return '!bg-score-86'
            case 87: return '!bg-score-87'
            case 88: return '!bg-score-88'
            case 89: return '!bg-score-89'
            case 90: return '!bg-score-90'
            case 91: return '!bg-score-91'
            case 92: return '!bg-score-92'
            case 93: return '!bg-score-93'
            case 94: return '!bg-score-94'
            case 95: return '!bg-score-95'
            case 96: return '!bg-score-96'
            case 97: return '!bg-score-97'
            case 98: return '!bg-score-98'
            case 99: return '!bg-score-99'
            case 100: return '!bg-score-100'
        }
    }

    const handleSimilarResults = () => {
        router.replace(similarResultsLink);
        router.refresh();
    }


    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    {/* 
                    <Link target='_blank' href={data.id} id="article-link-151230" className='flex items-center gap-1'>
                    </Link> */}
                    <Link target='_blank' href={data.id} id="article-link-151230" className='flex items-center gap-1 text-lg font-semibold text-gray-900'>
                        {clampText(data.pageInfo.Title, 64)} <ExternalLink className="w-4 h-4" />

                    </Link>

                    <div className="flex items-center">
                        <small className="mr-2 text-gray-600"> {data.pageInfo.PageSize} words</small>
                        <Button
                            asChild
                            type="button"
                            variant={"outlined"}
                            // onClick={handleSimilarResults}
                            className="rounded text-sm px-3 py-2 text-current"
                        >
                            <Link href={similarResultsLink ?? "#"}>
                                <span>See Similar Pages</span>
                            </Link>
                        </Button>
                    </div>
                </div>
                <p className="text-xs pl-1 text-gray-600 hover:text-black">
                    last modified:  {data.pageInfo.lastModifiedDate}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                    Top Keywords:
                    {
                        data.keywords.map(keyword => (
                            <Badge key={keyword.wordId} variant="secondary" className='!bg-[#F4F4F5] !text-[#18181B] border-none'>
                                {keyword.wordId} ({keyword.termFrequency})
                            </Badge>

                        ))
                    }
                </div>
            </div>
            <div className="border-t border-gray-200">
                <div className="p-6 space-y-4">
                    <h4 className="text-base font-semibold text-gray-900 ">{data.pageInfo.parentLink.length} Parent Pages</h4>
                    <div className="grid gap-4">
                        {
                            data.pageInfo.parentLink.map(parentPage => (
                                <div key={parentPage} className="flex items-center justify-between">
                                    <div className="flex gap-3">
                                        <File className="w-5 h-5 text-gray-500 " />
                                        <Link target="_blank" href={parentPage} className="text-gray-900 hover:underline">
                                            {parentPage}
                                        </Link>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-200">
                <div className="p-6 space-y-4">
                    <h4 className="text-base font-semibold text-gray-900 ">{data.pageInfo.ChildLink.length} Children Pages</h4>
                    <div className="grid gap-4">
                        {
                            data.pageInfo.ChildLink.map(childPage => (
                                <div key={childPage} className="flex items-center justify-between">
                                    <div className="flex gap-3">
                                        <File className="w-5 h-5 text-gray-500 " />
                                        <Link target="_blank" href={childPage} className="text-gray-900 hover:underline">
                                            {childPage}
                                        </Link>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="py-2 flex justify-end mx-4">
                <Badge className={cn("border-none py-1", scoreToColor(Math.round(data.score * 100)))} > Score: {data.score.toFixed(2)}</Badge>
            </div>
        </div>

    )
}

export default SearchResultCard