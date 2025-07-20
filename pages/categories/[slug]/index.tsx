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
import useTranslation from 'next-translate/useTranslation';

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;

    await dispatch(fetchNovels({locale: ctx.locale, opt: {
            params: {
                ...ctx.query,
                ...(ctx.query.name ? {'filters[nomi][$containsi]': ctx.query.name} : {}),
                ...(ctx.query.author ? {'filters[mualliflar][ismi][$eq]': ctx.query.author} : {}),
                ...(ctx.query.slug ? {'filters[kategoriya][slug][$eq]': ctx.query.slug} : {}),
                ...(ctx.query.lang ? {'filters[locale][$eq]': ctx.query.lang} : {}),
                'pagination[pageSize]': 9,
                'pagination[page]': ctx.query.p || 1,
                'sort[0]': 'createdAt:desc'
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
    const {t} = useTranslation('common');

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
                    ...(query.name ? {'filters[nomi][$containsi]': query.name} : {}),
                    ...(query.author ? {'filters[mualliflar][ismi][$eq]': query.author} : {}),
                    ...(query.slug ? {'filters[kategoriya][slug][$eq]': query.slug} : {}),
                    ...(query.lang ? {'filters[locale][$eq]': query.lang} : {}),
                    'pagination[pageSize]': 9,
                    'pagination[page]': query.p || 1,
                    'sort[0]': 'createdAt:desc'
                }
            }}));
    }

    return (
        <MainLayout>
            <HeadMeta title={query.slug as string} description={query.slug as string} />
            <div className="container mx-auto px-3 mb-10">

                <h2 className='font-bold text-xl mb-6'>{t('category')}</h2>

                <div>
                    <FilterNovels title={query.slug as string}/>

                    <NovelsList novels={novels.results} meta={novels.meta} addNovelToMark={addNovelToMark}/>
                </div>
            </div>

        </MainLayout>
    );
};

export default Index; 