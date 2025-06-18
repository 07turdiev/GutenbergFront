import React from 'react';
import ReactStars from "react-rating-stars-component";
import CatBtn from "../Ui/CatBtn";
import ThemeButton from "../Ui/ThemeButton";
import {INovel} from "../../models/INovel";
import Image from 'next/image';
import {useRouter} from "next/router";
import { v4 as uuidv4 } from 'uuid';
import useTranslation from "next-translate/useTranslation";



interface Props {
    novel: INovel;
}

const Index:React.FC<Props> = ({novel}) => {

    const router = useRouter();
    const { t } = useTranslation('common');


    if (!novel) {
        return (
            <div className='bg-gray-100 rounded-xl px-3 md:py-8 py-4 h-full flex items-center justify-center'>
                <span className='text-gray-400'>No novel data available</span>
            </div>
        );
    }

    return (
        <div className='bg-gray-100 rounded-xl grid grid-cols-12 gap-3 px-3 md:py-8 py-4 items-center h-full'>

            <div className='col-span-4'>
                <div onClick={() => router.push('/novels/' + novel.slug)} className='lg:h-60 sm:h-52 h-32 w-full relative ml-auto mr-auto cursor-pointer'>
                    {novel.cover && novel.cover.src ? (
                        <Image src={novel.cover.src} priority={true} layout='fill' objectFit='contain'/>
                    ) : (
                        <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                            <span className='text-gray-400'>No cover</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="col-span-8 lg:pr-16">

                <h2 onClick={() => router.push('/novels/' + novel.slug)}  className='font-bold lg:text-3xl lg:leading-9 sm:text-2xl text-base leading-4 mb-1 transition cursor-pointer'>
                    {novel.name}
                </h2>

                <div className='flex items-center mb-2 flex-wrap'>


                    {novel.author && (
                        <div onClick={() => router.push(`/authors/${novel.author.slug}`)} className='text-gray-400 mr-3 hover:text-primary cursor-pointer'>{novel.author.name}</div>
                    )}

                    <div className='mr-3 flex items-center font-bold'>
                        <ReactStars
                            count={5}
                            value={3}
                            size={20}
                            color="#D0D0D0"
                            edit={false}
                            activeColor="#ffd700"
                        />
                        <span className='ml-2'>
                            {novel.rating.toFixed(0)}
                        </span>
                    </div>
                </div>



                <div className='grid grid-cols-12 items-center'>
                    <div className="col-span-5 sm:col-span-12 gap-2">
                        {
                            novel.genre && novel.genre.map((genre)=>  {
                                return(
                                    <CatBtn onClick={() => router.push(`/genres/${genre}`)} key={uuidv4()} className='text-xs'>
                                        {genre}
                                    </CatBtn>
                                )
                            })
                        }
                    </div>
                    <div className="col-span-7 sm:col-span-12 ">
                        <div className='sm:mt-10'>
                            {novel.audio_list && novel.audio_list.length > 0 ? (
                                <ThemeButton gradient rounded color={'white'} onClick={()=>router.push(`/novels/${novel.slug}/track-list`)} className='text-xs px-3 md:text-base'>
                                    <span className='flex items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                            {t('listen')}
                                    </span>
                                </ThemeButton>
                            ) : (
                                <ThemeButton gradient rounded color={'white'} onClick={()=>router.push('/novels/' + novel.slug)} className='text-xs px-3 md:text-base'>
                                    <span className='flex items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" clipRule="evenodd" />
                                        </svg>
                                            {t('read') || 'O\'qish'}
                                    </span>
                                </ThemeButton>
                            )}
                        </div>
                    </div>
                </div>




            </div>
        </div>
    );
};


export default Index;
