import React, {useEffect, useState, useMemo, useRef} from 'react';
import NovelCard from "../NovelCard";
import {useAppSelector} from "../../hooks/reducer";
import {
    deleteFromSavedNovel,
    fetchNovels,
    saveNovel
} from "../../store/actions/novel";
import {selectNovels} from "../../store/selectors/novel";
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import {Navigation} from "swiper";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import classNames from "classnames";
import {fetchCategories} from "../../store/actions/category";
import useTranslation from 'next-translate/useTranslation';
import styles from './style.module.scss';


interface Props {
    activeTab: string;
    changeTab: (type: string) => void
}

const Index:React.FC<Props> = ({activeTab, changeTab}) => {
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const swiperRef = useRef<SwiperType>();

    const dispatch = useDispatch();
    const {locale} = useRouter();
    const { novels, loading } = useAppSelector(selectNovels)
    const {t} = useTranslation('common')


    const filteredNovels = useMemo(() => {
        if (!novels.results) return [];
        
        if (activeTab === 'popular') {
            return novels.results.filter(novel => {
                const rating = novel.rating || novel.reyting || 0;
                return rating >= 4;
            });
        }
        
        if (activeTab === 'new') {
            return novels.results.filter(novel => {
                return novel.new || novel.yangi;
            });
        }
        
        return novels.results;
    }, [novels.results, activeTab]);

    const addNovelToMark = async (slug, saved) => {
        if(!saved){
            await dispatch(saveNovel({
                locale:  locale,
                slug: slug
            }))
        }else {
            await dispatch(deleteFromSavedNovel({
                locale:  locale,
                slug: slug
            }))
        }
        await dispatch(fetchNovels({locale: locale, opt: {
            params: {
                [activeTab]: 'true'
            }
        }}));
        await dispatch(fetchCategories({locale: locale}));
    }


    return (
        <div className={styles.tabContainer}>
            <div className={styles.sectionTitle}>
                <div className={styles.titleText}>
                    <span className="truncate">{t('booksSliderTitle')}</span>
                    <svg 
                        width="20" 
                        height="20" 
                        className="sm:w-[30px] sm:h-[30px] flex-shrink-0"
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg" 
                        color="#cd1b17"
                    >
                        <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" 
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>

            <div className={styles.tabButtons}>
                <button
                    className={classNames(styles.tabButton, {
                        [styles.active] : activeTab === 'new'
                    })}
                    onClick={()=>changeTab('new')}
                >
                    {t('new')}
                </button>
                <button
                    className={classNames(styles.tabButton, {
                        [styles.active] : activeTab === 'popular'
                    })}
                    onClick={()=>changeTab('popular')}
                >
                    {t('popular')}
                </button>
            </div>
            <div className={styles.sliderWrapper}>
                <div className={styles.sliderContainer}>
                    {!isBeginning && (
                        <button 
                            className={`${styles.navButton} ${styles.prevButton}`}
                            onClick={() => swiperRef.current?.slidePrev()}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    )}
                    {!isEnd && (
                        <button 
                            className={`${styles.navButton} ${styles.nextButton}`}
                            onClick={() => swiperRef.current?.slideNext()}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    )}

                    {loading || filteredNovels.length === 0 ? (
                        <div className={styles.swiper}>
                            {loading ? (
                                <div className={styles.loading}>
                                    Yuklanmoqda...
                                </div>
                            ) : (
                                <div className={styles.empty}>
                                    <div className={styles.emptyIcon}>📚</div>
                                    <div>
                                        {activeTab === 'popular' 
                                            ? (locale === 'ru' ? 'Популярные книги не найдены' : 'Mashhur kitoblar topilmadi')
                                            : (locale === 'ru' ? 'Новые книги не найдены' : 'Yangi kitoblar topilmadi')
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Swiper
                            onBeforeInit={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            slidesPerView={1.8}
                            spaceBetween={8}
                            navigation={false}
                            modules={[Navigation]}
                            className={styles.swiper}
                            freeMode={false}
                            grabCursor={true}
                            touchRatio={1}
                            touchAngle={45}
                            threshold={10}
                            onSlideChange={(swiper) => {
                                setIsBeginning(swiper.isBeginning);
                                setIsEnd(swiper.isEnd);
                            }}
                            onSwiper={(swiper) => {
                                setIsBeginning(swiper.isBeginning);
                                setIsEnd(swiper.isEnd);
                            }}
                            breakpoints={{
                                360: {
                                    slidesPerView: 1.5,
                                    spaceBetween: 8,
                                },
                                480: {
                                    slidesPerView: 2.5,
                                    spaceBetween: 12,
                                },
                                640: {
                                    slidesPerView: 2.8,
                                    spaceBetween: 12,
                                },
                                768: {
                                    slidesPerView: 2.5,
                                    spaceBetween: 12,
                                },
                                1024: {
                                    slidesPerView: 3.4,
                                    spaceBetween: 12,
                                },
                            }}
                        >
                            {filteredNovels.map((novel) => {
                                return (
                                    <SwiperSlide key={novel.slug} className={styles.slideItem}>
                                        <NovelCard novel={novel} addToMark={addNovelToMark}/>
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>
                    )}
                </div>
            </div>
        </div>

    );
};

export default Index;
