import React, {useEffect, useState} from 'react';
import MainLayout from "../../../layouts/MainLayout";
import FilterNovels from "../../../components/FilterNovels";
import {useAppSelector} from "../../../hooks/reducer";
import {selectNovels} from "../../../store/selectors/novel";
import {fetchGenresList} from "../../../store/actions/genre";
import {deleteFromSavedNovel, fetchNovels, saveNovel} from "../../../store/actions/novel";
import {wrapper} from "../../../store/store";
import NovelsList from "../../../components/NovelsList";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import HeadMeta from '../../../components/HeadMeta';

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;

    await dispatch(fetchNovels({locale: ctx.locale, opt: {
            params: {
                ...ctx.query,
                p: ctx.query.p,
                genre: ctx.query.slug,
                name: ctx.query.name,
                author: ctx.query.author
            }
        },
        ctx
    }));

    await dispatch(fetchGenresList({locale: ctx.locale}))

    return {
        props: {},
    };

});

const Index = () => {

    const {novels} = useAppSelector(selectNovels);
    const dispatch = useDispatch();
    const {query, locale} = useRouter();

    const addNovelToMark = async (slug, saved) => {
        if(!saved){
            await dispatch(saveNovel({
                locale:  locale,
                slug: slug
            }))
        }else {
            await dispatch(deleteFromSavedNovel({
                locale:  locale,
                slug: slug
            }))
        }

        await dispatch(fetchNovels({locale: locale, opt: {
                params: {
                    genre: query.slug
                }
            }}));
    }

    return (
        <MainLayout>
            <HeadMeta title={query.slug} description={query.slug} />
            <div className="container mx-auto px-3 mb-10">

                <h2 className='font-bold text-xl mb-6'>{query.slug}</h2>

                <div className="grid grid-cols-12">

                    <div className="lg:col-span-3 col-span-12 hidden lg:block">
                        <FilterNovels title={query.slug as string}/>
                    </div>

                    <div className="lg:col-span-9 col-span-12">

                        {
                            novels && novels.results.length > 0 ?
                                <NovelsList novels={novels.results} meta={novels.meta} addNovelToMark={addNovelToMark}/>
                            :
                                <div className='text-center text-gray-300 text-xl'>
                                    <div className='flex justify-center mb-3'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>

                                    Книг не найдено
                                </div>
                        }


                    </div>

                </div>
            </div>


        </MainLayout>
    );
};

export default Index;
