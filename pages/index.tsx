import React, {useState} from 'react';
import HeadMeta from "../components/HeadMeta";
import AdvertisingCard from "../components/AdvertisingCard";
// import TabSection from "../components/TabSection";
import BooksShowcaseSection from "../components/BooksShowcaseSection";
import CategoriesListSection from "../components/CategoriesListSection";
import NovelsListSection from "../components/NovelsListSection";
import SectionListWrapper from "../components/SectionListWrapper";
import AuthorsListSection from "../components/AuthorsListSection";
import Image from "next/image";
import MainLayout from "../layouts/MainLayout";
import {useDispatch} from "react-redux";
import useTranslation from "next-translate/useTranslation";
import {useAppSelector} from "../hooks/reducer";
import {selectNovels} from "../store/selectors/novel";
import {selectCategories} from "../store/selectors/genre";
import {selectAuthors} from "../store/selectors/author";
import {selectLatestBlogPosts} from "../store/selectors/blog";
import {useRouter} from "next/router";
import {BooksSlider} from "../components/HomeSlider";
// import PopularAuthorsSlider from "../components/PopularAuthorsSlider";
import AuthorsSection from "../components/AuthorsSection";
import BlogPostsSlider from "../components/BlogPostsSlider";
import CTASection from "../components/CTASection";
import AboutPublisherSection from "../components/AboutPublisherSection";
import StructuredData from "../components/StructuredData";
import BookipediaSection from "../components/BookipediaSection";
import TestimonialsSection from "../components/TestimonialsSection";
import {wrapper} from "../store/store";
import {
    fetchNovelActual,
    fetchNovels,
} from "../store/actions/novel";
import {fetchCategories} from "../store/actions/genre";
import {fetchAuthors} from "../store/actions/author";
import {
    fetchAdvertisingMainBottom,
    fetchAdvertisingMainTop,
    fetchAdvertisingSection
} from "../store/actions/advertising";
import { fetchLatestBlogPosts } from "../store/actions/blog";

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;

    await dispatch(fetchNovels({
        locale: ctx.locale,
        opt: {
          params: {
              popular: 'true'
          }
        },
        ctx,
    }))

    await dispatch(fetchNovelActual({locale: ctx.locale, ctx}));
    await dispatch(fetchCategories({locale: ctx.locale}))
    await dispatch(fetchAuthors({locale: ctx.locale}))
    await dispatch(fetchAdvertisingMainTop({locale: ctx.locale, type: 'main-top'}))
    await dispatch(fetchAdvertisingMainBottom({locale: ctx.locale, type: 'main-bottom'}))
    await dispatch(fetchAdvertisingSection({locale: ctx.locale, type: 'middle'}))
    await dispatch(fetchLatestBlogPosts({locale: ctx.locale, ctx, limit: 6}))

    return {
        props: {

        },
    };
});

const Index = () => {

    const dispatch = useDispatch();

    const {t} = useTranslation('common')
    const {categories} = useAppSelector(selectCategories)
    const {mainBottom, mainTop, middle: sectionBanner} = useAppSelector(s=>s.advertisingReducer)
    const {authors} = useAppSelector(selectAuthors)
    const latestBlogPosts = useAppSelector(selectLatestBlogPosts)

    const router = useRouter();

    const [activeTab, setActiveTab] = useState('new')


    const changeTab = (tabName: string) => {
        setActiveTab(tabName)
        dispatch(fetchNovels({locale: router.locale, opt: {
                params: {
                    [tabName]: 'true'
                }
            }}));
    }

    return (
        <MainLayout>
            <HeadMeta 
                title="Gutenberg - Zamonaviy Audio Kutubxona" 
                description="Gutenberg - O'zbekistondagi eng yirik audio kutubxona. Audio kitoblar, audiokitoblar, romanlar va hikoyalar. Zamonaviy va klassik adabiyotlar audio formatda. Bepul tinglash imkoniyati."
                keywords="audio kitoblar, audiokitoblar, audio romanlar, audio hikoyalar, o'zbek audio kitoblar, bepul audio kitoblar, online audio kutubxona, Gutenberg"
                ogImg="https://gutenbergnu.uz/og-default-img.jpg"
            />
            <StructuredData type="website" data={{}} />
            
            {/* Books Slider Section - Yangi kitoblar */}
            <div className="lg:-mt-40 -mt-30 sm:-mt-24">
                <BooksSlider />
            </div>
            
            {/* CTA section after main slider */}
            <CTASection />
            <AboutPublisherSection />
            

            
            {(mainTop || mainBottom) && (
                <section className="container mx-auto px-3 mb-5">
                    <div className="grid grid-cols-12 sm:gap-4 gap-2">
                        {
                            mainTop ?
                                <div className="lg:col-span-6 sm:col-span-6 col-span-12">
                                    <AdvertisingCard banner={mainTop}/>
                                </div>
                                : null
                        }

                        {
                            mainBottom ?
                                <div className="lg:col-span-6 sm:col-span-6  col-span-12">
                                    <AdvertisingCard left banner={mainBottom}/>
                                </div>
                                : null
                        }
                    </div>
                </section>
            )}

            <section className="container mx-auto px-3 md:mb-12 mb-7 md:mt-16 mt-10">
                <BooksShowcaseSection />
            </section>

            <section className="container mx-auto px-3 md:mb-12 mb-7">
                <BookipediaSection />
            </section>

            {
                categories.results.map((category, index) => {
                    switch (index){
                        case 1: {
                            return (
                                <div key={category.slug}>
                                    <section className="container mx-auto px-3 md:mb-12 mb-7">
                                        <CategoriesListSection categories={categories.results}/>
                                    </section>
                                    <NovelsListSection activeTab={activeTab} category={category} key={category.slug}/>
                                </div>
                            )
                        }
                        case 2: {
                            return (
                                <div key={category.slug}>
                                    <SectionListWrapper title={t('authorsPage')} moreBtn={'/authors/'}>
                                        <AuthorsListSection authors={authors.results}/>
                                    </SectionListWrapper>
                                    {
                                        sectionBanner && sectionBanner.img ?
                                            <section className="container mx-auto px-3 md:mb-12 mb-7">
                                                <div className='relative container mx-auto mt-10 mb-10 cursor-pointer px-3' onClick={()=>router.push(sectionBanner.link)}>
                                                    <Image src={sectionBanner.img.src} width={sectionBanner.img.width} height={sectionBanner.img.height}/>
                                                </div>
                                            </section>
                                            : null

                                    }

                                </div>

                            )
                        }
                        default: {
                            return(
                                <div key={category.slug}>
                                    <NovelsListSection activeTab={activeTab} category={category} key={category.slug}/>
                                </div>
                            )
                        }
                    }

                })
            }

            {/* Authors Section (new) */}
            <section className="container mx-auto px-3 md:mb-12 mb-7">
                <AuthorsSection authors={authors.results} />
            </section>

            {/* Testimonials Section (bottom) */}
            <section className="container mx-auto px-3 md:mb-12 mb-7">
                <TestimonialsSection />
            </section>

        </MainLayout>
    );
};

export default Index;
