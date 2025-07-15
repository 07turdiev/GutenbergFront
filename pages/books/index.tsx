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
            name: ctx.query.name,
            'pagination[pageSize]': 9,
            'pagination[page]': ctx.query.p || 1
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

                <div className="grid grid-cols-3 gap-6 mb-14">
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
                {novels.meta && <Pagination meta={novels.meta} />}
            </div>

        </MainLayout>
    );
};

export default Index;
