import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useDebounce} from "use-debounce";
import useTranslation from 'next-translate/useTranslation';


const Index = () => {


    const [query, setQuery] = useState(null);
    const [value] = useDebounce(query, 500);

    const router = useRouter();
    const { t } = useTranslation('common');

    const onSubmit = (e) => {
        e.preventDefault();
        router.query.name = value;
        router.push(router)
    }

    const onChange = (e) => {
        setQuery(e.target.value)
    }

    useEffect(() => {
        if(query !== null){
            router.query.name = value;
            router.push(router)
        }
    }, [value])


    useEffect(()=>{
        if(router.query.name){
            setQuery(router.query.name.toString());
        }
    }, [])

    const clearSearch = () => {
        setQuery('')
    }


    return (
        <div className='mb-10 mt-5'>
            <form action="#" className='w-full flex items-center gap-2 sm:gap-4' onSubmit={onSubmit}>
                <div className='relative w-full'>
                    <input value={query} type="text" className='w-full border border-gray-200 h-11 rounded-md outline-none px-3 focus:border-primary' placeholder={t('nameOfBook')} onChange={onChange}/>
                    {
                        value && value.length > 0 ?
                            <button className='absolute text-gray-400 w-6 h-6 right-[10px] top-[10px]' onClick={clearSearch}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        : null
                    }

                </div>

                <button className='h-11 px-5 sm:px-16 py-2 text-xl bg-primary text-white rounded-md transition hover:opacity-80 '>
                    {t('search')}
                </button>
            </form>
        </div>
    );
};

export default Index;