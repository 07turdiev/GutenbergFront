import React from 'react';
import CategoryLabel from "../Ui/CategoryLabel";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper";
import {IGenre} from "../../models/IGenre";
import classes from './style.module.scss';


interface Props {
    genres: IGenre[]
}

const Index:React.FC<Props> = ({genres}) => {
    return (
        <Swiper
            slidesPerView={"auto"}
            spaceBetween={10}
            navigation={true}
            modules={[Navigation]}
            className={classes.root}
            breakpoints={{
                768: {
                    //navigation: true
                },
            }}
        >
            {
                genres.map((genre)=>(
                    <SwiperSlide className='w-auto' key={genre.slug} style={{width: 'auto'}}>
                        <CategoryLabel slug={genre.name}>
                            {genre.name}
                        </CategoryLabel>
                    </SwiperSlide>
                ))
            }
        </Swiper>
    );
};

export default Index;