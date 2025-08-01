import React, {useEffect, useState} from 'react';
import MainLayout from "../../../layouts/MainLayout";
import FilterNovels from "../../../components/FilterNovels";
import {useAppSelector} from "../../../hooks/reducer";
import {selectNovels} from "../../../store/selectors/novel";
import {fetchCategoriesList} from "../../../store/actions/genre";
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
                category: ctx.query.slug,
                name: ctx.query.name,
                author: ctx.query.author
            }
        },
        ctx
    }));

    await dispatch(fetchCategoriesList({locale: ctx.locale}))

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
                    category: query.slug
                }
            }}));
    }

    return (
        <MainLayout>
            <HeadMeta title={query.slug} description={query.slug} />
            <div className="container mx-auto px-3 mb-10">

                <h2 className='font-bold text-xl mb-6'>{query.slug as string}</h2>

                <div>
                        <FilterNovels title={query.slug as string}/>

                                <NovelsList novels={novels.results} meta={novels.meta} addNovelToMark={addNovelToMark}/>
                </div>
            </div>

        </MainLayout>
    );
};

export default Index;
