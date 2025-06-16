import React from 'react';
import {IAuthor} from "../../models/IAuthors";
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation} from "swiper";
import AuthorCard from "../AuthorCard";


interface Props {
    authors: IAuthor[];
}

const Index:React.FC<Props> = ({authors}) => {
    return (
        <Swiper
            slidesPerView={3}
            spaceBetween={5}
            navigation={true}
            modules={[Navigation]}
            breakpoints={{
                480: {
                    slidesPerView: 5,
                    spaceBetween: 10,
                },
                768: {
                    slidesPerView: 5,
                    spaceBetween: 10,
                },
                1170: {
                    slidesPerView: 8,
                    spaceBetween: 10,
                },
            }}
        >
            {
                authors.map((author)=>(
                    <SwiperSlide className='col-span-1' key={author.slug}>
                        <AuthorCard author={author} />
                    </SwiperSlide>
                ))
            }
        </Swiper>
    );
};

export default Index;
