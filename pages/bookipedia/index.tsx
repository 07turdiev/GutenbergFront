import React, { useEffect } from 'react';
import MainLayout from "../../layouts/MainLayout";
import useTranslation from "next-translate/useTranslation";
import HeadMeta from '../../components/HeadMeta';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { wrapper } from '../../store/store';
import { fetchBlogPosts } from '../../store/actions/blog';
import { fetchAuthorsList } from '../../store/actions/author';
import { useAppDispatch, useAppSelector } from '../../hooks/reducer';
import { selectBlogPosts, selectBlogLoading, selectBlogTotalPages, selectBlogCurrentPage, selectBlogError } from '../../store/selectors/blog';
import { selectAuthors } from '../../store/selectors/author';
import { setCurrentPage } from '../../store/reducers/BlogSlice';
import { blogContentToPlainText, getBlogImageUrl } from '../../utils/strapiAdapter';
import { formatBlogDate } from '../../utils/dateFormatter';
import { useRouter } from 'next/router';
import SpinnerDots from '../../components/Ui/SpinnerDots';
import BookipediaHero from '../../components/BookipediaHero';
import BookipediaAllSection from '../../components/BookipediaAllSection';
import AuthorsSection from '../../components/AuthorsSection';
import TestimonialsSection from '../../components/TestimonialsSection';

const BookipediaPage = () => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const dispatch = useAppDispatch();
    const posts = useAppSelector(selectBlogPosts);
    const loading = useAppSelector(selectBlogLoading);
    const totalPages = useAppSelector(selectBlogTotalPages);
    const currentPage = useAppSelector(selectBlogCurrentPage);
    const error = useAppSelector(selectBlogError);
    const { authorsList, loading: authorsLoading } = useAppSelector(selectAuthors);

    const handlePageChange = async (page: number) => {
        dispatch(setCurrentPage(page));
        await dispatch(fetchBlogPosts({ locale: router.locale || 'uz', page }));
        window.scrollTo(0, 0);
    };

    const getExcerpt = (content: any[]): string => {
        const plainText = blogContentToPlainText(content);
        return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
    };

    // Client-side fetch for authors if not loaded
    useEffect(() => {
        if (!authorsLoading && (!authorsList || authorsList.length === 0)) {
            dispatch(fetchAuthorsList({ locale: router.locale || 'uz' }));
        }
    }, [dispatch, router.locale, authorsLoading, authorsList]);


    return (
        <MainLayout>
            <HeadMeta 
                title="Bookipedia | Gutenberg" 
                description="Gutenberg Bookipedia sahifasi. Kitoblar, audio kitoblar va adabiyot haqidagi maqolalar, yangiliklar va tavsiyalar."
                keywords="bookipedia, kitob maqolalari, audio kitob yangiliklar, Gutenberg blog, audio kitob tavsiyalar"
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
                            {t('bookipedia')}
                        </span>
                    </nav>
                </div>
                <BookipediaHero />
                

                {loading && (
                    <div className="flex justify-center py-20">
                        <SpinnerDots />
                    </div>
                )}

                {!loading && (posts.length === 0 || !!error) && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">{t('nothingHere')}</p>
                    </div>
                )}

                {!loading && posts.length > 0 && (
                    <BookipediaAllSection posts={posts} />
                )}

                {authorsLoading && (
                    <div className="flex justify-center py-10">
                        <SpinnerDots />
                    </div>
                )}

                {!authorsLoading && authorsList && authorsList.length > 0 && (
                    <AuthorsSection authors={authorsList} />
                )}

                {!authorsLoading && (!authorsList || authorsList.length === 0) && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">Mualliflar topilmadi</p>
                    </div>
                )}

                {/* Testimonials Section */}
                <section className="container mx-auto px-3 md:mb-12 mb-7">
                    <TestimonialsSection />
                </section>
            </div>
        </MainLayout>
    );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) => async ({ locale }) => {
        await Promise.all([
            store.dispatch(fetchBlogPosts({ locale: locale || 'uz', page: 1 })),
            store.dispatch(fetchAuthorsList({ locale: locale || 'uz' }))
        ]);
        
        return {
            props: {},
        };
    }
);

export default BookipediaPage;