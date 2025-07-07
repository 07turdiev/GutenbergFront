import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { IBlogPost } from '../../models/IBlog';
import 'swiper/css';
import 'swiper/css/navigation';
import noPhoto from '../../assets/images/noPhotoNovel.jpg';
import styles from './style.module.scss';

interface BlogPostsSliderProps {
  posts: IBlogPost[];
}

const BlogPostsSlider: React.FC<BlogPostsSliderProps> = ({ posts }) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const handlePostClick = (slug: string) => {
    router.push(`/blog/${slug}`);
  };

  const getImageUrl = (post: IBlogPost): string => {
    if (!post.rasmi) return noPhoto.src;
    
    if (post.rasmi.formats?.medium?.url) {
      return `http://localhost:1337${post.rasmi.formats.medium.url}`;
    }
    return `http://localhost:1337${post.rasmi.url}`;
  };

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className={styles.blogPostsSlider}>
      <div className={styles.sliderContainer}>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            nextEl: '.blog-slider-button-next',
            prevEl: '.blog-slider-button-prev',
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="blog-posts-swiper"
        >
          {posts.map((post) => (
            <SwiperSlide key={post.id}>
              <div 
                className={styles.postCard}
                onClick={() => handlePostClick(post.slug)}
              >
                <div className={styles.imageContainer}>
                  <Image
                    src={getImageUrl(post)}
                    alt={post.sarlavha}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className={styles.content}>
                  <h3 className={styles.title}>
                    {post.sarlavha}
                  </h3>
                  <div className={styles.meta}>
                    <span>{new Date(post.chop_sanasi).toLocaleDateString()}</span>
                    <span>{t('views')}: {post.korishlar_soni.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <button 
          type="button" 
          className={`${styles.navigationButton} ${styles.prev} blog-slider-button-prev`}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          type="button" 
          className={`${styles.navigationButton} ${styles.next} blog-slider-button-next`}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BlogPostsSlider; 