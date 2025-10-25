import React, {useEffect, useState} from 'react';
import MainLayout from "../../layouts/MainLayout";
import {wrapper} from "../../store/store";
import {deleteFromSavedNovel, fetchNovels, saveNovel} from "../../store/actions/novel";
import {useAppSelector} from "../../hooks/reducer";
import {selectNovels} from "../../store/selectors/novel";
import NovelCard from "../../components/NovelCard";
import FilterNovels from "../../components/FilterNovels";
import {fetchCategories, fetchCategoriesList} from "../../store/actions/genre";
import {fetchAuthors, fetchAuthorsList} from "../../store/actions/author";
import {fetchCategories as fetchCategoriesOld, fetchCategoriesList as fetchCategoriesListOld} from "../../store/actions/category";
import Pagination from "../../components/Ui/Pagination";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import SearchForm from "../../components/SearchForm";
import HeadMeta from '../../components/HeadMeta';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import {BooksSlider} from "../../components/HomeSlider";
import GenresSection from "../../components/GenresSection";

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;

    await dispatch(fetchNovels({locale: ctx.locale, opt: {
        params: {
            ...ctx.query,
            ...(ctx.query.name ? {'filters[nomi][$containsi]': ctx.query.name} : {}),
            ...(ctx.query.author ? {'filters[mualliflar][ismi][$eq]': ctx.query.author} : {}),
            ...(ctx.query.category ? {'filters[kategoriya][slug][$eq]': ctx.query.category} : {}),
            ...(ctx.query.lang ? {'filters[locale][$eq]': ctx.query.lang} : {}),
            'pagination[pageSize]': 9,
            'pagination[page]': ctx.query.p || 1,
            'sort[0]': 'createdAt:desc'
        }
    }, ctx}));

    await dispatch(fetchCategoriesList({locale: ctx.locale}));
    await dispatch(fetchAuthorsList({locale: ctx.locale}));
    await dispatch(fetchCategoriesListOld({locale: ctx.locale}));

    return {
        props: {},
    };
});


const Index = () => {

    const {novels} = useAppSelector(selectNovels);
    const {locale, query} = useRouter();
    const {t} = useTranslation('common')
    const dispatch = useDispatch();

    const genres = [
        'Fan',
        'Texnika',
        'Badiiy',
        'Ilmiy',
        'Komiks',
        "She’riy",
        'Moliya',
        'Innovatsiya',
    ];
    const [activeGenre, setActiveGenre] = useState<string>('Innovatsiya');

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
            <HeadMeta 
                title="Audio Kitoblar va Romanlar | Gutenberg Audio Kutubxona" 
                description="Gutenberg audio kutubxonasida minglab audio kitoblar, romanlar va hikoyalar. Zamonaviy va klassik adabiyotlar audio formatda. Bepul tinglash va yuklab olish."
                keywords="audio kitoblar, audio romanlar, o'zbek audio kitoblar, bepul audio kitoblar, online audio kutubxona, audio hikoyalar, audiokitoblar"
                ogImg="https://gutenbergnu.uz/og-default-img.jpg"
            />
                
            {/* Books Slider Section */}
            <div className="lg:-mt-40 -mt-30 sm:-mt-24">
                <BooksSlider />
            </div>
            {/* Genres Section (after slider) */}
            <GenresSection genres={genres} activeGenre={activeGenre} onSelect={setActiveGenre}/>
            <div className="container mx-auto px-3 ">

                {/* Breadcrumb Navigation */}
                <div className="mb-4 mt-2 sm:mt-2">
                    <nav className="flex items-center text-sm text-gray-600 display: flex" aria-label="Breadcrumb">
                        <Link href="/">
                            <a className="text-primary hover:text-accent transition-colors">
                                {t('home')}
                            </a>
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-2 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        <span className="text-gray-900 font-medium">
                            {t('books')}
                        </span>
                    </nav>
                </div>

                <SearchForm/>

                <FilterNovels title={t('novels')}/>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-14">
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
