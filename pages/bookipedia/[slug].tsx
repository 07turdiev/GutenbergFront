import React, { useEffect, useMemo, useState } from 'react';
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

    // Compute reading time from content blocks (approx. 200 wpm)
    const readingTime = useMemo(() => {
        if (!post?.kontent || !Array.isArray(post.kontent)) return null;
        const allText = post.kontent
            .map(block => (Array.isArray((block as any).children) ? (block as any).children.map((c: any) => c?.text || '').join(' ') : ''))
            .join(' ')
            .trim();
        if (!allText) return null;
        const words = allText.split(/\s+/).filter(Boolean).length;
        const minutes = Math.max(1, Math.ceil(words / 200));
        return `${minutes} daq.`;
    }, [post]);

    // Optional rating (render only if present in payload)
    const rating: string | null = useMemo(() => {
        const anyPost = post as any;
        if (!anyPost) return null;
        return (anyPost.reyting || anyPost.rating || null) as string | null;
    }, [post]);

    // Bookmark toggle using localStorage
    const [bookmarked, setBookmarked] = useState(false);
    useEffect(() => {
        if (!slug || typeof window === 'undefined') return;
        try {
            const raw = window.localStorage.getItem('blogBookmarks');
            const arr: string[] = raw ? JSON.parse(raw) : [];
            setBookmarked(arr.includes(String(slug)));
        } catch {}
    }, [slug]);

    const toggleBookmark = () => {
        if (!slug || typeof window === 'undefined') return;
        try {
            const key = 'blogBookmarks';
            const raw = window.localStorage.getItem(key);
            const arr: string[] = raw ? JSON.parse(raw) : [];
            const s = String(slug);
            let next: string[];
            if (arr.includes(s)) {
                next = arr.filter(x => x !== s);
                setBookmarked(false);
            } else {
                next = [...arr, s];
                setBookmarked(true);
            }
            window.localStorage.setItem(key, JSON.stringify(next));
        } catch {}
    };

    // Generic Web Share / copy link fallback
    const shareLink = async () => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        try {
            if ((navigator as any).share) {
                await (navigator as any).share({ url, title: post?.sarlavha });
                return;
            }
        } catch {}
        try {
            await navigator.clipboard.writeText(url);
            // noop toast; silently succeed
        } catch {
            // fallback
            if (typeof window !== 'undefined') {
                window.prompt('Havolani nusxalang:', url);
            }
        }
    };

    // Derive YouTube ID and thumbnail for a click-to-play placeholder
    const youtubeId = useMemo(() => {
        if (!post?.youtube_havolasi) return null;
        const url = post.youtube_havolasi;
        const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
        return match ? match[1] : null;
    }, [post]);

    const youtubeThumb = useMemo(() => {
        if (!youtubeId) return null;
        return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
    }, [youtubeId]);

    const [showVideo, setShowVideo] = useState(false);

    // Interactive star rating (persisted per slug)
    const [currentRating, setCurrentRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    useEffect(() => {
        if (!slug || typeof window === 'undefined') return;
        try {
            const raw = window.localStorage.getItem('blogRatings');
            const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
            setCurrentRating(map[String(slug)] || 0);
        } catch {}
    }, [slug]);

    const setRating = (value: number) => {
        setCurrentRating(value);
        if (!slug || typeof window === 'undefined') return;
        try {
            const key = 'blogRatings';
            const raw = window.localStorage.getItem(key);
            const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
            map[String(slug)] = value;
            window.localStorage.setItem(key, JSON.stringify(map));
        } catch {}
    };

    // Read-complete persistence
    const [readComplete, setReadComplete] = useState(false);
    useEffect(() => {
        if (!slug || typeof window === 'undefined') return;
        try {
            const raw = window.localStorage.getItem('blogReadComplete');
            const arr: string[] = raw ? JSON.parse(raw) : [];
            setReadComplete(arr.includes(String(slug)));
        } catch {}
    }, [slug]);

    const markReadComplete = () => {
        if (!slug || typeof window === 'undefined') return;
        try {
            const key = 'blogReadComplete';
            const raw = window.localStorage.getItem(key);
            const arr: string[] = raw ? JSON.parse(raw) : [];
            const s = String(slug);
            if (!arr.includes(s)) {
                const next = [...arr, s];
                window.localStorage.setItem(key, JSON.stringify(next));
            }
            setReadComplete(true);
        } catch {}
    };

    // Optional gallery support (renders if post has array of image urls)
    const gallery: Array<{ id?: string | number; url: string }> = useMemo(() => {
        const anyPost = post as any;
        const raw = (anyPost?.galereya || anyPost?.gallery || anyPost?.images || []) as any[];
        return Array.isArray(raw)
            ? (raw
                .map((img: any, idx: number) => {
                    const url = typeof img === 'string' ? img : img?.url;
                    return url ? { id: img?.id ?? idx, url } : null;
                })
                .filter(Boolean) as Array<{ id?: string | number; url: string }>)
            : [];
    }, [post]);

    if (loading) {
        return (
            <MainLayout>
                <HeadMeta title={t('bookipedia')} description={t('bookipedia')} />
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
                <HeadMeta title={t('bookipedia')} description={t('bookipedia')} />
                <div className="container mx-auto px-3 mb-10">
                    <div className="text-center py-20">
                        <h1 className="text-2xl font-bold mb-4">Post topilmadi</h1>
                        <Link href="/bookipedia">
                            <a className="text-primary hover:text-accent">Bookipediaga qaytish</a>
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
                {/* Breadcrumb */}
                <div className="mb-4 mt-2 sm:mt-2">
                    <nav className="flex items-center text-sm text-gray-600">
                        <Link href="/">
                            <a className="text-primary hover:text-accent transition-colors">{t('home')}</a>
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        <Link href="/bookipedia">
                            <a className="text-primary hover:text-accent transition-colors">{t('bookipedia')}</a>
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        <span className="text-gray-900 font-medium truncate">{post ? post.sarlavha : '...'}</span>
                    </nav>
                </div>

                <article className="w-full">
                    {/* Image Wrapper */}
                    <div className="mb-6">
                        <div className="relative w-full h-[555px] rounded-[30px] overflow-hidden bg-gray-200">
                            {post.rasmi ? (
                                <img
                                    src={getBlogImageUrl(post.rasmi)}
                                    alt={post.sarlavha}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-24 h-24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H9l-4 4v-4H5a2 2 0 01-2-2V5z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer stats and actions */}
                    <footer className="flex items-center justify-between flex-wrap gap-y-5 gap-x-10 mb-10">
                        <div className="flex items-center flex-wrap gap-y-5 gap-x-10 text-[22px] sm:text-[24px] lg:text-[28px]">
                            {readingTime && (
                                <div className="flex items-center gap-3 text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22a10 10 0 100-20 10 10 0 000 20z" />
                                    </svg>
                                    <span className="text-gray-600 font-light">O'qish uchun:</span>
                                    <strong className="font-medium text-gray-900">{readingTime}</strong>
                                </div>
                            )}
                            {rating && (
                                <div className="flex items-center gap-3 text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-yellow-500" fill="currentColor">
                                        <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.896 4.664 23.165l1.402-8.168L.132 9.21l8.2-1.192L12 .587z" />
                                    </svg>
                                    <span className="text-gray-600 font-light">Reytingi:</span>
                                    <strong className="font-medium text-gray-900">{rating}</strong>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2v-6H3v6a2 2 0 002 2z" />
                                </svg>
                                <strong className="font-medium text-gray-900">{formatBlogDate(post.chop_sanasi, router.locale)}</strong>
                            </div>
                        </div>

                        <div className="flex items-center gap-5">
                            <button
                                aria-label={bookmarked ? 'Saqlanganni olib tashlash' : 'Saqlab olish'}
                                onClick={toggleBookmark}
                                className="text-gray-800 hover:text-primary transition-colors"
                                title={bookmarked ? 'Saqlangan' : 'Saqlab olish'}
                            >
                                {bookmarked ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                                        <path d="M5 3a2 2 0 00-2 2v16l9-4 9 4V5a2 2 0 00-2-2H5z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12a2 2 0 012 2v16l-8-3-8 3V5a2 2 0 012-2z" />
                                    </svg>
                                )}
                            </button>
                            <button
                                aria-label="Ulashish"
                                onClick={shareLink}
                                className="text-gray-800 hover:text-primary transition-colors"
                                title="Ulashish"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17l10-10M7 7h10v10" />
                                </svg>
                            </button>
                        </div>
                    </footer>

                    {/* Title */}
                    <h1 className="text-[48px] lg:text-[80px] font-medium leading-tight text-gray-900 mb-8">{post.sarlavha}</h1>

                    {/* Content */}
                    <div
                        className="prose prose-lg max-w-none mb-10 text-[#383838]"
                        dangerouslySetInnerHTML={{ __html: blogContentToHtml(post.kontent) }}
                    />

                    {/* Video placeholder then embed */}
                    {post.youtube_havolasi && (
                        <div className="mb-10">
                            {!showVideo ? (
                                <div
                                    role="button"
                                    aria-label="Videoni ijro etish"
                                    className="relative w-full h-[300px] md:h-[450px] lg:h-[534px] rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center"
                                    onClick={() => setShowVideo(true)}
                                >
                                    {youtubeThumb ? (
                                        <img src={youtubeThumb} alt={post.sarlavha} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200" />
                                    )}
                                    <div className="absolute flex items-center justify-center rounded-full text-white" style={{ width: 150, height: 150, background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(5px)' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-16 h-16" fill="currentColor">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative aspect-video bg-gray-200 rounded-2xl overflow-hidden">
                                    <YouTubeEmbed
                                        content={post.youtube_havolasi}
                                        title={post.sarlavha}
                                        className="absolute inset-0 w-full h-full"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Optional image gallery */}
                    {gallery.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                            {gallery.map((img) => (
                                <div key={String(img.id)} className="w-full h-[240px] md:h-[300px] lg:h-[374px] rounded-2xl overflow-hidden bg-gray-200">
                                    <img src={img.url} alt="Gallery image" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer: rating + read complete */}
                    <footer className="flex items-center justify-between flex-wrap gap-6">
                        <div className="flex items-center gap-5">
                            <span className="text-[24px] md:text-[28px] lg:text-[30px] font-normal">Baholang:</span>
                            <div className="flex items-center gap-3 text-[24px] md:text-[26px] lg:text-[28px]">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const active = (hoverRating || currentRating) >= star;
                                    return (
                                        <button
                                            key={star}
                                            type="button"
                                            className="transition-transform hover:scale-110"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                            aria-label={`Reyting ${star}`}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                className={`w-7 h-7 ${active ? 'text-[#FFCC00]' : 'text-gray-300'}`}
                                                fill={active ? 'currentColor' : 'none'}
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            >
                                                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.896 4.664 23.165l1.402-8.168L.132 9.21l8.2-1.192L12 .587z" />
                                            </svg>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={markReadComplete}
                            disabled={readComplete}
                            className={`flex items-center gap-2 px-4 md:px-6 h-[50px] rounded-full font-bold text-white border transition-colors ${readComplete ? 'bg-green-500 border-green-500' : 'bg-primary border-primary hover:bg-[#0aa3ff]'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                                <path d="M2 12l5 5L22 4" />
                            </svg>
                            <span>{readComplete ? "O'qilgan" : "O'qib tugatdim"}</span>
                        </button>
                    </footer>
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
