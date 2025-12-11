import React from 'react';
import MainLayout from "../../../layouts/MainLayout";
import {wrapper} from "../../../store/store";
import {
    fetchAuthorOne,
    fetchAuthors,
    fetchNovelsOfAuthor,
    followAuthor,
    unfollowAuthor
} from "../../../store/actions/author";
import {useAppSelector} from "../../../hooks/reducer";
import {selectAuthors} from "../../../store/selectors/author";
import Image from 'next/image';
import ThemeButton from '../../../components/Ui/ThemeButton';
import SectionTitle from '../../../components/SectionTitle';
import NovelCard from '../../../components/NovelCard';
import Pagination from '../../../components/Ui/Pagination';
import SectionListWrapper from "../../../components/SectionListWrapper";
import AuthorsListSection from "../../../components/AuthorsListSection";
import noPhoto from '../../../assets/images/noPhotoAvtor.jpg';
import useTranslation from "next-translate/useTranslation";
import {selectAuth} from "../../../store/selectors/auth";
import {deleteFromSavedNovel, saveNovel} from "../../../store/actions/novel";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import HeadMeta from '../../../components/HeadMeta';
import Link from 'next/link';
import styles from './style.module.scss';
import { extractYouTubeVideoId } from '../../../utils/strapiAdapter';
import TestimonialsSection from '../../../components/TestimonialsSection';

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;


    const slug = encodeURI(ctx.query.slug + '');
    await dispatch(fetchAuthorOne({locale: ctx.locale, slug: slug, ctx}));

    await dispatch(fetchAuthors({locale: ctx.locale}));
    await dispatch(fetchNovelsOfAuthor({locale: ctx.locale, slug: slug, config: {
        params: {
            p: ctx.query.p
        }
    }, ctx}))

    return {
        props: {},
    };
});



const Index = () => {

    const {author, authors, loading, novels: {results, ...meta}} = useAppSelector(selectAuthors)
    const {isLogin} = useAppSelector(selectAuth)
    const dispatch = useDispatch();
    const {locale} = useRouter();
    const { t } = useTranslation('common')


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
        await dispatch(fetchNovelsOfAuthor({
            locale: locale,
            slug: author.slug
        }))
}

    const followToAuthor = async (slug) => {
        await dispatch(followAuthor({
            locale: locale,
            slug: slug
        }));
        await dispatch(fetchAuthorOne({locale: locale, slug: author.slug, config: {},}));
    }

    const unfollowToAuthor = async (slug) => {
        await dispatch(unfollowAuthor({
            locale: locale,
            slug: slug
        }));
        await dispatch(fetchAuthorOne({locale: locale, slug: author.slug, config: {},}));
    }

    if(!author){
        return <div>RENDER ON SERVER!</div>
    }


    const metaTitle = `${author.name} | Gutenberg Muallif`
    const metaDescription = author.biography ? `${author.name} - ${author.biography.substring(0, 150)}...` : `${author.name} - Gutenberg birinchi raqamli biznes adabiyotlarining muallifi`
    const metaImage = author?.photo?.src || 'https://gutenbergnu.uz/og-default-img.jpg'
    const metaKeywords = `${author.name}, muallif, yozuvchi, Gutenberg mualliflar`

    return (
        <MainLayout>
            <HeadMeta 
                title={metaTitle}
                description={metaDescription}
                keywords={metaKeywords}
                ogImg={metaImage}
            />
            <div className="container mx-auto px-3 mb-6">
                {/* Breadcrumb Navigation */}
                <div className="mb-4 mt-2 sm:mt-2">
                    <nav className="flex items-center text-sm text-gray-600">
                        <Link href="/">
                            <a className="text-primary hover:text-accent transition-colors">{t('home')}</a>
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-2 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        <Link href="/authors">
                            <a className="text-primary hover:text-accent transition-colors">{t('authorsPage')}</a>
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-2 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        <span className="text-gray-900 font-medium truncate">{author ? author.name : '...'}</span>
                    </nav>
                </div>
                </div>

            {/* Author Hero Section */}
            <section className={styles.authorHero}>
                <div className={`container mx-auto px-3 ${styles.heroContainer}`}>
                    {/* Left: Image */}
                    <div className={styles.authorImageWrapper}>
                        <div className={styles.authorImage}>
                                {
                                    author.photo ?
                                        <Image src={author.photo.src} layout='fill' alt={author.name} objectFit='cover'/>
                                    :
                                        <Image src={noPhoto} layout='fill' alt={author.name} objectFit='cover'/>
                                }
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className={styles.authorDetails}>
                        <h1 className={styles.authorName} dangerouslySetInnerHTML={{__html: author.name}} />

                        <ul className={styles.authorStats}>
                            {[
                                { icon: 'book', label: "Yo'nalish", value: (author as any)?.Yonalish || '-' },
                                { icon: 'map', label: "Tug'ilgan joyi", value: (author as any)?.Tugulgan_joy || '-' },
                                { icon: 'clock', label: 'Yillar', value: (author as any)?.Yillar || '-' },
                                { icon: 'star', label: 'Reytingi', value: (author as any)?.Reyting ?? '-' },
                            ].map((stat) => (
                                <li key={stat.label} className={styles.authorStatItem}>
                                    <span className={styles.statIcon}>
                                        {stat.icon === 'book' && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none">
                                                <path d="M5.01628 0.664062C2.43911 0.664062 0.349609 2.75356 0.349609 5.33073V14.6641C0.349609 17.2412 2.43911 19.3307 5.01628 19.3307L8.52679 19.3424C9.02379 19.3424 9.54411 19.571 10.1403 20.1205C10.3724 20.3352 10.6501 20.6036 10.8391 20.8544C11.0491 21.1344 11.3233 21.6675 12.0163 21.664C12.7093 21.6605 12.9345 21.1892 13.183 20.8614C13.3708 20.6304 13.596 20.4099 13.8281 20.1952C14.4255 19.6457 15.0193 19.3307 15.5163 19.3307H19.0163C21.5935 19.3307 23.683 17.2412 23.683 14.6641V5.33073C23.683 2.75356 21.5935 0.664062 19.0163 0.664062H15.5163C14.1035 0.664062 12.8726 1.31274 12.0163 2.3044C11.16 1.31274 9.92912 0.664062 8.51628 0.664062H5.01628ZM5.01628 2.99739H8.51628C9.80545 2.99739 10.8496 4.04156 10.8496 5.33073L10.8566 17.7545C10.1286 17.282 9.34695 16.9974 8.51628 16.9974H5.01628C3.72711 16.9974 2.68294 15.9532 2.68294 14.6641V5.33073C2.68294 4.04156 3.72711 2.99739 5.01628 2.99739ZM15.5163 2.99739H19.0163C20.3055 2.99739 21.3496 4.04156 21.3496 5.33073V14.6641C21.3496 15.9532 20.3055 16.9974 19.0163 16.9974H15.5163C14.6856 16.9974 13.9063 17.2972 13.1783 17.7697L13.183 5.33073C13.183 4.04156 14.2271 2.99739 15.5163 2.99739Z" fill="black"/>
                                            </svg>
                                        )}
                                        {stat.icon === 'map' && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 20 24" fill="none">
                                                <path d="M9.99739 0.349854C4.84271 0.349854 0.664062 4.52884 0.664062 9.68317C0.664062 13.728 3.2865 18.3305 6.82546 22.1525C6.9398 22.275 7.03231 22.3706 7.15364 22.4803C8.15464 23.3775 9.19309 23.6948 9.99739 23.6831C10.0075 23.6831 10.0256 23.6831 10.0338 23.6831C10.8709 23.6831 12.0513 23.3063 13.1693 22.1886C16.5643 18.7936 19.3307 13.7875 19.3307 9.68317C19.3307 4.52884 15.1521 0.349854 9.99739 0.349854ZM9.99739 2.68318C13.8634 2.68318 16.9974 5.81684 16.9974 9.68317C16.9974 13.0502 14.4917 17.5115 11.4921 20.511C10.8601 21.1433 10.2949 21.3498 9.99739 21.3498C9.97266 21.3498 9.95504 21.3498 9.96099 21.3498C9.69569 21.3533 9.23264 21.225 8.72129 20.7665C8.65363 20.7058 8.56799 20.6183 8.50266 20.5472C5.32839 17.1207 2.9974 12.9883 2.9974 9.68317C2.9974 5.81684 6.13141 2.68318 9.99739 2.68318ZM9.99739 6.18317C8.06434 6.18317 6.49739 7.75 6.49739 9.68317C6.49739 11.6163 8.06434 13.1832 9.99739 13.1832C11.9304 13.1832 13.4974 11.6163 13.4974 9.68317C13.4974 7.75 11.9304 6.18317 9.99739 6.18317ZM9.99739 8.5165C10.6417 8.5165 11.1641 9.03917 11.1641 9.68317C11.1641 10.3272 10.6417 10.8498 9.99739 10.8498C9.35304 10.8498 8.83073 10.3272 8.83073 9.68317C8.83073 9.03917 9.35304 8.5165 9.99739 8.5165Z" fill="black"/>
                                            </svg>
                                        )}
                                        {stat.icon === 'clock' && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M12.0007 0C5.55738 0 0.333984 5.22317 0.333984 11.6667C0.333984 18.1102 5.55727 23.3333 12.0007 23.3333C18.4439 23.3333 23.6673 18.1102 23.6673 11.6667C23.6673 5.22317 18.4439 0 12.0007 0ZM12.0007 2.33333C17.1553 2.33333 21.334 6.51233 21.334 11.6667C21.334 16.821 17.1553 21 12.0007 21C6.84597 21 2.66732 16.821 2.66732 11.6667C2.66732 6.51233 6.84597 2.33333 12.0007 2.33333ZM12.0007 4.66667C11.3563 4.66667 10.834 5.18933 10.834 5.83333V11.6667C10.834 11.9758 10.9433 12.2862 11.1621 12.5055L14.6621 16.0055C15.1178 16.4605 15.8836 16.4605 16.3393 16.0055C16.7948 15.5493 16.7948 14.784 16.3393 14.3278L13.1673 11.1557V5.83333C13.1673 5.18933 12.645 4.66667 12.0007 4.66667Z" fill="black"/>
                                            </svg>
                                        )}
                                        {stat.icon === 'star' && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none">
                                                <path d="M11.6778 9.84795e-08C11.0118 -0.000233235 10.3316 0.414172 9.92875 1.239L7.45087 6.34048L1.8028 7.1421C-0.0135863 7.3948 -0.602053 9.17677 0.70963 10.4578L4.79075 14.4303L3.84341 20.0058C3.53145 21.8106 5.0284 22.9014 6.64925 22.0463C7.27551 21.7149 10.4956 20.0466 11.6778 19.4224L16.7064 22.0463C18.3291 22.9014 19.8307 21.8118 19.5122 20.0058L18.5284 14.4303L22.6096 10.4578C23.9275 9.18144 23.3693 7.39994 21.5528 7.1421L15.8684 6.34048L13.4269 1.239C13.0246 0.413822 12.3439 0.000350098 11.6778 9.84795e-08ZM11.6778 3.02447L14.0828 7.94384C14.2524 8.29186 14.5741 8.50897 14.9573 8.56334L20.4233 9.3646L16.4513 13.1913C16.1733 13.4608 16.0562 13.8306 16.1234 14.2109L17.0709 19.6044L12.2244 17.0541C11.884 16.8744 11.4715 16.8744 11.1312 17.0541C10.5266 17.3726 7.57115 18.9254 6.28478 19.6044L7.19583 14.2483C7.26105 13.8691 7.1424 13.4596 6.86788 13.1913L2.93236 9.3646L8.3618 8.59973C8.7461 8.5463 9.10252 8.29244 9.27285 7.94384L11.6778 3.02447Z" fill="black"/>
                                            </svg>
                                        )}
                                    </span>
                                    <span className={styles.statLabel}>{stat.label}:</span>
                                    <strong className={styles.statValue}>{String(stat.value)}</strong>
                                </li>
                            ))}
                        </ul>

                        <blockquote className={styles.authorQuote}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M6.354 1.146a.5.5 0 0 1 .146.354V7a3 3 0 1 1-3-3h.5a.5.5 0 0 0 .5-.5V1.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .354.146zM13.354 1.146a.5.5 0 0 1 .146.354V7a3 3 0 1 1-3-3h.5a.5.5 0 0 0 .5-.5V1.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .354.146z"/>
                            </svg>
                            <p className={styles.authorQuoteText}>
                                {(author as any)?.Qisqa_tavsif || (author.biography ? author.biography.slice(0, 260) : '')}
                            </p>
                        </blockquote>
                    </div>
                </div>
            </section>

            {/* Article Content Section */}
            <article className={styles.articleSection}>
                <div className={`container mx-auto px-3 ${styles.articleContainer}`}>
                    <h1 className={styles.articleTitle} dangerouslySetInnerHTML={{__html: (author as any)?.Nom2 || author.name}} />

                    {(() => {
                        const bioText = author.biography || '';
                        const parts = bioText.split('\n\n');
                        const midpoint = Math.max(1, Math.ceil(parts.length / 2));
                        const first = parts.slice(0, midpoint).join('\n\n');
                        const second = parts.slice(midpoint).join('\n\n');
                        const videoUrl = (author as any)?.Video || '';
                        const videoId = extractYouTubeVideoId(videoUrl || '');
                        return (
                            <>
                                <p className={styles.articleText}>{first}</p>

                                {videoId ? (
                                    <div className={styles.videoEmbed}>
                                        <iframe
                                            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
                                            title="YouTube video player"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            loading="lazy"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : null}

                                {second && (
                                    <p className={styles.articleText}>{second}</p>
                                )}
                            </>
                        )
                    })()}
            </div>
            </article>




            <SectionListWrapper title={t('authorsPage')} moreBtn={'/authors/'}>
                <AuthorsListSection authors={authors.results}/>
            </SectionListWrapper>
            
            {/* Testimonials Section (bottom) */}
            <section className="container mx-auto px-3 md:mb-12 mb-7">
                <TestimonialsSection />
            </section>


        </MainLayout>
    );
};

export default Index;
