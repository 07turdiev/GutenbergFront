import React from 'react';
import CategoryLabel from "../Ui/CategoryLabel";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper";
import {ICategory} from "../../models/ICategory";
import classes from './style.module.scss';


interface Props {
    categories: ICategory[]
}

const Index:React.FC<Props> = ({categories}) => {
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
                categories.map((category)=>(
                    <SwiperSlide className='w-auto' key={category.slug} style={{width: 'auto'}}>
                        <CategoryLabel slug={category.Nomi || category.name}>
                            {category.Nomi || category.name}
                        </CategoryLabel>
                    </SwiperSlide>
                ))
            }
        </Swiper>
    );
};

export default Index;