import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { IAuthor } from '../../models/IAuthors';
import { ensureAbsoluteUrl } from '../../config/api';
import MoreBtn from '../Ui/MoreBtn';
import noPhoto from '../../assets/images/noPhotoAvtor.jpg';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './style.module.scss';

interface Props {
    authors: IAuthor[];
}

const PopularAuthorsSlider: React.FC<Props> = ({ authors }) => {
    const router = useRouter();
    const { t } = useTranslation('common');

    const handleAuthorClick = (slug: string) => {
        router.push(`/authors/${slug}`);
    };

    const getImageUrl = (author: IAuthor): string => {
        if (author.rasmi?.url) {
            return ensureAbsoluteUrl(author.rasmi.url);
        }
        if (author.photo?.src) {
            return author.photo.src;
        }
        return noPhoto.src;
    };

    const getSubscriberCount = (author: IAuthor): string => {
        const count = author.romanlar_soni || author.novels_count || 0;
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    return (
        <div className={styles.popularAuthorsWrapper}>
            {/* Header with title and see all button */}
            <div className={styles.header}>
                <h2 className={styles.title}>
                    {t('popularAuthors')}
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#a62929">
                        <path d="M15 7L18 10M6 19L7 15L17 5L20 8L10 18L6 19Z" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </h2>
                <div className={styles.seeAllButton}>
                    <MoreBtn onClick={() => router.push('/authors/')}>
                        {t('showAll')}
                    </MoreBtn>
                </div>
            </div>
            
            <div className={styles.sliderContainer}>
                <button 
                    type="button" 
                    className={`${styles.navButton} ${styles.prevButton} popular-authors-prev`}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" stroke="currentColor" />
                    </svg>
                </button>
                
                <button 
                    type="button" 
                    className={`${styles.navButton} ${styles.nextButton} popular-authors-next`}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" stroke="currentColor" />
                    </svg>
                </button>

                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        nextEl: '.popular-authors-next',
                        prevEl: '.popular-authors-prev',
                    }}
                    slidesPerView={1.2}
                    spaceBetween={10}
                    breakpoints={{
                        480: {
                            slidesPerView: 2,
                            spaceBetween: 15,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 20,
                        },
                    }}
                    className={styles.swiper}
                >
                    {authors.map((author) => (
                        <SwiperSlide key={author.id || author.slug}>
                            <div 
                                className={styles.authorCard}
                                onClick={() => handleAuthorClick(author.slug)}
                            >
                                <div className={styles.content}>
                                    <div className={styles.avatarWrapper}>
                                        <Image
                                            src={getImageUrl(author)}
                                            alt={`Avatar ${author.ismi || author.name}`}
                                            width={60}
                                            height={60}
                                            className={styles.avatar}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    
                                    <div className={styles.infoWrapper}>
                                        <div className={styles.info}>
                                            <h3 className={styles.fullName}>
                                                {author.ismi || author.name}
                                            </h3>
                                            <div className={styles.subscribers}>
                                                <span className={styles.subscribersQuantity}>
                                                    {getSubscriberCount(author)}
                                                </span>
                                                {' '}{t('sliderAuthor_books')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default PopularAuthorsSlider; 