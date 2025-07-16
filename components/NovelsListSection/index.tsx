import React, {useEffect, useState} from 'react';
import {Navigation} from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import {useRouter} from "next/router";
import NovelCard from "../NovelCard";
import $api from "../../http";
import {IListResponse} from "../../models/Response/IListResponse";
import {INovel} from "../../models/INovel";
import {ICategory} from "../../models/ICategory";
import SectionListWrapper from "../SectionListWrapper";
import {deleteFromSavedNovel, fetchNovels, saveNovel} from "../../store/actions/novel";
import {useDispatch} from "react-redux";

interface Props {
    category: ICategory;
    activeTab: string;
}

const Index:React.FC<Props> = ({category, activeTab}) => {

    const {locale} = useRouter();
    const [novelsByCat, setNovels] = useState<INovel[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchNovelsSection()
    }, [category])

    const fetchNovelsSection = async () =>  {
        try {
            const response = await $api.get<IListResponse<INovel[]>>(locale + '/api/novels/', {
                params: {
                    category: category.name
                }
            })
            setNovels(response.data.data)
        }catch (e){
            console.log(e)
        }
    }

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

        await fetchNovelsSection()

        await dispatch(fetchNovels({locale: locale, opt: {
                params: {
                    [activeTab]: 'true'
                }
        }}));

    }

    return (
        <div>
            {
                novelsByCat.length > 0 &&
                <SectionListWrapper title={category.name}>
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
                            novelsByCat.map((novel)=>(
                                <SwiperSlide key={novel.slug}>
                                    <NovelCard novel={novel} addToMark={addNovelToMark}/>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </SectionListWrapper>
            }

        </div>

    );
};

export default Index;
