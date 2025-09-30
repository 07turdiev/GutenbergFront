import React from 'react';
import HeadMeta from "../../components/HeadMeta";
import SectionTitle from "../../components/SectionTitle";
import AuthorListItem from "../../components/AuthorListItem";
import Image from "next/image";
import Pagination from "../../components/Ui/Pagination";
import {useAppSelector} from "../../hooks/reducer";
import {selectAuthors} from "../../store/selectors/author";
import useTranslation from "next-translate/useTranslation";
import Link from 'next/link';
import MainLayout from "../../layouts/MainLayout";
import {wrapper} from "../../store/store";
import {fetchAuthors} from "../../store/actions/author";
import {fetchAdvertisingRight} from "../../store/actions/advertising";

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;
    await dispatch(fetchAuthors({locale: ctx.locale, config: {
        params: {
            p: ctx.query.p
        }
    }}))
    await dispatch(fetchAdvertisingRight({
        locale: ctx.locale,
        type: 'right'
    }));
    return {
        props: {},
    };
});

const AuthorsPage = () => {

    const {authors} = useAppSelector(selectAuthors);
    const {right: asideBanner} = useAppSelector(s=>s.advertisingReducer)
    const {t} = useTranslation('common')

    return (
        <MainLayout>
            <HeadMeta 
                title="O'zbek Mualliflar va Yozuvchilar | Gutenberg Audio Kutubxona" 
                description="Gutenberg audio kutubxonasida O'zbekistonning eng yaxshi mualliflar va yozuvchilari. Audio kitoblar, romanlar va hikoyalar mualliflarining to'liq ro'yxati."
                keywords="o'zbek mualliflar, o'zbek yozuvchilar, audio kitob mualliflari, o'zbek adabiyot mualliflari, Gutenberg mualliflar"
                ogImg="https://gutenbergnu.uz/og-default-img.jpg"
            />
            <div className="container mx-auto px-3 mb-10">

                {/* Breadcrumb Navigation */}
                <div className="mb-4 mt-2 sm:mt-2">
                    <nav className="flex items-center text-sm text-gray-600">
                        <Link href="/">
                            <a className="text-primary hover:text-accent transition-colors">
                                {t('home')}
                            </a>
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-2 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        <span className="text-gray-900 font-medium">
                            {t('authorsPage')}
                        </span>
                    </nav>
                </div>

                <SectionTitle>{t('authorsPage')}</SectionTitle>

                <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-12 md:col-span-9">
                        {
                            authors.results.map((author)=>{
                                return(
                                    <AuthorListItem author={author} key={author.slug}/>
                                )
                            })
                        }
                    </div>

                    <div className="col-span-3 relative">
                        {
                            asideBanner && asideBanner.img ?
                                <div className='relative cursor-pointer'>
                                    <Image src={asideBanner.img.src} width={asideBanner.img.width} height={asideBanner.img.height}/>
                                </div>
                                : null
                        }
                    </div>
                </div>

            </div>

            <Pagination meta={authors.meta}/>
        </MainLayout>
    );
};

export default AuthorsPage;
