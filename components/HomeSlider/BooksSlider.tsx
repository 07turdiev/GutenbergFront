import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade, Pagination } from 'swiper';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { getApiUrl, ensureAbsoluteUrl } from '../../config/api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
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
  narxi: number;
  chegirma_narxi?: number;
  mualliflar: Author;
  muqova: BookCover;
}

const BooksSlider: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

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

  const handleBookClick = (slug: string) => {
    router.push(`/books/${slug}`);
  };

  if (loading) {
    return (
      <section className={styles.billboard}>
        <div className={styles.loadingSlider}>
          <div className={styles.shimmer}></div>
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return null;
  }

  return (
    <section id="billboard" className={styles.billboard}>
      <div className={styles.sliderContainer}>
        <Swiper
          modules={[Navigation, Autoplay, EffectFade]}
          navigation={{
            nextEl: `.${styles.nextButton}`,
            prevEl: `.${styles.prevButton}`,
          }}
          effect="fade"
          fadeEffect={{
            crossFade: true
          }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          loop={true}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className={styles.mainSwiper}
        >
          {books.map((book, index) => (
            <SwiperSlide key={book.id}>
              <div className={styles.slideContent}>
                <div className="container mx-auto px-3">
                  <div className={styles.bookInfo}>
                    <div className={styles.textContent}>
                      <h2 className={styles.bookTitle}>
                        <span className={styles.titleText}>{book.nomi}</span>
                      </h2>
                      <p className={styles.authorName}>
                        <span className={styles.authorLabel}>{t('author')}:</span> {book.mualliflar?.ismi}
                      </p>
                      
                      <div className={styles.priceSection}>
                        <div className={styles.priceInfo}>
                          {book.chegirma_narxi ? (
                            <>
                              <div className={styles.discountBadge}>
                                -{Math.round((1 - book.chegirma_narxi / book.narxi) * 100)}%
                              </div>
                              <div className={styles.priceWrapper}>
                                <span className={styles.originalPrice}>{book.narxi.toLocaleString()} {t('currency')}</span>
                                <span className={styles.discountPrice}>{book.chegirma_narxi.toLocaleString()} {t('currency')}</span>
                              </div>
                            </>
                          ) : (
                            <span className={styles.price}>{book.narxi.toLocaleString()} {t('currency')}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className={styles.buttonGroup}>
                        <button 
                          className={styles.primaryButton}
                          onClick={() => handleBookClick(book.slug)}
                        >
                          <span>{t('detail_slider')}</span>
                          <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </button>
                        <button className={styles.secondaryButton}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className={styles.imageSection}>
                      <div className={styles.imageWrapper}>
                        <img 
                          src={getImageUrl(book.muqova)} 
                          alt={book.nomi}
                          className={styles.bookImage}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Custom Pagination */}
        <div className={styles.customPagination}>
          {books.map((_, index) => (
            <button
              key={index}
              className={`${styles.paginationBullet} ${
                index === activeIndex ? styles.paginationBulletActive : ''
              }`}
              onClick={() => {
                if (swiperInstance) {
                  swiperInstance.slideToLoop(index);
                }
              }}
            />
          ))}
        </div>
        
        {/* Modern Navigation Buttons */}
        <div className={styles.navigationWrapper}>
          <button className={`${styles.navButton} ${styles.prevButton}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className={`${styles.navButton} ${styles.nextButton}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BooksSlider; 