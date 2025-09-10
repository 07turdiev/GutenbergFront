import React, {useState} from 'react';
import HeadMeta from "../../HeadMeta";
import AdvertisingCard from "../../AdvertisingCard";
// import TabSection from "../../TabSection";
import BooksShowcaseSection from "../../BooksShowcaseSection";
import CategoriesListSection from "../../CategoriesListSection";
import NovelsListSection from "../../NovelsListSection";
import SectionListWrapper from "../../SectionListWrapper";
import AuthorsListSection from "../../AuthorsListSection";
import Image from "next/image";
import MainLayout from "../../../layouts/MainLayout";
import {useDispatch} from "react-redux";
import useTranslation from "next-translate/useTranslation";
import {useAppSelector} from "../../../hooks/reducer";
import {selectNovels} from "../../../store/selectors/novel";
import {selectCategories} from "../../../store/selectors/genre";
import {selectAuthors} from "../../../store/selectors/author";
import {selectLatestBlogPosts} from "../../../store/selectors/blog";
import {useRouter} from "next/router";
import {fetchNovels} from "../../../store/actions/novel";
import {BooksSlider} from "../../HomeSlider";
// import PopularAuthorsSlider from "../../PopularAuthorsSlider";
import AuthorsSection from "../../AuthorsSection";
import BlogPostsSlider from "../../BlogPostsSlider";
import CTASection from "../../CTASection";
import AboutPublisherSection from "../../AboutPublisherSection";
import StructuredData from "../../StructuredData";
import BookipediaSection from "../../BookipediaSection";

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
            
            {/* Books Slider Section - New Books */}
            <div className="lg:-mt-32 -mt-20 sm:-mt-24">
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

            {latestBlogPosts && latestBlogPosts.length > 0 && (
                <SectionListWrapper title={t('blogPostsTitle')} moreBtn="/blog">
                    <BlogPostsSlider posts={latestBlogPosts} />
                </SectionListWrapper>
            )}

        </MainLayout>
    );
};

export default Index;