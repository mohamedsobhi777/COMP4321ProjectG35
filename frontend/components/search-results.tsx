import React from 'react'

type Props = {
    data: any;
}

const SearchResultCard = ({ data }: Props) => {
    return (
        <div className='border-2 border-black p-4'>
            {JSON.stringify(data)}
        </div>
    )
}

export default SearchResultCard