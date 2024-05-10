'use client';
import React from 'react'
import { Button, buttonVariants } from './ui/button'
import Link from 'next/link'
import { History, Search } from 'lucide-react'
import { useRouter } from 'next/navigation';

type Props = {
    resetSearch: () => void;
}

const HeroSection = (props: Props) => {
    const router = useRouter();

    return (
        <div className="py-20 pb-10 mx-auto text-center flex flex-col items-center max-w-3xl">
            <div
                // href="/"
                onClick={props.resetSearch}
                className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl hover:cursor-pointer">
                <span className="text-blue-600 text-3xl">
                    COMP4321
                </span>
                <br />
                Search Engine
            </div>
            <p className="mt-6 text-lg max-w-prose text-muted-foreground">
                By{" "}
                <Link href="https://github.com/Azis64" target="_blank" className='underline'>
                    Axis
                </Link>,{" "}
                <Link href="https://github.com/CheungHin-Hiu" target="_blank" className='underline'>
                    CheungHin-Hui
                </Link>, and {" "}
                <Link href="https://github.com/mohamedsobhi777" target="_blank" className='underline'>
                    Mohamed
                </Link>
            </p>
            <div className='py-4'>
                <Button variant={"secondary"} asChild>
                    <Link href="/history">
                        <History className='w-5 h-5 mr-1' /> Show Search History
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default HeroSection