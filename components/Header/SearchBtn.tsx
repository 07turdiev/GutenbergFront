import React from 'react';
import {useRouter} from "next/router";

const SearchBtn = () => {

    const router = useRouter();

    return (
        <div className='shrink-0 text-gray-500 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition hover:bg-gray-100' onClick={()=>router.push('/novels/')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
    );
};

export default SearchBtn;
