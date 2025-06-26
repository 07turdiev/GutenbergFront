import React, { useEffect } from 'react';
import MainLayout from "../../layouts/MainLayout";
import useTranslation from "next-translate/useTranslation";
import HeadMeta from '../../components/HeadMeta';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { wrapper } from '../../store/store';
import { fetchBlogPosts } from '../../store/actions/blog';
import { useAppDispatch, useAppSelector } from '../../hooks/reducer';
import { selectBlogPosts, selectBlogLoading, selectBlogTotalPages, selectBlogCurrentPage } from '../../store/selectors/blog';
import { setCurrentPage } from '../../store/reducers/BlogSlice';
import { blogContentToPlainText, getBlogImageUrl } from '../../utils/strapiAdapter';
import { formatBlogDate } from '../../utils/dateFormatter';
import { useRouter } from 'next/router';
import SpinnerDots from '../../components/Ui/SpinnerDots';

const BlogPage = () => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const dispatch = useAppDispatch();
    const posts = useAppSelector(selectBlogPosts);
    const loading = useAppSelector(selectBlogLoading);
    const totalPages = useAppSelector(selectBlogTotalPages);
    const currentPage = useAppSelector(selectBlogCurrentPage);

    const handlePageChange = async (page: number) => {
        dispatch(setCurrentPage(page));
        await dispatch(fetchBlogPosts({ locale: router.locale || 'uz', page }));
        window.scrollTo(0, 0);
    };

    const getExcerpt = (content: any[]): string => {
        const plainText = blogContentToPlainText(content);
        return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
    };

    return (
        <MainLayout>
            <HeadMeta title={t('blog')} description={t('blog')} />
            <div className="container mx-auto px-3 mb-10">
                
                {/* Sarlavha */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">{t('blog')}</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        So'nggi yangiliklar, maqolalar va qiziqarli ma'lumotlar
                    </p>
                </div>

                {loading && (
                    <div className="flex justify-center py-20">
                        <SpinnerDots />
                    </div>
                )}

                {!loading && posts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Hozircha blog postlari mavjud emas</p>
                    </div>
                )}

                {/* Blog postlari */}
                {!loading && posts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                
                                {/* Rasm */}
                                <div className="relative h-48 bg-gradient-to-r from-primary to-accent overflow-hidden">
                                    {post.rasmi ? (
                                        <img 
                                            src={getBlogImageUrl(post.rasmi)} 
                                            alt={post.sarlavha}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-white text-4xl">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m2.25-13.5h-9a3 3 0 00-3 3v6a3 3 0 003 3h9a3 3 0 003-3v-6a3 3 0 00-3-3z" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* YouTube video indicator */}
                                    {post.youtube_havolasi && (
                                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                            </svg>
                                            <span className="text-xs font-medium">Video</span>
                                        </div>
                                    )}
                                </div>

                                {/* Kontent */}
                                <div className="p-6">
                                    
                                    {/* Sana va ko'rishlar soni */}
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                        <span>{formatBlogDate(post.chop_sanasi, router.locale)}</span>
                                        <span>{post.korishlar_soni} ko'rildi</span>
                                    </div>

                                    {/* Sarlavha */}
                                    <h2 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
                                        {post.sarlavha}
                                    </h2>
                                    
                                    {/* Qisqacha matn */}
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                        {getExcerpt(post.kontent)}
                                    </p>
                                    
                                    {/* Batafsil tugmasi */}
                                    <Link href={`/blog/${post.slug}`}>
                                        <a className="inline-flex items-center text-primary hover:text-accent font-medium text-sm">
                                            {t('readMore')}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </a>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                        <div className="flex space-x-2">
                            {currentPage > 1 && (
                                <button 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Avvalgi
                                </button>
                            )}
                            
                            {[...Array(totalPages)].map((_, index) => {
                                const page = index + 1;
                                const isCurrentPage = page === currentPage;
                                
                                // Show max 5 page buttons
                                if (
                                    page === 1 || 
                                    page === totalPages || 
                                    (page >= currentPage - 2 && page <= currentPage + 2)
                                ) {
                                    return (
                                        <button 
                                            key={page}
                                            onClick={() => !isCurrentPage && handlePageChange(page)}
                                            className={`px-4 py-2 rounded-lg transition-colors ${
                                                isCurrentPage 
                                                    ? 'bg-primary text-white' 
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                }
                                
                                // Add dots
                                if (page === currentPage - 3 || page === currentPage + 3) {
                                    return <span key={page} className="px-2 py-2">...</span>;
                                }
                                
                                return null;
                            })}
                            
                            {currentPage < totalPages && (
                                <button 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Keyingi
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) => async ({ locale }) => {
        await store.dispatch(fetchBlogPosts({ locale: locale || 'uz', page: 1 }));
        
        return {
            props: {},
        };
    }
);

export default BlogPage; 