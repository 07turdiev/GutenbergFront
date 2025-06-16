import React from 'react';

import AuthorCard from "../AuthorCard";
import {useAppSelector} from "../../hooks/reducer";
import {selectAuthors} from "../../store/selectors/author";
import MoreBtn from "../Ui/MoreBtn";
import {useRouter} from "next/router";
import useTranslation from "next-translate/useTranslation";
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation} from "swiper";

const Index = () => {

    const {followedAuthors} = useAppSelector(selectAuthors)
    const {t} = useTranslation('common')
    const router = useRouter();

    return (
        <>
            <div className="text-right mb-5">
                <MoreBtn onClick={() => router.push('subscribes/authors')}>{t('showAll')}</MoreBtn>
            </div>

            <div className='w-full flex shrink-1 container  mx-auto relative overflow-hidden'>
                <Swiper
                    className='w-full'
                    slidesPerView={3}
                    spaceBetween={10}
                    navigation={true}
                    modules={[Navigation]}
                    breakpoints={{
                        768: {
                            slidesPerView: 5,
                            spaceBetween: 10,
                        },
                        1170: {
                            slidesPerView: 7,
                            spaceBetween: 10,
                        },
                    }}
                >
                    {
                        followedAuthors.results.map((author)=>(
                            <SwiperSlide  key={author.slug}>
                                <AuthorCard author={author}/>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>

        </>

    );
};

export default Index;