import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from "../../layouts/MainLayout";
import useTranslation from "next-translate/useTranslation";
import HeadMeta from '../../components/HeadMeta';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { wrapper } from '../../store/store';
import { fetchBlogPostBySlug } from '../../store/actions/blog';
import { useAppSelector } from '../../hooks/reducer';
import { selectCurrentBlogPost, selectBlogLoading } from '../../store/selectors/blog';
import { blogContentToHtml, getBlogImageUrl } from '../../utils/strapiAdapter';
import { formatBlogDate } from '../../utils/dateFormatter';
import SpinnerDots from '../../components/Ui/SpinnerDots';
import YouTubeEmbed from '../../components/Ui/YouTubeEmbed';

const BlogPostPage = () => {
    const router = useRouter();
    const { slug } = router.query;
    const { t } = useTranslation('common');
    const post = useAppSelector(selectCurrentBlogPost);
    const loading = useAppSelector(selectBlogLoading);

    const shareOnFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    };

    const shareOnTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post?.sarlavha || '')}`, '_blank');
    };

    const shareOnTelegram = () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post?.sarlavha || '')}`, '_blank');
    };

    if (loading) {
        return (
            <MainLayout>
                <HeadMeta title={t('blog')} description={t('blog')} />
                <div className="container mx-auto px-3 mb-10">
                    <div className="flex justify-center py-20">
                        <SpinnerDots />
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (!post) {
        return (
            <MainLayout>
                <HeadMeta title={t('blog')} description={t('blog')} />
                <div className="container mx-auto px-3 mb-10">
                    <div className="text-center py-20">
                        <h1 className="text-2xl font-bold mb-4">Post topilmadi</h1>
                        <Link href="/blog">
                            <a className="text-primary hover:text-accent">Blogga qaytish</a>
                        </Link>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <HeadMeta title={post.sarlavha} description={post.sarlavha} />
            <div className="container mx-auto px-3 mb-10">
                
                <div className="mb-8">
                    <Link href="/blog">
                        <a className="inline-flex items-center text-primary hover:text-accent">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            Blogga qaytish
                        </a>
                    </Link>
                </div>

                <article className="max-w-4xl mx-auto">
                    
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold mb-4 text-gray-800">
                            {post.sarlavha}
                        </h1>
                        
                        <div className="flex items-center justify-between text-gray-600 mb-6">
                            <div className="flex items-center space-x-4">
                                <span>{formatBlogDate(post.chop_sanasi, router.locale)}</span>
                                <span>•</span>
                                <span>{post.korishlar_soni} ko'rildi</span>
                            </div>
                        </div>
                    </header>

                    <div className="relative h-96 bg-gradient-to-r from-primary to-accent rounded-lg mb-8 overflow-hidden">
                        {post.rasmi ? (
                            <img 
                                src={getBlogImageUrl(post.rasmi)} 
                                alt={post.sarlavha}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-white text-6xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m2.25-13.5h-9a3 3 0 00-3 3v6a3 3 0 003 3h9a3 3 0 003-3v-6a3 3 0 00-3-3z" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>

                    <div 
                        className="prose prose-lg max-w-none mb-8"
                        dangerouslySetInnerHTML={{ __html: blogContentToHtml(post.kontent) }}
                    />

                    {post.youtube_havolasi && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                                </svg>
                                Video versiya
                            </h3>
                            <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                                <YouTubeEmbed 
                                    content={post.youtube_havolasi}
                                    title={post.sarlavha}
                                    className="absolute inset-0 w-full h-full"
                                />
                            </div>
                        </div>
                    )}

                    <div className="border-t pt-8">
                        <h3 className="text-lg font-semibold mb-4">Ulashing:</h3>
                        <div className="flex space-x-4">
                            <button 
                                onClick={shareOnFacebook}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Facebook
                            </button>
                            <button 
                                onClick={shareOnTwitter}
                                className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
                            >
                                Twitter
                            </button>
                            <button 
                                onClick={shareOnTelegram}
                                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                            >
                                Telegram
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </MainLayout>
    );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (store) => async ({ locale, params }) => {
        const slug = params?.slug as string;
        
        if (slug) {
            await store.dispatch(fetchBlogPostBySlug({ locale: locale || 'uz', slug }));
        }
        
        return {
            props: {},
        };
    }
);

export default BlogPostPage; 