import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper';
import { useRouter } from 'next/router';
import 'swiper/css';
import 'swiper/css/navigation';
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
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

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

  const extractTextFromContent = (content: any[]): string => {
    if (!content || !Array.isArray(content)) return '';
    
    return content
      .map(block => {
        if (block.children && Array.isArray(block.children)) {
          return block.children.map((child: any) => child.text || '').join('');
        }
        return '';
      })
      .join(' ')
      .substring(0, 150) + '...';
  };

  const handleBookClick = (slug: string) => {
    router.push(`/novels/${slug}`);
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
        modules={[Navigation, Autoplay, Pagination]}
        navigation={{
          nextEl: '.main-slider-button-next',
          prevEl: '.main-slider-button-prev',
        }}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
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
                      {book.mualliflar?.ismi || 'Noma\'lum muallif'}
                    </p>
                    <p className={styles.bookDescription}>
                      {extractTextFromContent(book.tavsifi)}
                    </p>
                    <div className={styles.priceInfo}>
                      {book.chegirma_narxi ? (
                        <>
                          <span className={styles.originalPrice}>{book.narxi.toLocaleString()} so'm</span>
                          <span className={styles.discountPrice}>{book.chegirma_narxi.toLocaleString()} so'm</span>
                        </>
                      ) : (
                        <span className={styles.price}>{book.narxi.toLocaleString()} so'm</span>
                      )}
                    </div>
                    <button 
                      className={styles.shopButton}
                      onClick={() => handleBookClick(book.slug)}
                    >
                      Sotib olish
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
    </section>
  );
};

export default BooksSlider; 