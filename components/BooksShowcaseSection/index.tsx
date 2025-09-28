import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './style.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector } from '../../hooks/reducer';
import { selectNovels } from '../../store/selectors/novel';
import { ensureAbsoluteUrl } from '../../config/api';

interface BookItem {
    id: string | number;
    title: string;
    imageUrl: string;
    slug?: string;
}

const getImageUrl = (muqova: any): string => {
    if (!muqova) return '/assets/images/noPhotoNovel.jpg';
    if (muqova.formats?.medium?.url) return ensureAbsoluteUrl(muqova.formats.medium.url);
    if (muqova.url) return ensureAbsoluteUrl(muqova.url);
    return '/assets/images/noPhotoNovel.jpg';
};

const BooksShowcaseSection: React.FC = () => {
    const router = useRouter();
    const { novels } = useAppSelector(selectNovels);
    const { t } = useTranslation('common');

    const books: BookItem[] = useMemo(() => {
        if (!novels?.results || novels.results.length === 0) return [];
        return novels.results.slice(0, 5).map((n: any, idx: number) => ({
            id: n.id ?? idx,
            title: n.title || n.nomi || '',
            imageUrl: getImageUrl(n.muqova),
            slug: n.slug,
        }));
    }, [novels]);

    const [activeIndex, setActiveIndex] = useState(0);
    const intervalRef = useRef<any>(null);
    const dragStartXRef = useRef<number | null>(null);
    const dragStartYRef = useRef<number | null>(null);
    const isDraggingRef = useRef<boolean>(false);
    const hasSwipedRef = useRef<boolean>(false);

    const getCardClass = (index: number): string => {
        const total = books.length;
        const leftIndex = (activeIndex - 1 + total) % total;
        const rightIndex = (activeIndex + 1) % total;
        const left2Index = (activeIndex - 2 + total) % total;
        const right2Index = (activeIndex + 2) % total;

        if (index === activeIndex) return styles.cardPositionCenter;
        if (index === leftIndex) return styles.cardPositionLeft;
        if (index === rightIndex) return styles.cardPositionRight;
        if (index === left2Index) return styles.cardPositionHiddenLeft;
        if (index === right2Index) return styles.cardPositionHiddenRight;
        return styles.cardPositionHidden;
    };

    const startAutoSlide = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % books.length);
        }, 5000);
    };

    const goToCard = (index: number, slug?: string) => {
        if (index === activeIndex && !hasSwipedRef.current) {
            if (slug) router.push(`/books/${slug}`);
            return;
        }
        setActiveIndex(index);
        startAutoSlide();
        hasSwipedRef.current = false;
    };

    useEffect(() => {
        if (books.length > 0) startAutoSlide();
        return () => clearInterval(intervalRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [books.length]);

    const onPointerDown = (clientX: number, clientY: number) => {
        dragStartXRef.current = clientX;
        dragStartYRef.current = clientY;
        isDraggingRef.current = true;
        hasSwipedRef.current = false;
        clearInterval(intervalRef.current);
    };

    const onPointerMove = (clientX: number, clientY: number) => {
        if (!isDraggingRef.current || dragStartXRef.current === null || dragStartYRef.current === null) return;
        const deltaX = clientX - dragStartXRef.current;
        const deltaY = clientY - dragStartYRef.current;
        // No preventDefault here; rely on CSS touch-action to manage scroll behavior
    };

    const onPointerUp = (clientX: number, clientY: number) => {
        if (!isDraggingRef.current || dragStartXRef.current === null || dragStartYRef.current === null) return;
        const deltaX = clientX - dragStartXRef.current;
        const deltaY = clientY - dragStartYRef.current;
        const threshold = 40; // px

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > threshold) {
                // swipe right -> go to previous
                setActiveIndex((prev) => {
                    const next = (prev - 1 + books.length) % books.length;
                    return next;
                });
                hasSwipedRef.current = true;
            } else if (deltaX < -threshold) {
                // swipe left -> go to next
                setActiveIndex((prev) => {
                    const next = (prev + 1) % books.length;
                    return next;
                });
                hasSwipedRef.current = true;
            }
        }

        isDraggingRef.current = false;
        dragStartXRef.current = null;
        dragStartYRef.current = null;
        startAutoSlide();
    };

    if (books.length === 0) return null;

    return (
        <section className={styles.booksSection}>
            <div className={styles.sectionContainer}>
                <header className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{t('booksSliderTitle')}</h2>
                    <div className={styles.sectionDetails}>
                        <p className={styles.sectionDescription}>{t('booksSectionDescription')}</p>
                        <Link href="/books">
                            <a className={styles.sectionLink}>
                                {t('booksListLink')}
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none" className={styles.sectionLinkArrow}>
                                    <path d="M11.1538 18.5377L16.6923 12.9993L11.1538 7.46081M1 12.9993C1 6.37185 6.37258 0.999268 13 0.999267C19.6274 0.999266 25 6.37185 25 12.9993C25 19.6267 19.6274 24.9993 13 24.9993C6.37258 24.9993 1 19.6267 1 12.9993Z" stroke="#009DFF" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </a>
                        </Link>
                    </div>
                </header>

                
                <div
                    className={styles.cardSliderContainer}
                    onTouchStart={(e) => {
                        const t = e.touches[0];
                        onPointerDown(t.clientX, t.clientY);
                    }}
                    onTouchMove={(e) => {
                        const t = e.touches[0];
                        onPointerMove(t.clientX, t.clientY);
                    }}
                    onTouchEnd={(e) => {
                        const t = e.changedTouches[0];
                        onPointerUp(t.clientX, t.clientY);
                    }}
                    onMouseDown={(e) => onPointerDown(e.clientX, e.clientY)}
                    onMouseMove={(e) => onPointerMove(e.clientX, e.clientY)}
                    onMouseUp={(e) => onPointerUp(e.clientX, e.clientY)}
                    onMouseLeave={(e) => {
                        if (isDraggingRef.current) onPointerUp(e.clientX, e.clientY);
                    }}
                >
                    {books.map((book, index) => (
                        <div
                            key={book.id}
                            className={`${styles.bookCard} ${getCardClass(index)}`}
                            onClick={() => goToCard(index, book.slug)}
                        >
                            <div className={styles.cardBackgroundHover}></div>
                            <div
                                className={styles.cardContent}
                                style={{ backgroundImage: `url(${book.imageUrl})` }}
                            >
                                <div className={styles.cardIcon}></div>
                                <h3 className={styles.cardTitle}>{book.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <footer className={styles.sectionFooter}>
                    <Link href="/books">
                        <a className={styles.mainButton}>
                            <span>{t('books')}</span>
                            <span className={styles.arrowIcon}>→</span>
                        </a>
                    </Link>
                </footer>
            </div>
        </section>
    );
};

export default BooksShowcaseSection;


