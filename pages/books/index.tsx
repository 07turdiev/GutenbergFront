import React, {useEffect, useState} from 'react';
import MainLayout from "../../layouts/MainLayout";
import {wrapper} from "../../store/store";
import {deleteFromSavedNovel, fetchNovels, saveNovel} from "../../store/actions/novel";
import {useAppSelector} from "../../hooks/reducer";
import {selectNovels} from "../../store/selectors/novel";
import NovelCard from "../../components/NovelCard";
import FilterNovels from "../../components/FilterNovels";
import {fetchGenres, fetchGenresList} from "../../store/actions/genre";
import {fetchAuthors, fetchAuthorsList} from "../../store/actions/author";
import {fetchCategories, fetchCategoriesList} from "../../store/actions/category";
import Pagination from "../../components/Ui/Pagination";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import SearchForm from "../../components/SearchForm";
import HeadMeta from '../../components/HeadMeta';
import useTranslation from 'next-translate/useTranslation';

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;

    await dispatch(fetchNovels({locale: ctx.locale, opt: {
        params: {
            ...ctx.query,
            p: ctx.query.p,
            name: ctx.query.name
        }
    }, ctx}));

    await dispatch(fetchGenresList({locale: ctx.locale}));
    await dispatch(fetchAuthorsList({locale: ctx.locale}));
    await dispatch(fetchCategoriesList({locale: ctx.locale}));

    return {
        props: {},
    };
});


const Index = () => {

    const {novels} = useAppSelector(selectNovels);
    const {locale, query} = useRouter();
    const {t} = useTranslation('common')
    const dispatch = useDispatch();

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
                    ...query,
                    name: query.name,
                    p: query.p
                }
        }}));
    }

    return (
        <MainLayout>
            <HeadMeta title={t('novels')} description={t('novels')} />
            <div className="container mx-auto px-3 ">

                <SearchForm/>

                <FilterNovels title={t('novels')}/>

                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6   mb-14">
                    {
                        novels.results.map((novel)=>{
                            return (
                                <div className="col-span-1" key={novel.slug}>
                                    <NovelCard novel={novel} addToMark={addNovelToMark}/>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

        </MainLayout>
    );
};

export default Index;
