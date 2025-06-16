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


    return (
        <div className='bg-gray-100 rounded-xl grid grid-cols-12 gap-3 px-3 md:py-8 py-4 items-center h-full'>

            <div className='col-span-4'>
                <div onClick={() => router.push('/novels/' + novel.slug)} className='lg:h-60 sm:h-52 h-32 w-full relative ml-auto mr-auto cursor-pointer'>
                    <Image src={novel.cover.src} priority={true} layout='fill' objectFit='contain'/>
                </div>
            </div>

            <div className="col-span-8 lg:pr-16">

                <h2 onClick={() => router.push('/novels/' + novel.slug)}  className='font-bold lg:text-3xl lg:leading-9 sm:text-2xl text-base leading-4 mb-1 transition cursor-pointer'>
                    {novel.name}
                </h2>

                <div className='flex items-center mb-2 flex-wrap'>


                    <div onClick={() => router.push(`/authors/${novel.author.slug}`)} className='text-gray-400 mr-3 hover:text-primary cursor-pointer'>{novel.author.name}</div>

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
                            novel.genre.map((genre)=>  {
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
                            <ThemeButton gradient rounded color={'white'} onClick={()=>router.push('/novels/' + novel.slug)} className='text-xs px-3 md:text-base'>
                                <span className='flex items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                        {t('listen')}
                                </span>
                            </ThemeButton>
                        </div>
                    </div>
                </div>




            </div>
        </div>
    );
};


export default Index;
