import React, { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { IAuthor } from '../../models/IAuthors';
import { ensureAbsoluteUrl } from '../../config/api';
import noPhoto from '../../assets/images/noPhotoAvtor.jpg';
import styles from './style.module.scss';

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

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);
    const autoTimerRef = useRef<any>(null);

    const items = useMemo(() => {
        const list = authors || [];
        if (list.length <= 4) return list;
        return list.slice(-4);
    }, [authors]);

    const showNav = (items?.length || 0) >= 4;

    const getCardWidth = (): number => {
        const card = wrapperRef.current?.querySelector(`.${styles.authorCard}`) as HTMLElement | null;
        if (!card) return 0;
        const style = window.getComputedStyle(card);
        const gap = parseFloat(style.marginRight || '0');
        return card.offsetWidth + (Number.isNaN(gap) ? 0 : 20); // gap defined in css as 20px
    };

    const snapToIndex = (index: number) => {
        const wrap = wrapperRef.current;
        if (!wrap) return;
        const cardWidth = getCardWidth();
        wrap.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    };

    const getCurrentIndex = (): number => {
        const wrap = wrapperRef.current;
        if (!wrap) return 0;
        const cardWidth = getCardWidth();
        if (cardWidth === 0) return 0;
        return Math.round(wrap.scrollLeft / cardWidth);
    };

    useEffect(() => {
        const wrap = wrapperRef.current;
        if (!wrap) return;
        clearInterval(autoTimerRef.current);
        if ((items?.length || 0) >= 2) {
            autoTimerRef.current = setInterval(() => {
                const idx = getCurrentIndex();
                const total = items?.length || 1;
                const next = (idx + 1) % total;
                snapToIndex(next);
            }, 5000);
        }
        return () => clearInterval(autoTimerRef.current);
    }, [items?.length]);

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const wrap = wrapperRef.current;
        if (!wrap) return;
        isDraggingRef.current = true;
        startXRef.current = e.pageX - wrap.offsetLeft;
        scrollLeftRef.current = wrap.scrollLeft;
        clearInterval(autoTimerRef.current);
    };

    const onMouseLeave = () => {
        isDraggingRef.current = false;
    };

    const onMouseUp = () => {
        isDraggingRef.current = false;
        // resume auto play
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = setInterval(() => {
            const idx = getCurrentIndex();
            const total = items?.length || 1;
            const next = (idx + 1) % total;
            snapToIndex(next);
        }, 5000);
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const wrap = wrapperRef.current;
        if (!wrap || !isDraggingRef.current) return;
        e.preventDefault();
        const x = e.pageX - wrap.offsetLeft;
        const walk = (x - startXRef.current) * 1; // scroll-fast
        wrap.scrollLeft = scrollLeftRef.current - walk;
    };

    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const wrap = wrapperRef.current;
        if (!wrap) return;
        isDraggingRef.current = true;
        startXRef.current = e.touches[0].pageX - wrap.offsetLeft;
        scrollLeftRef.current = wrap.scrollLeft;
        clearInterval(autoTimerRef.current);
    };

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const wrap = wrapperRef.current;
        if (!wrap || !isDraggingRef.current) return;
        const x = e.touches[0].pageX - wrap.offsetLeft;
        const walk = (x - startXRef.current) * 1;
        wrap.scrollLeft = scrollLeftRef.current - walk;
    };

    const onTouchEnd = () => {
        isDraggingRef.current = false;
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = setInterval(() => {
            const idx = getCurrentIndex();
            const total = items?.length || 1;
            const next = (idx + 1) % total;
            snapToIndex(next);
        }, 5000);
    };

    const goPrev = () => {
        clearInterval(autoTimerRef.current);
        const idx = getCurrentIndex();
        const total = items?.length || 1;
        const prevIdx = (idx - 1 + total) % total;
        snapToIndex(prevIdx);
    };

    const goNext = () => {
        clearInterval(autoTimerRef.current);
        const idx = getCurrentIndex();
        const total = items?.length || 1;
        const nextIdx = (idx + 1) % total;
        snapToIndex(nextIdx);
    };

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
                    {showNav && (
                        <>
                            <button type="button" className={`${styles.navButton} ${styles.prevButton}`} onClick={goPrev} aria-label="Previous">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <button type="button" className={`${styles.navButton} ${styles.nextButton}`} onClick={goNext} aria-label="Next">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </>
                    )}
                    <main
                        ref={wrapperRef}
                        className={styles.authorsCarouselWrapper}
                        onMouseDown={onMouseDown}
                        onMouseLeave={onMouseLeave}
                        onMouseUp={onMouseUp}
                        onMouseMove={onMouseMove}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {(items || []).map((author) => (
                            <Link key={author.id || author.slug} href={`/authors/${author.slug}`}>
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
                        ))}
                    </main>
                </div>
            </div>
        </section>
    );
};

export default AuthorsSection;


