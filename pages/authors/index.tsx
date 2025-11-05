import React from 'react';
import HeadMeta from "../../components/HeadMeta";
import SectionTitle from "../../components/SectionTitle";
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
import { ensureAbsoluteUrl } from "../../config/api";
import noPhoto from "../../assets/images/noPhotoAvtor.jpg";
import styles from './style.module.scss';

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

    const getImageUrl = (author: any): string => {
        if (author.rasmi?.url) {
            return ensureAbsoluteUrl(author.rasmi.url);
        }
        if (author.photo?.src) {
            return author.photo.src;
        }
        return noPhoto.src;
    };

    const getBooksCountText = (author: any): string => {
        const count = author.romanlar_soni || author.novels_count || 0;
        return `${count} ${t('sliderAuthor_books')}`;
    };

    return (
        <MainLayout>
            <HeadMeta 
                title="Mualliflar| Gutenberg" 
                description="Gutenberg nashriyot uyi bilan hamkorlik o'rnatgan adiblar, ijodkorlar, tarjimonlar haqida"
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

                <div className="w-full">
                    <div className={styles.authorsGrid}>
                        {authors.results.map((author) => (
                            <Link key={author.slug} href={`/authors/${author.slug}`}>
                                <a className={styles.authorCard}>
                                    <div className={styles.cardImageWrapper}>
                                        <Image
                                            src={getImageUrl(author)}
                                            alt={author.ismi || author.name || t('author')}
                                            width={400}
                                            height={547}
                                            className={styles.authorImage}
                                        />
                                    </div>
                                    <div className={styles.cardContent}>
                                        <div className={styles.cardText}>
                                            <h3>{author.ismi || author.name}</h3>
                                            <p>{getBooksCountText(author)}</p>
                                        </div>
                                        <span className={styles.arrowCircle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39" fill="none">
                                                <path d="M13 12.9994H26M26 12.9994V25.9994M26 12.9994L13 25.9994" stroke="#009DFF"/>
                                            </svg>
                                        </span>
                                    </div>
                                </a>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>

            <Pagination meta={authors.meta}/>
        </MainLayout>
    );
};

export default AuthorsPage;
