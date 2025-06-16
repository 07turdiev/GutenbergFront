import React, {useEffect, useState} from 'react';
import NovelCard from "../NovelCard";
import {useAppSelector} from "../../hooks/reducer";
import {
    deleteFromSavedNovel,
    fetchNovels,
    saveNovel
} from "../../store/actions/novel";
import {selectNovels} from "../../store/selectors/novel";
import { Swiper, SwiperSlide } from 'swiper/react';
import {FreeMode, Navigation} from "swiper";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import classNames from "classnames";
import {fetchCategories} from "../../store/actions/category";
import useTranslation from 'next-translate/useTranslation';


interface Props {
    activeTab: string;
    changeTab: (type: string) => void
}

const Index:React.FC<Props> = ({activeTab, changeTab}) => {

    const dispatch = useDispatch();
    const {locale} = useRouter();
    const { novels, loading } = useAppSelector(selectNovels)
    const {t} = useTranslation('common')


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
        <div>

            <div className='flex items-center'>
                <button
                    className={classNames('px-2 py-1 text-md mr-2 rounded-lg bg-gray-100 mb-1', {
                        'text-primary rounded-b-none -mb-1 pb-3' : activeTab === 'popular'
                    })}
                    onClick={()=>changeTab('popular')}
                >
                    {t('popular')}
                </button>
                <button
                    className={classNames('px-2 py-1 text-md mr-2 rounded-lg bg-gray-100 mb-1', {
                        'text-primary rounded-b-none -mb-1 pb-3' : activeTab === 'new'
                    })}
                    onClick={()=>changeTab('new')}
                >
                    {t('new')}
                </button>
            </div>
            <div>
                <div className='bg-gray-100 rounded-b-lg sm:p-5 p-2'>
                    <Swiper
                        slidesPerView={2}
                        spaceBetween={5}
                        navigation={true}

                        modules={[Navigation]}
                        className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-6'
                        breakpoints={{
                            480: {
                                slidesPerView: 3,
                                spaceBetween: 5,
                                freeMode: false
                            },
                            768: {
                                slidesPerView: 4,
                                spaceBetween: 10,

                            },
                            1024: {
                                slidesPerView: 6,
                                spaceBetween: 10,
                            },
                        }}
                    >

                        {
                            novels.results.map((novel) => {
                                return (
                                    <SwiperSlide key={novel.slug} className='col-span-1'>
                                        <NovelCard novel={novel} addToMark={addNovelToMark}/>
                                    </SwiperSlide>
                                )
                            })
                        }

                    </Swiper>
                </div>
            </div>
        </div>

    );
};

export default Index;
