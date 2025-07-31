import React, {useState} from 'react';
import MainLayout from "../../layouts/MainLayout";
import {wrapper} from "../../store/store";
import {deleteFromSavedNovel, fetchNovels, saveNovel} from "../../store/actions/novel";
import {fetchCategoriesList} from "../../store/actions/genre";
import {useAppSelector} from "../../hooks/reducer";
import {selectNovels} from "../../store/selectors/novel";
import NovelsList from "../../components/NovelsList";
import FilterNovels from "../../components/FilterNovels";
import {fetchAuthors, fetchAuthorsList} from "../../store/actions/author";
import {fetchCategoriesList as fetchCategoriesListOld} from "../../store/actions/category";
import  useTranslation  from 'next-translate/useTranslation';
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import HeadMeta from '../../components/HeadMeta';


export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;
    await dispatch(fetchAuthors({locale: ctx.locale}));
    await dispatch(fetchCategoriesList({locale: ctx.locale}));
    await dispatch(fetchCategoriesListOld({locale: ctx.locale}));
    await dispatch(fetchAuthorsList({locale: ctx.locale}));

    await dispatch(fetchNovels({locale: ctx.locale, opt: {
            params: {
                ...ctx.query,
                p: ctx.query.p
            }
    },
        ctx
    }));

    return {
        props: {},
    };
});

const Index = () => {
    const { novels } = useAppSelector(selectNovels);
    const dispatch = useDispatch();
    const {query, locale} = useRouter();

    const {t} = useTranslation('common')

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
                   ...query
                }
        }}));
    }

    return (
        <MainLayout>
            <HeadMeta 
                title="Audio Kitob Kategoriyalari | Gutenberg Audio Kutubxona" 
                description="Gutenberg audio kutubxonasida turli kategoriyalardagi audio kitoblar: romanlar, hikoyalar, tarix, ilm-fan, diniy kitoblar va boshqalar."
                keywords="audio kitob kategoriyalari, audio romanlar, audio hikoyalar, diniy audio kitoblar, tarix audio kitoblar, ilm-fan audio kitoblar"
                ogImg="https://gutenbergnu.uz/og-default-img.jpg"
            />
            <div className="container mx-auto px-3 mb-10">

                <div>
                    <FilterNovels title={t('category')}/>

                    <NovelsList novels={novels.results} meta={novels.meta} addNovelToMark={addNovelToMark}/>
                </div>
            </div>

        </MainLayout>
    );
};

export default Index; 