import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import { IAuthor } from '../../models/IAuthors';
import { ensureAbsoluteUrl } from '../../config/api';
import noPhoto from '../../assets/images/noPhotoAvtor.jpg';
import styles from './style.module.scss';

import 'swiper/css';
import 'swiper/css/navigation';

interface AuthorsSectionProps {
    authors: IAuthor[];
}

const AuthorsSection: React.FC<AuthorsSectionProps> = ({ authors }) => {
    const { t } = useTranslation('common');

    const getImageUrl = (author: IAuthor): string => {
        if (author.rasmi?.url) {
            return ensureAbsoluteUrl(author.rasmi.url);
        }
        if (author.photo?.src) {
            return author.photo.src;
        }
        return noPhoto.src;
    };

    const getBooksCountText = (author: IAuthor): string => {
        const count = author.romanlar_soni || author.novels_count || 0;
        return `${count} ${t('sliderAuthor_books')}`;
    };

    const items = useMemo(() => {
        const list = authors || [];
        if (list.length <= 3) return list;
        return list.slice(-3);
    }, [authors]);

    return (
        <section className={styles.authorsSection}>
            <div className={styles.sectionContainer}>
                <header className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.titleLine1}>{t('authorsCreatorsTitleLine1')}</span>
                        <span className={styles.titleLine2Row}>
                            <span className={styles.titleLine2}>{t('authorsCreatorsTitleLine2')}</span>
                            <Link href="/authors/">
                                <a className={`${styles.btn} ${styles.btnSecondary}`}>{t('all')}</a>
                            </Link>
                        </span>
                    </h2>
                </header>

                <div className={styles.carouselContainer}>
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        navigation={{
                            nextEl: `.${styles.nextButton}`,
                            prevEl: `.${styles.prevButton}`,
                        }}
                        loop={items.length > 3}
                        slidesPerView={1.2}
                        spaceBetween={20}
                        breakpoints={{
                            320: { slidesPerView: 1.1, spaceBetween: 12 },
                            640: { slidesPerView: 1.6, spaceBetween: 16 },
                            1024: { slidesPerView: 2.5, spaceBetween: 20 },
                            1400: { slidesPerView: 3, spaceBetween: 20 },
                        }}
                        className={styles.authorsCarouselWrapper}
                    >
                        {(items || []).map((author) => (
                            <SwiperSlide key={author.id || author.slug}>
                                <Link href={`/authors/${author.slug}`}>
                                    <a className={styles.authorCard}>
                                        <Image
                                            src={getImageUrl(author)}
                                            alt={author.ismi || author.name || t('author')}
                                            width={400}
                                            height={547}
                                            className={styles.authorImage}
                                        />
                                        <div className={styles.authorInfo}>
                                            <h3>{author.ismi || author.name}</h3>
                                            <p className={styles.roleDefault}>{getBooksCountText(author)}</p>
                                        </div>
                                    </a>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    
                    {items.length > 3 && (
                        <>
                            <button type="button" className={`${styles.navButton} ${styles.prevButton}`} aria-label="Previous">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <button type="button" className={`${styles.navButton} ${styles.nextButton}`} aria-label="Next">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AuthorsSection;


