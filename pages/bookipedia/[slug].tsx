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
import { formatDateDayMonthYearDots } from '../../utils/dateFormatter';
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

    // Compute reading time from content blocks (approx. 200 wpm), supports nested structures
    const readingTime = useMemo(() => {
        if (!post?.kontent || !Array.isArray(post.kontent)) return null;

        const extractText = (node: any): string => {
            if (!node) return '';
            if (typeof node === 'string') return node;
            if (Array.isArray(node)) return node.map(extractText).join(' ');
            if (typeof node === 'object') {
                if (typeof node.text === 'string') return node.text;
                if (node.children) return extractText(node.children);
            }
            return '';
        };

        const allText = extractText(post.kontent).trim();
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
                    <div className="mt-4 sm:mt-5 mb-6">
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
                    <footer className="flex items-center justify-between flex-wrap gap-y-3 gap-x-4 sm:gap-y-4 sm:gap-x-6 md:gap-x-8 mb-6 sm:mb-8">
                        <div className="flex items-center flex-wrap gap-y-3 gap-x-3 sm:gap-y-4 sm:gap-x-4 md:gap-x-6 text-sm sm:text-base md:text-lg">
                            {readingTime && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5">
                                    <path d="M11.6667 0.333252C5.2234 0.333252 0 5.55642 0 11.9999C0 18.4434 5.22328 23.6666 11.6667 23.6666C18.1099 23.6666 23.3333 18.4434 23.3333 11.9999C23.3333 5.55642 18.1099 0.333252 11.6667 0.333252ZM11.6667 2.66659C16.8214 2.66659 21 6.84558 21 11.9999C21 17.1543 16.8214 21.3333 11.6667 21.3333C6.51198 21.3333 2.33333 17.1543 2.33333 11.9999C2.33333 6.84558 6.51198 2.66659 11.6667 2.66659ZM11.6667 4.99992C11.0223 4.99992 10.5 5.52258 10.5 6.16658V11.9999C10.5 12.3091 10.6093 12.6194 10.8281 12.8387L14.3281 16.3387C14.7838 16.7937 15.5496 16.7937 16.0053 16.3387C16.4608 15.8826 16.4608 15.1173 16.0053 14.6611L12.8333 11.4889V6.16658C12.8333 5.52258 12.311 4.99992 11.6667 4.99992Z" fill="black"/>
                                    </svg>
                                    <span className="text-gray-900 font-medium ">O'qish uchun:</span>
                                    <strong className="font-light text-gray-900">{readingTime}</strong>
                                </div>
                            )}
                            {rating && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5">
                                    <path d="M12.6505 0.828613C11.9844 0.82838 11.3043 1.24278 10.9014 2.06762L8.42352 7.1691L2.77545 7.97072C0.95907 8.22342 0.370603 10.0054 1.68229 11.2864L5.76341 15.2589L4.81607 20.8344C4.5041 22.6392 6.00105 23.7301 7.6219 22.8749C8.24817 22.5436 11.4683 20.8752 12.6505 20.2511L17.679 22.8749C19.3018 23.7301 20.8034 22.6404 20.4849 20.8344L19.501 15.2589L23.5823 11.2864C24.9001 10.0101 24.342 8.22855 22.5255 7.97072L16.841 7.1691L14.3995 2.06762C13.9973 1.24243 13.3165 0.828963 12.6505 0.828613ZM12.6505 3.85308L15.0554 8.77245C15.2251 9.12047 15.5467 9.33758 15.93 9.39195L21.3959 10.1932L17.424 14.0199C17.146 14.2894 17.0289 14.6592 17.0961 15.0395L18.0435 20.433L13.1971 17.8827C12.8566 17.7031 12.4442 17.7031 12.1039 17.8827C11.4992 18.2012 8.54381 19.754 7.25744 20.433L8.16849 15.0769C8.2337 14.6977 8.11506 14.2882 7.84054 14.0199L3.90502 10.1932L9.33446 9.42835C9.71876 9.37491 10.0752 9.12105 10.2455 8.77245L12.6505 3.85308Z" fill="black"/>
                                    </svg>
                                    <span className="text-gray-900 font-medium">Reytingi:</span>
                                    <strong className="font-light text-gray-900">{rating}</strong>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 23" fill="none" className="w-4 h-4 sm:w-5 sm:h-5">
                            <path d="M6.63576 0.349854C5.93449 0.349854 5.36603 0.87252 5.36603 1.51652C2.5598 1.51652 0.287109 3.60719 0.287109 6.18319V8.51652V17.8499C0.287109 20.4259 2.56107 22.5165 5.36603 22.5165H18.0633C20.8682 22.5165 23.1422 20.427 23.1422 17.8499V8.51652V6.18319C23.1422 3.61069 20.8669 1.51652 18.0633 1.51652C18.0633 0.87252 17.4945 0.349854 16.7936 0.349854C16.0927 0.349854 15.5239 0.87252 15.5239 1.51652H7.90549C7.90549 0.87252 7.33703 0.349854 6.63576 0.349854ZM5.36603 3.84985C5.36603 4.49385 5.93449 5.01652 6.63576 5.01652C7.33703 5.01652 7.90549 4.49385 7.90549 3.84985H15.5239C15.5239 4.49385 16.0927 5.01652 16.7936 5.01652C17.4945 5.01652 18.0633 4.49385 18.0633 3.84985C19.4613 3.84985 20.6028 4.89052 20.6028 6.18319V7.34985C18.1573 7.34985 5.27156 7.34985 2.82657 7.34985V6.18319C2.82657 4.89752 3.95968 3.84985 5.36603 3.84985ZM2.82657 9.68319C5.27016 9.68319 18.1586 9.68319 20.6028 9.68319V17.8499C20.6028 19.1367 19.4664 20.1832 18.0633 20.1832H5.36603C3.96349 20.1832 2.82657 19.139 2.82657 17.8499V9.68319ZM6.63576 12.0165C5.93449 12.0165 5.36603 12.5392 5.36603 13.1832C5.36603 13.8272 5.93449 14.3499 6.63576 14.3499C7.33703 14.3499 7.90549 13.8272 7.90549 13.1832C7.90549 12.5392 7.33703 12.0165 6.63576 12.0165ZM11.7147 12.0165C11.0138 12.0165 10.4449 12.5392 10.4449 13.1832C10.4449 13.8272 11.0138 14.3499 11.7147 14.3499C12.4156 14.3499 12.9844 13.8272 12.9844 13.1832C12.9844 12.5392 12.4156 12.0165 11.7147 12.0165ZM16.7936 12.0165C16.0927 12.0165 15.5239 12.5392 15.5239 13.1832C15.5239 13.8272 16.0927 14.3499 16.7936 14.3499C17.4945 14.3499 18.0633 13.8272 18.0633 13.1832C18.0633 12.5392 17.4945 12.0165 16.7936 12.0165ZM6.63576 15.5165C5.93449 15.5165 5.36603 16.0392 5.36603 16.6832C5.36603 17.3272 5.93449 17.8499 6.63576 17.8499C7.33703 17.8499 7.90549 17.3272 7.90549 16.6832C7.90549 16.0392 7.33703 15.5165 6.63576 15.5165ZM11.7147 15.5165C11.0138 15.5165 10.4449 16.0392 10.4449 16.6832C10.4449 17.3272 11.0138 17.8499 11.7147 17.8499C12.4156 17.8499 12.9844 17.3272 12.9844 16.6832C12.9844 16.0392 12.4156 15.5165 11.7147 15.5165ZM16.7936 15.5165C16.0927 15.5165 15.5239 16.0392 15.5239 16.6832C15.5239 17.3272 16.0927 17.8499 16.7936 17.8499C17.4945 17.8499 18.0633 17.3272 18.0633 16.6832C18.0633 16.0392 17.4945 15.5165 16.7936 15.5165Z" fill="black"/>
                            </svg>
                                <strong className="font-light text-gray-900">{formatDateDayMonthYearDots(post.chop_sanasi)}</strong>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 22 24" fill="none">
                                    <path d="M5.99884 0.349854C2.75849 0.349854 0.919922 2.03884 0.919922 5.01652V22.5165C0.919922 23.3541 1.86715 23.9038 2.70517 23.5738L11.0778 20.2926L19.4504 23.5738C20.2884 23.9038 21.2356 23.3541 21.2356 22.5165V5.01652C21.2356 1.95589 19.5786 0.349854 16.1567 0.349854H5.99884ZM5.99884 2.68319H16.1567C18.1451 2.68319 18.6961 3.2174 18.6961 5.01652V20.7665L11.5933 17.9593C11.2746 17.8334 10.8809 17.8334 10.5622 17.9593L3.45938 20.7665V5.01652C3.45938 3.32754 4.16027 2.68319 5.99884 2.68319ZM11.0778 6.18319C10.3769 6.18319 9.80803 6.7055 9.80803 7.34985V9.68319H7.26857C6.56768 9.68319 5.99884 10.2055 5.99884 10.8499C5.99884 11.4942 6.56768 12.0165 7.26857 12.0165H9.80803V14.3499C9.80803 14.9942 10.3769 15.5165 11.0778 15.5165C11.7787 15.5165 12.3475 14.9942 12.3475 14.3499V12.0165H14.887C15.5878 12.0165 16.1567 11.4942 16.1567 10.8499C16.1567 10.2055 15.5878 9.68319 14.887 9.68319H12.3475V7.34985C12.3475 6.7055 11.7787 6.18319 11.0778 6.18319Z" fill="black"/>
                                </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 22 24" fill="none">
                                        <path d="M5.99884 0.349854C2.75849 0.349854 0.919922 2.03884 0.919922 5.01652V22.5165C0.919922 23.3541 1.86715 23.9038 2.70517 23.5738L11.0778 20.2926L19.4504 23.5738C20.2884 23.9038 21.2356 23.3541 21.2356 22.5165V5.01652C21.2356 1.95589 19.5786 0.349854 16.1567 0.349854H5.99884ZM5.99884 2.68319H16.1567C18.1451 2.68319 18.6961 3.2174 18.6961 5.01652V20.7665L11.5933 17.9593C11.2746 17.8334 10.8809 17.8334 10.5622 17.9593L3.45938 20.7665V5.01652C3.45938 3.32754 4.16027 2.68319 5.99884 2.68319ZM11.0778 6.18319C10.3769 6.18319 9.80803 6.7055 9.80803 7.34985V9.68319H7.26857C6.56768 9.68319 5.99884 10.2055 5.99884 10.8499C5.99884 11.4942 6.56768 12.0165 7.26857 12.0165H9.80803V14.3499C9.80803 14.9942 10.3769 15.5165 11.0778 15.5165C11.7787 15.5165 12.3475 14.9942 12.3475 14.3499V12.0165H14.887C15.5878 12.0165 16.1567 11.4942 16.1567 10.8499C16.1567 10.2055 15.5878 9.68319 14.887 9.68319H12.3475V7.34985C12.3475 6.7055 11.7787 6.18319 11.0778 6.18319Z" fill="rgb(235 0 0)"/>
                                    </svg>
                                )}
                            </button>
                            <button
                                aria-label="Ulashish"
                                onClick={shareLink}
                                className="text-gray-800 hover:text-primary transition-colors"
                                title="Ulashish"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none">
                                <path d="M15.561 21.4892C18.3658 21.4892 20.6399 19.3997 20.6399 16.8226V13.3226C20.6399 12.6786 20.071 12.1559 19.3702 12.1559C18.6693 12.1559 18.1004 12.6786 18.1004 13.3226V16.8226C18.1004 18.1117 16.964 19.1559 15.561 19.1559H5.40313C4.00008 19.1559 2.86368 18.1117 2.86368 16.8226V7.48925C2.86368 6.20009 4.00008 5.15592 5.40313 5.15592H9.21232C9.91321 5.15592 10.4821 4.63325 10.4821 3.98925C10.4821 3.34526 9.91321 2.82259 9.21232 2.82259H5.40313C2.5983 2.82259 0.324219 4.91209 0.324219 7.48925V16.8226C0.324219 19.3997 2.5983 21.4892 5.40313 21.4892H15.561ZM10.4821 13.3226C10.8071 13.3226 11.1461 13.2222 11.395 12.9947L20.6399 4.4991V8.65592H23.1793V1.65592C23.1793 1.01192 22.6105 0.489258 21.9096 0.489258H14.2912V2.82259H18.814L9.56912 11.3171C9.07393 11.7733 9.07393 12.5386 9.56912 12.9947C9.81799 13.2222 10.157 13.3226 10.4821 13.3226Z" fill="black"/>
                                </svg>
                            </button>
                        </div>
                    </footer>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium leading-tight text-gray-900 mb-6 sm:mb-8">{post.sarlavha}</h1>

                    {/* Content */}
                    <div
                        className="prose prose-base sm:prose-lg md:prose-xl lg:prose-2xl max-w-none mb-10 text-[#383838] text-justify leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: blogContentToHtml(post.kontent) }}
                    />

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
                    <footer className="flex items-center justify-between flex-wrap gap-4 sm:gap-6">
                        <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal">Baholang:</span>
                            <div className="flex items-center gap-2 sm:gap-3">
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
                                                className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${active ? 'text-[#FFCC00]' : 'text-gray-300'}`}
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
                            className={`flex items-center gap-2 px-3 sm:px-4 md:px-6 h-10 sm:h-12 md:h-[50px] rounded-full font-bold text-sm sm:text-base md:text-lg text-white border transition-colors ${readComplete ? 'bg-green-500 border-green-500' : 'bg-primary border-primary hover:bg-[#0aa3ff]'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="13" viewBox="0 0 22 13" fill="none">
                            <path d="M14.6825 0.496429C14.4051 0.496429 14.1494 0.623192 13.9382 0.834442L4.45901 10.28C4.17951 10.5595 3.89891 10.5411 3.68008 10.2128L2.15583 7.94435C1.82433 7.4471 1.1635 7.30734 0.66733 7.63993C0.170078 7.97143 0.0303301 8.63118 0.361831 9.12951L1.88499 11.3969C2.86216 12.8638 4.77101 13.0501 6.01576 11.8043L15.4614 2.35867C15.8839 1.93509 15.8839 1.25803 15.4614 0.834442C15.2501 0.623192 14.9598 0.496429 14.6825 0.496429ZM20.7762 0.496429C20.4989 0.496429 20.2086 0.589603 19.9973 0.800853C19.9973 0.800853 8.78911 11.9798 8.65586 12.0751C9.68287 12.8302 11.0814 12.7998 12.0759 11.8043L21.5551 2.35867C21.9776 1.93509 21.9776 1.22444 21.5551 0.800853C21.3439 0.589603 21.0536 0.496429 20.7762 0.496429Z" fill="white"/>
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
