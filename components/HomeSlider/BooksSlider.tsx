import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { getApiUrl, ensureAbsoluteUrl } from '../../config/api';
import styles from './BooksSlider.module.scss';

interface Author {
  id: number;
  ismi: string;
  slug: string;
}

interface BookCover {
  url: string;
  formats?: {
    medium?: {
      url: string;
    };
  };
}

interface Book {
  id: number;
  nomi: string;
  slug: string;
  tavsifi: any[];
  narxi?: number | null;
  chegirma_narxi?: number | null;
  mualliflar: Author;
  muqova: BookCover;
}

const BooksSlider: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  
  // Touch/swipe handling
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  useEffect(() => {
    fetchLatestBooks();
  }, [router.locale]);

  const fetchLatestBooks = async () => {
    try {
      const response = await fetch(
        `${getApiUrl()}api/kitoblars?locale=${router.locale || 'uz'}&populate=mualliflar&populate=muqova&sort=createdAt:desc&pagination[limit]=5`
      );
      const data = await response.json();
      setBooks(data.data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (muqova: BookCover): string => {
    if (!muqova) return '/assets/images/noPhotoNovel.jpg';
    
    if (muqova.formats?.medium?.url) {
      return ensureAbsoluteUrl(muqova.formats.medium.url);
    }
    if (muqova.url) {
      return ensureAbsoluteUrl(muqova.url);
    }
    return '/assets/images/noPhotoNovel.jpg';
  };

  // Strapi richtext to plain text (best-effort)
  const extractPlainText = (tavsifi: any[] | undefined): string => {
    if (!tavsifi || !Array.isArray(tavsifi)) return '';
    try {
      const walk = (nodes: any[]): string =>
        nodes
          .map((node) => {
            if (typeof node === 'string') return node;
            if (node?.text) return node.text as string;
            if (Array.isArray(node?.children)) return walk(node.children);
            return '';
          })
          .join(' ');
      return walk(tavsifi).replace(/\s+/g, ' ').trim();
    } catch {
      return '';
    }
  };

  // Swipe detection functions
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && books.length > 0) {
      // Swipe left - next book
      setActiveIndex((prev) => (prev + 1) % books.length);
      setAnimationKey((k) => k + 1);
      setShowSwipeHint(false); // Hide hint after first swipe
    } else if (isRightSwipe && books.length > 0) {
      // Swipe right - previous book
      setActiveIndex((prev) => (prev - 1 + books.length) % books.length);
      setAnimationKey((k) => k + 1);
      setShowSwipeHint(false); // Hide hint after first swipe
    }
  };

  useEffect(() => {
    if (!books.length) return;
    const durationMs = 6000; // Keep in sync with CSS animation duration
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % books.length);
      setAnimationKey((k) => k + 1);
    }, durationMs);
    return () => clearInterval(id);
  }, [books.length]);

  // Hide swipe hint after 5 seconds
  useEffect(() => {
    if (showSwipeHint) {
      const timer = setTimeout(() => {
        setShowSwipeHint(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSwipeHint]);

  const activeBook = books[activeIndex];
  const description = useMemo(() => {
    const text = extractPlainText(activeBook?.tavsifi);
    if (!text) return '';
    if (text.length <= 220) return text;
    return text.slice(0, 217) + '...';
  }, [activeBook]);

  if (loading) {
    return (
      <section className={styles.heroSlider}>
        <div className={styles.sliderContainer}>
          <div className={styles.loadingSlider}>
            <div className={styles.shimmer}></div>
          </div>
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return null;
  }

  return (
    <section className={styles.heroSlider}>
      <div 
        ref={sliderRef}
        className={styles.sliderContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Decorative path */}
        <svg className={styles.pathSvg} xmlns="http://www.w3.org/2000/svg" width="238" height="886" viewBox="0 0 238 886" fill="none">
          <g filter="url(#filter0_d_1_42)">
            <path d="M-97 -9.00075C84.1494 -9.00074 231 188.889 231 432.999C231 677.109 84.1494 874.999 -97 874.999" stroke="url(#paint0_linear_1_42)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <filter id="filter0_d_1_42" x="-103.5" y="-11.5007" width="341" height="897" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="4"/>
              <feGaussianBlur stdDeviation="2"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_42"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_42" result="shape"/>
            </filter>
            <linearGradient id="paint0_linear_1_42" x1="67" y1="746.187" x2="67" y2="118.98" gradientUnits="userSpaceOnUse">
              <stop stopColor="white"/>
              <stop offset="0.167353" stopColor="#00EEFF"/>
              <stop offset="0.39751" stopColor="#0022FF"/>
              <stop offset="0.606743" stopColor="#AE00FF"/>
              <stop offset="0.845" stopColor="#FF0066"/>
              <stop offset="1" stopColor="white"/>
            </linearGradient>
          </defs>
        </svg>

        {/* Moving book image */}
        <div key={animationKey} className={styles.bookAnimationWrapper}>
          <div className={styles.bookImageWrapper}>
            <img
              src={getImageUrl(activeBook.muqova)}
              alt={activeBook.nomi}
              className={styles.bookImage}
            />
          </div>
        </div>

        <div className={styles.statsCard}>
            <span>{t('soldCount')}</span>
            <p>{t('soldText')}</p>
            <div className={styles.userIcons}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrW16gsPNbf_y5hry38tQj-LVvYGRWPb2kvA&s" alt="user" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrW16gsPNbf_y5hry38tQj-LVvYGRWPb2kvA&s" alt="user" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrW16gsPNbf_y5hry38tQj-LVvYGRWPb2kvA&s" alt="user" />
            </div>
            <button className={styles.arrowBtn}>
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M11.1538 18.5377L16.6923 12.9993L11.1538 7.46081M1 12.9993C1 6.37185 6.37258 0.999268 13 0.999267C19.6274 0.999266 25 6.37185 25 12.9993C25 19.6267 19.6274 24.9993 13 24.9993C6.37258 24.9993 1 19.6267 1 12.9993Z" stroke="#009DFF" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

        {/* Site Slogan */}
        <div className={styles.sloganContainer}>
          <h2 className={styles.sloganText}>{t('siteSlogan')}</h2>
        </div>

        {/* Content area */}
        <div className={styles.contentArea}>
          <div key={`title-${activeBook.id}-${activeIndex}`} className={`${styles.textContent} ${styles.fadeText}`}>
            <h5 className={styles.mainTitle}>{activeBook.nomi}</h5>
          </div>

          
        </div>
        <div key={`desc-${activeBook.id}-${activeIndex}`} className={`${styles.descriptionArea} ${styles.fadeText}`}>
            {description ? (
              <p className={styles.description}>{description}</p>
            ) : null}
          </div>
        <div className={styles.actions}>
          <Link href={`/books/${activeBook.slug}`} >
          <button className={styles.btnPrimary}>{t('aboutBook')}</button>
          
          </Link>
        </div>
        
        {/* Swipe indicator for mobile */}
        {showSwipeHint && (
          <div className={styles.swipeIndicator}>
            {t('swipeHint')}
          </div>
        )}
      </div>
    </section>
  );
};

export default BooksSlider; 