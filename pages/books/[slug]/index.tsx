import React, { useEffect, useState } from 'react';
import MainLayout from "../../../layouts/MainLayout";
import { wrapper } from "../../../store/store";
import {
    deleteFromSavedNovel,
    fetchAudiosOfNovel,
    fetchNovelOne,
    rateNovel,
    saveNovel,
    fetchNovelsByCategory,
    fetchNovelByDocumentId
} from "../../../store/actions/novel";
import { useAppSelector } from "../../../hooks/reducer";
import classNames from "classnames";
import Link from "next/link";
import Image from 'next/image';
import ThemeButton from "../../../components/Ui/ThemeButton";
import SectionTitle from "../../../components/SectionTitle";
import { useRouter } from "next/router";
import { selectAudioListByLang, selectNovels } from "../../../store/selectors/novel";
import { selectAuth } from "../../../store/selectors/auth";
import AsideBookCard from '../../../components/AsideBookCard';
import ReactStars from "react-rating-stars-component";
import TrackTabList from "../../../components/TrackTabList";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchAdvertisingRight } from "../../../store/actions/advertising";
import SpinnerDots from "../../../components/Ui/SpinnerDots";
import { fetchAuthorOne, fetchNovelsOfAuthor, followAuthor, unfollowAuthor } from "../../../store/actions/author";
import { selectAuthors } from "../../../store/selectors/author";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import NovelCard from "../../../components/NovelCard";
import noPhotoAuthor from "../../../assets/images/noPhotoAvtor.jpg";
import useTranslation from 'next-translate/useTranslation';
import HeadMeta from '../../../components/HeadMeta';
import { formatPublishedDate } from '../../../utils/dateFormatter';
import { useNovelAudioDuration } from '../../../hooks/useAudioDuration';
import GenresSection from '../../../components/GenresSection';
import NovelService from "../../../services/novels";
import { ensureAbsoluteUrl } from '../../../config/api';
import StrapiRichText from '../../../components/StrapiRichText';
import { parseBookipediaMarkdownToBlocks } from '../../../utils/strapiAdapter';

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;
    const slug = encodeURI(ctx.query.slug + '');


    // 1) Try to fetch by current locale
    await dispatch(fetchNovelOne({
        locale: ctx.locale,
        slug: slug,
        opt: {},
        ctx: ctx
    }));

    // 2) If not found, retry with default locale fallback (uz)
    let state = store.getState();
    let novel = state.novelReducer.novel;
    if (!novel && ctx.locale !== 'uz') {
        await dispatch(fetchNovelOne({
            locale: 'uz',
            slug: slug,
            opt: {},
            ctx: ctx
        }));
        state = store.getState();
        novel = state.novelReducer.novel;
    }

    // 3) If still not found, try to resolve by slug without locale to get documentId, then refetch by documentId
    if (!novel) {
        try {
            const res = await NovelService.fetchNovels({
                'filters[slug][$eq]': slug,
                populate: 'muqova'
            }, {}, ctx as any);
            const items = res?.data?.data || [];
            const first = Array.isArray(items) && items.length > 0 ? items[0] : null;
            const documentId = first?.documentId || first?.id;
            if (documentId) {
                await dispatch(fetchNovelByDocumentId({
                    locale: ctx.locale,
                    documentId: String(documentId),
                    opt: {},
                    ctx: ctx
                }));
                let st2 = store.getState();
                let byDoc = st2.novelReducer.novel;
                if (!byDoc && ctx.locale !== 'uz') {
                    await dispatch(fetchNovelByDocumentId({
                        locale: 'uz',
                        documentId: String(documentId),
                        opt: {},
                        ctx: ctx
                    }));
                    st2 = store.getState();
                    byDoc = st2.novelReducer.novel;
                }
                if (!byDoc) {
                    return { notFound: true };
                }
            } else {
                return { notFound: true };
            }
        } catch (e) {
            return { notFound: true };
        }
    }

    // Ensure we read the latest novel from store (after any fallback fetches)
    state = store.getState();
    novel = state.novelReducer.novel;


    // Fetch novels by the first category (same genre) of the current novel
    const firstCategorySlug = novel?.kategoriya && Array.isArray(novel.kategoriya) && novel.kategoriya.length > 0
        ? novel.kategoriya[0].slug
        : null;
    if (firstCategorySlug) {
        await dispatch(fetchNovelsByCategory({
            locale: ctx.locale,
            categorySlug: firstCategorySlug,
            opt: {
                params: {
                    'pagination[pageSize]': 9,
                    'sort[0]': 'createdAt:desc'
                }
            },
            ctx: ctx
        }));
    }

    await dispatch(fetchAdvertisingRight({
        locale: ctx.locale,
        type: 'right'
    }));

    await dispatch(fetchAudiosOfNovel({ locale: ctx.locale, slug: slug }))

    return {
        props: {},
    };
});




const Index = () => {

    const dispatch = useDispatch();
    const { novel, audioList, novels: novelsByCategory } = useAppSelector(selectNovels);
    const { t } = useTranslation('common')


    const { author, novels, loading: authorLoading } = useAppSelector(selectAuthors);

    const { isLogin } = useAppSelector(selectAuth)
    const { ...trackList } = useAppSelector(selectAudioListByLang);
    const { right: asideBanner } = useAppSelector(s => s.advertisingReducer)
    const { locale, query } = useRouter();
    const router = useRouter();

    const { duration: durationH, isLoading: isLoadingDuration } = useNovelAudioDuration(novel, 'hh:mm:ss');
    const [activeTab, setActiveTab] = useState('read');
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const genres = [
        'Fan',
        'Texnika',
        'Badiiy',
        'Ilmiy',
        'Komiks',
        'She’riy',
        'Moliya',
        'Innovatsiya',
    ];
    const [activeGenre, setActiveGenre] = useState<string>('Innovatsiya');


    useEffect(() => {
        if (!novel) {
            return
        }
        const authors = (novel as any)?.mualliflars || (novel.author ? [novel.author] : []);
        const firstAuthor = Array.isArray(authors) && authors.length > 0 ? authors[0] : null;
        const authorSlug = firstAuthor?.slug;

        if (authorSlug) {
            dispatch(fetchAuthorOne({ locale: locale, slug: authorSlug, config: {}, }))
            dispatch(fetchNovelsOfAuthor({
                locale: locale,
                slug: authorSlug
            }))
        }
    }, [novel])


    const sendNovelRating = async (rate) => {
        if (!isLogin) {
            toast.error(t('ratingAuthRequired'), {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
            });
            return
        }
        const slug = encodeURI(novel.slug + '');

        await dispatch(rateNovel({
            locale: locale,
            slug: slug,
            rating: rate
        }))
    }


    const followToAuthor = async (slug) => {
        await dispatch(followAuthor({
            locale: locale,
            slug: slug
        }));
        await dispatch(fetchAuthorOne({ locale: locale, slug: author.slug, config: {}, }));
    }

    const unfollowToAuthor = async (slug) => {
        await dispatch(unfollowAuthor({
            locale: locale,
            slug: slug
        }));
        await dispatch(fetchAuthorOne({ locale: locale, slug: author.slug, config: {}, }));
    }





    const addNovelToMark = async (slug, saved) => {
        if (!saved) {
            await dispatch(saveNovel({
                locale: locale,
                slug: slug
            }))
        } else {
            await dispatch(deleteFromSavedNovel({
                locale: locale,
                slug: slug
            }))
        }
        const authors = (novel as any)?.mualliflars || (novel.author ? [novel.author] : []);
        const firstAuthor = Array.isArray(authors) && authors.length > 0 ? authors[0] : null;
        if (firstAuthor?.slug) {
            await dispatch(fetchNovelsOfAuthor({
                locale: locale,
                slug: firstAuthor.slug
            }))
        }
    }


    const formatPrice = (value: number) => {
        if (value === undefined || value === null) return null;
        try {
            return new Intl.NumberFormat('uz-UZ').format(value) + " so'm";
        } catch (e) {
            return `${value} so'm`;
        }
    }

    const metaTitle = novel ? `${novel.name || novel.nomi} | Gutenberg Audio Kutubxona` : 'Audio Kitob | Gutenberg'
    const authors = (novel as any)?.mualliflars || (novel?.author ? [novel.author] : []) || (novel?.mualliflar ? [novel.mualliflar] : []);
    const authorNames = Array.isArray(authors) && authors.length > 0
        ? authors.map(a => a?.name || a?.ismi).filter(Boolean).join(', ')
        : '';
    const metaDescription = novel ? `${novel.name || novel.nomi}${authorNames ? ` - ${authorNames}` : ''}. ${t('books')} - Gutenberg audio kutubxonasi` : t('books')
    const metaImage = novel?.cover?.src ? ensureAbsoluteUrl(novel.cover.src) : 'https://gutenbergnu.uz/og-default-img.jpg'
    const metaKeywords = novel ? `${novel.name || novel.nomi}${authorNames ? `, ${authorNames}` : ''}, audio kitob, audiokitob, Gutenberg` : 'audio kitob, audiokitob'

    return (
        <MainLayout>
            <HeadMeta
                title={metaTitle}
                description={metaDescription}
                keywords={metaKeywords}
                ogImg={metaImage}
            />

            {
                !novel ?
                    <SpinnerDots />
                    :
                    <div className="container mx-auto px-3">

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
                                <Link href="/books">
                                    <a className="text-primary hover:text-accent transition-colors">
                                        {t('books')}
                                    </a>
                                </Link>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-2 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                                <span className="text-gray-900 font-medium truncate">
                                    {novel ? novel.name : '...'}
                                </span>
                            </nav>
                        </div>

                        <div className="flex justify-center items-center py-10 sm:py-16">
                            <div className="w-full max-w-[1260px] grid grid-cols-1 lg:grid-cols-[430px_1fr] items-center gap-8 lg:gap-20">
                                <div className="cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
                                    {
                                        novel?.cover?.src ?
                                            <img src={novel.cover.src} alt={novel.name} className="w-full h-[555px] rounded-[30px] object-cover bg-gray-300 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-in-out hover:scale-[1.03]" />
                                            :
                                            <div className="w-full h-[555px] rounded-[30px] bg-gray-300" />
                                    }
                                </div>

                                <div className="flex flex-col">
                                    <h1
                                        className="text-[48px] sm:text-[64px] lg:text-[50px] font-bold leading-[0.97] text-[#212121] mb-12"
                                        dangerouslySetInnerHTML={{ __html: novel?.name || '' }}
                                    />

                                    <ul className="list-none p-0 m-0 mb-14 flex flex-col gap-5">
                                        <li className="flex items-center gap-5 text-[18px] sm:text-[22px] lg:text-[28px] font-medium text-[#212121]">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="21" viewBox="0 0 16 21" fill="none">
                                                <path d="M11.3972 12.748C13.8099 13.4075 15.4978 15.4947 15.4978 17.9531V19.9531C15.4978 20.2293 15.274 20.4531 14.9978 20.4531H0.997803C0.721646 20.4531 0.497805 20.2293 0.497803 19.9531V17.9531C0.497803 15.4947 2.18574 13.4075 4.59839 12.748C4.69387 12.7219 4.79506 12.7289 4.91772 12.7842C5.89614 13.2251 6.94052 13.4531 7.9978 13.4531C9.05508 13.4531 10.0995 13.2251 11.0779 12.7842C11.2005 12.7289 11.3017 12.7219 11.3972 12.748ZM10.946 13.7979C9.95385 14.1731 8.98671 14.4531 7.9978 14.4531C7.00889 14.4531 6.04175 14.1731 5.04956 13.7979L4.89038 13.7373L4.72827 13.7871C2.83833 14.3596 1.4978 15.9748 1.4978 17.9531V19.4531H14.4978V17.9531C14.4978 15.9748 13.1573 14.3596 11.2673 13.7871L11.1052 13.7373L10.946 13.7979ZM7.9978 1.45312C10.4831 1.45312 12.4978 3.46787 12.4978 5.95312C12.4978 8.43838 10.4831 10.4531 7.9978 10.4531C5.51255 10.4531 3.4978 8.43838 3.4978 5.95312C3.4978 3.46787 5.51255 1.45312 7.9978 1.45312ZM7.9978 2.45312C6.06476 2.45312 4.4978 4.02008 4.4978 5.95312C4.4978 7.88617 6.06476 9.45312 7.9978 9.45312C9.93084 9.45312 11.4978 7.88617 11.4978 5.95312C11.4978 4.02008 9.93085 2.45312 7.9978 2.45312Z" fill="black" stroke="black" />
                                            </svg>
                                            <span className="text-gray-600 whitespace-nowrap">{Array.isArray((novel as any)?.mualliflars) && (novel as any).mualliflars.length > 1 ? t('authorPluralLabel') : t('authorSingleLabel')}</span>
                                            {
                                                (() => {
                                                    const authors = (novel as any)?.mualliflars || (novel?.author ? [novel.author] : []) || (novel?.mualliflar ? [novel.mualliflar] : []);
                                                    if (Array.isArray(authors) && authors.length > 0) {
                                                        return (
                                                            <strong className="font-semibold flex flex-wrap gap-2">
                                                                {authors.map((author: any, index: number) => (
                                                                    <span key={author?.slug || index} className="flex items-center">
                                                                        <Link href={`/authors/${author?.slug}`}>
                                                                            <a className="text-primary hover:underline">{author?.name || author?.ismi}</a>
                                                                        </Link>
                                                                        {index < authors.length - 1 && <span className="mx-1">,</span>}
                                                                    </span>
                                                                ))}
                                                            </strong>
                                                        );
                                                    }
                                                    return <strong>-</strong>;
                                                })()
                                            }
                                        </li>
                                        <li className="flex items-center gap-5 text-[18px] sm:text-[22px] lg:text-[28px] font-medium text-[#212121]">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 21 18" fill="none">
                                                <path d="M4.01416 -0.00219727C1.80516 -0.00219727 0.0141602 1.7888 0.0141602 3.9978V11.9978C0.0141602 14.2068 1.80516 15.9978 4.01416 15.9978L7.02317 16.0078C7.44917 16.0078 7.89516 16.2038 8.40616 16.6748C8.60516 16.8588 8.84316 17.0888 9.00516 17.3038C9.18516 17.5438 9.42017 18.0008 10.0142 17.9978C10.6082 17.9948 10.8012 17.5908 11.0142 17.3098C11.1752 17.1118 11.3682 16.9228 11.5672 16.7388C12.0792 16.2678 12.5882 15.9978 13.0142 15.9978H16.0142C18.2232 15.9978 20.0142 14.2068 20.0142 11.9978V3.9978C20.0142 1.7888 18.2232 -0.00219727 16.0142 -0.00219727H13.0142C11.8032 -0.00219727 10.7482 0.553808 10.0142 1.40381C9.28017 0.553808 8.22517 -0.00219727 7.01416 -0.00219727H4.01416ZM4.01416 1.9978H7.01416C8.11917 1.9978 9.01417 2.8928 9.01417 3.9978L9.02018 14.6468C8.39618 14.2418 7.72617 13.9978 7.01416 13.9978H4.01416C2.90916 13.9978 2.01416 13.1028 2.01416 11.9978V3.9978C2.01416 2.8928 2.90916 1.9978 4.01416 1.9978ZM13.0142 1.9978H16.0142C17.1192 1.9978 18.0142 2.8928 18.0142 3.9978V11.9978C18.0142 13.1028 17.1192 13.9978 16.0142 13.9978H13.0142C12.3022 13.9978 11.6342 14.2548 11.0102 14.6598L11.0142 3.9978C11.0142 2.8928 11.9092 1.9978 13.0142 1.9978Z" fill="black" />
                                            </svg>
                                            <span className="text-gray-600">{t('genreLabel')}</span>
                                            <strong>{Array.isArray(novel?.genre) ? novel.genre.join(', ') : '-'}</strong>
                                        </li>
                                        <li className="flex items-center gap-5 text-[18px] sm:text-[22px] lg:text-[28px] font-medium text-[#212121]">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17" fill="none">
                                                <path d="M2.9989 0.90625C1.342 0.90625 -0.00109863 2.24935 -0.00109863 3.90625V13.6562C-0.00109863 15.4511 1.454 16.9062 3.2489 16.9062H16.7489C18.5438 16.9062 19.9989 15.4511 19.9989 13.6562V5.90625C19.9989 5.35395 19.5512 4.90625 18.9989 4.90625H17.9989V1.90625C17.9989 1.35395 17.5512 0.90625 16.9989 0.90625H2.9989ZM2.9989 2.90625H15.9989V4.90625H2.9989C2.4466 4.90625 1.9989 4.45855 1.9989 3.90625C1.9989 3.35395 2.4466 2.90625 2.9989 2.90625ZM2.9989 6.90625H17.9989V13.6562C17.9989 14.3466 17.4392 14.9062 16.7489 14.9062H3.2489C2.5585 14.9062 1.9989 14.3466 1.9989 13.6562L2.0047 6.73035C2.0047 6.73035 2.3627 6.90935 2.9989 6.90625ZM14.9989 9.90625C14.4466 9.90625 13.9989 10.3539 13.9989 10.9062C13.9989 11.4585 14.4466 11.9062 14.9989 11.9062C15.5512 11.9062 15.9989 11.4585 15.9989 10.9062C15.9989 10.3539 15.5512 9.90625 14.9989 9.90625Z" fill="black" />
                                            </svg>
                                            <span className="text-gray-600">{t('priceLabel')}</span>
                                            <strong>{formatPrice((novel as any)?.narxi) || '-'}</strong>
                                        </li>
                                        <li className="flex items-center gap-5 text-[18px] sm:text-[22px] lg:text-[28px] font-medium text-[#212121]">
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000" version="1.1" id="Capa_1" width="20" height="20" viewBox="0 0 433.328 433.328" xmlSpace="preserve">
                                                <g>
                                                    <g>
                                                        <rect x="224.024" y="62.608" width="12.716" height="306.88" />
                                                        <rect x="287.958" y="60.094" width="29.91" height="309.395" />
                                                        <polygon points="258.059,60.094 257.909,60.094 257.909,62.608 243.112,62.608 243.112,369.488 258.059,369.488   " />
                                                        <rect x="332.172" y="60.094" width="12.728" height="309.395" />
                                                        <rect x="370.369" y="60.094" width="25.443" height="309.395" />
                                                        <rect x="38.443" y="60.094" width="12.72" height="309.395" />
                                                        <rect x="57.535" y="60.094" width="14.95" height="309.395" />
                                                        <path d="M0,35.489v362.35h433.328V35.489H0z M422.123,386.633H11.207V46.696h410.916V386.633z" />
                                                        <rect x="146.596" y="60.094" width="12.73" height="309.395" />
                                                        <polygon points="210.232,62.608 210.194,62.608 210.194,60.094 184.788,60.094 184.788,369.488 210.232,369.488   " />
                                                        <rect x="102.379" y="60.094" width="29.916" height="309.395" />
                                                    </g>
                                                </g>
                                            </svg>
                                            <span className="text-gray-600">{t('isbnLabel')}</span>
                                            <strong>{(novel as any)?.ISBN || '-'}</strong>
                                        </li>
                                    </ul>

                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 w-full sm:w-auto">
                                        <a
                                            href={(novel as any)?.sotib_olish || "#"}
                                            target={(novel as any)?.sotib_olish ? "_blank" : "_self"}
                                            rel={(novel as any)?.sotib_olish ? "noopener noreferrer" : undefined}
                                            className="inline-flex items-center justify-center px-4 py-3 sm:px-6 lg:px-8 rounded-[75px] text-white font-semibold text-[16px] sm:text-[18px] lg:text-[20px] xl:text-[22px] bg-[#58BB43] shadow-[0_10px_20px_-5px_rgba(88,187,67,0.4)] hover:shadow-[0_10px_25px_-5px_rgba(88,187,67,0.6)] transition-all duration-300 hover:scale-[1.02] w-full sm:w-auto"
                                        >
                                            <span>{t('buy')}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none" className="ml-2 flex-shrink-0">
                                                <path d="M1.6313 1.68437L13.6313 1.68437M13.6313 1.68437L13.6313 13.6844M13.6313 1.68437L2 13.3157" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </a>
                                        <a href="#" className="inline-flex items-center justify-center px-4 py-3 sm:px-6 lg:px-8 rounded-[75px] font-semibold text-[16px] sm:text-[18px] lg:text-[20px] xl:text-[22px] text-[#AE00FF] border border-[#AE00FF] bg-[rgba(174,0,255,0.1)] hover:bg-[rgba(174,0,255,0.2)] transition-all duration-300 hover:scale-[1.02] w-full sm:w-auto">
                                            <span>{t('gift')}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none" className="ml-2 flex-shrink-0">
                                                <path d="M1.6313 1.68437L13.6313 1.68437M13.6313 1.68437L13.6313 13.6844M13.6313 1.68437L2 13.3157" stroke="#AE00FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {isImageModalOpen && (
                                <div className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-5" onClick={() => setIsImageModalOpen(false)}>
                                    {novel?.cover?.src && (
                                        <img src={novel.cover.src} alt={novel.name} className="max-w-[90%] max-h-[90vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Genres Section */}
                        <GenresSection genres={genres} activeGenre={activeGenre} onSelect={setActiveGenre} />

                        {/* About Work Section (Description + Gallery) */}
                        <div className="flex justify-center py-10 lg:py-16 bg-[#fdfdff]">
                            <div className="w-full max-w-[1240px] px-3">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10 gap-5">
                                    <h2 className="text-[48px] lg:text-[64px] font-normal text-[#212121]">{t('aboutWork')}</h2>

                                    {/* Tugmalar qatori */}
                                    <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                                        {novel?.Fragment?.url ? (
                                            <a
                                                href={ensureAbsoluteUrl(novel.Fragment.url)}
                                                download={novel.Fragment.name || 'fragment.pdf'}
                                                className="inline-flex items-center justify-center px-6 py-3 gap-4 bg-[#EB0000] rounded-[75px] text-white no-underline text-[18px] sm:text-[20px] lg:text-[22px] font-semibold transition hover:shadow-[0_10px_20px_-5px_rgba(235,0,0,0.4)] whitespace-nowrap"
                                            >
                                                <span>{t('fragmentDownload')}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                    <path d="M1.6313 1.68437L13.6313 1.68437M13.6313 1.68437L13.6313 13.6844M13.6313 1.68437L2 13.3157" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </a>
                                        ) : (
                                            <a href="#" className="inline-flex items-center justify-center px-6 py-3 gap-4 bg-[#EB0000] rounded-[75px] text-white no-underline text-[18px] sm:text-[20px] lg:text-[22px] font-semibold transition hover:shadow-[0_10px_20px_-5px_rgba(235,0,0,0.4)] whitespace-nowrap">
                                                <span>{t('fragmentRead')}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                    <path d="M1.6313 1.68437L13.6313 1.68437M13.6313 1.68437L13.6313 13.6844M13.6313 1.68437L2 13.3157" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </a>
                                        )}

                                        {/* Ilova yuklab olish tugmasi */}
                                        {novel?.Ilova?.url && (
                                            <a
                                                href={ensureAbsoluteUrl(novel.Ilova.url)}
                                                download={novel.Ilova.name || 'ilova.pdf'}
                                                className="inline-flex items-center justify-center px-6 py-3 gap-4 bg-[#4CAF50] rounded-[75px] text-white no-underline text-[18px] sm:text-[20px] lg:text-[22px] font-semibold transition hover:shadow-[0_10px_20px_-5px_rgba(76,175,80,0.4)] whitespace-nowrap"
                                            >
                                                <span>{t('appendixDownload')}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                    <path d="M1.6313 1.68437L13.6313 1.68437M13.6313 1.68437L13.6313 13.6844M13.6313 1.68437L2 13.3157" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </div>


                                <StrapiRichText
                                    content={parseBookipediaMarkdownToBlocks((novel as any)?.tavsifi || '')}
                                    className="text-[20px] md:text-[22px] lg:text-[26px] leading-relaxed text-justify text-[#383838]"
                                    variant="detailed"
                                />
                            </div>
                        </div>

                        <div className="container mx-auto px-3 mt-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 sm:mb-16 lg:mb-20 gap-4 sm:gap-5">
                                <h2 className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] font-normal text-[#212121] leading-tight">{t('similarByGenre')}</h2>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 lg:gap-4 w-full sm:w-auto">
                                    <a href="#" className="inline-flex items-center justify-center px-4 py-3 sm:px-5 lg:px-6 gap-3 sm:gap-4 bg-[#EB0000] rounded-[75px] text-white no-underline text-[16px] sm:text-[18px] lg:text-[20px] font-semibold transition-all duration-300 hover:scale-[1.02] sm:hover:scale-[1.05] hover:shadow-[0_10px_20px_-5px_rgba(235,0,0,0.4)] w-full sm:w-auto">
                                        <span>{t('goToSection')}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0">
                                            <path d="M1.6313 1.68437L13.6313 1.68437M13.6313 1.68437L13.6313 13.6844M13.6313 1.68437L2 13.3157" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </a>
                                    <a href="#" className="inline-flex items-center justify-center px-4 py-3 sm:px-5 lg:px-6 h-[48px] sm:h-[52px] lg:h-[60px] rounded-[75px] text-[16px] sm:text-[18px] lg:text-[20px] font-normal bg-[rgba(0,157,255,0.1)] text-[#009DFF] border border-[#009DFF] transition-all duration-300 hover:bg-[rgba(0,157,255,0.2)] hover:scale-[1.02] w-full sm:w-auto">
                                        {t('all')}
                                    </a>
                                </div>
                            </div>

                            {novelsByCategory.results && novelsByCategory.results.length > 0 && (
                                <Swiper
                                    slidesPerView={1.5}
                                    spaceBetween={20}
                                    navigation={false}
                                    modules={[Navigation]}
                                    className='mb-6'
                                    breakpoints={{
                                        768: {
                                            slidesPerView: 3,
                                            spaceBetween: 20,
                                            navigation: true,
                                        },
                                        1024: {
                                            slidesPerView: 3,
                                            spaceBetween: 20,
                                            navigation: true,
                                        },
                                        1280: {
                                            slidesPerView: 3,
                                            spaceBetween: 20,
                                            navigation: true,
                                        },
                                    }}
                                >
                                    {novelsByCategory.results
                                        .filter(item => item.slug !== novel.slug)
                                        .map((item) => (
                                            <SwiperSlide key={item.slug} className='col-span-1'>
                                                <Link href={`/books/${item.slug}`}>
                                                    <a className="block no-underline group">
                                                        <div className="mb-6">
                                                            <img
                                                                src={item?.cover?.src || 'https://placehold.co/400x547/e0e0e0/e0e0e0'}
                                                                alt={item?.name || 'book'}
                                                                className="w-full h-[320px] sm:h-[420px] lg:h-[547px] rounded-[30px] bg-[#C4C4C4] object-cover"
                                                            />
                                                        </div>
                                                        <div className="px-4">
                                                            <h3 className="text-[24px] font-medium text-[#212121] mb-2 truncate transition-colors group-hover:text-[#009DFF]">{item?.name}</h3>
                                                            <p className="text-[20px] font-normal text-[#383838] truncate transition-colors group-hover:text-[#009DFF]">
                                                                {(() => {
                                                                    const authors = (item as any)?.mualliflars || (item?.author ? [item.author] : []) || (item?.mualliflar ? [item.mualliflar] : []);
                                                                    if (Array.isArray(authors) && authors.length > 0) {
                                                                        return authors.map((a: any) => a?.name || a?.ismi).filter(Boolean).join(', ') || '-';
                                                                    }
                                                                    return '-';
                                                                })()}
                                                            </p>
                                                        </div>
                                                    </a>
                                                </Link>
                                            </SwiperSlide>
                                        ))}
                                </Swiper>
                            )}

                        </div>

                    </div>
            }

        </MainLayout>
    );
}

export default Index;
