import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import 'swiper/css';
import 'swiper/css/navigation';
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
        `http://localhost:1337/api/kitoblars?locale=${router.locale || 'uz'}&populate=mualliflar&populate=muqova&sort=createdAt:desc&pagination[limit]=3`
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
      return `http://localhost:1337${muqova.formats.medium.url}`;
    }
    if (muqova.url) {
      return `http://localhost:1337${muqova.url}`;
    }
    return '/assets/images/noPhotoNovel.jpg';
  };

  const handleBookClick = (slug: string) => {
    router.push(`/novels/${slug}`);
  };

  const handlePaginationClick = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideToLoop(index);
    }
  };

  if (loading || books.length === 0) {
    return null;
  }

  return (
    <section id="billboard" className={styles.billboard}>
      <div className={styles.navigationButtons}>
        <div className={`${styles.navButton} ${styles.prevButton} main-slider-button-prev`}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <div className={`${styles.navButton} ${styles.nextButton} main-slider-button-next`}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: '.main-slider-button-next',
          prevEl: '.main-slider-button-prev',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className={styles.mainSwiper}
      >
        {books.map((book) => (
          <SwiperSlide key={book.id}>
            <div className={styles.slideContent}>
              <div className="container mx-auto px-4">
                <div className={styles.bookInfo}>
                  <div className={styles.textContent}>
                    <h2 className={styles.bookTitle}>{book.nomi}</h2>
                    <p className={styles.authorName}>
                      {book.mualliflar?.ismi}
                    </p>
                    <div className={styles.priceInfo}>
                      {book.chegirma_narxi ? (
                        <>
                          <span className={styles.originalPrice}>{book.narxi.toLocaleString()} {t('currency')}</span>
                          <span className={styles.discountPrice}>{book.chegirma_narxi.toLocaleString()} {t('currency')}</span>
                        </>
                      ) : (
                        <span className={styles.price}>{book.narxi.toLocaleString()} {t('currency')}</span>
                      )}
                    </div>
                    <button 
                      className={styles.shopButton}
                      onClick={() => handleBookClick(book.slug)}
                    >
                      {t('detail_slider')}
                    </button>
                  </div>
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
            onClick={() => handlePaginationClick(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default BooksSlider; 