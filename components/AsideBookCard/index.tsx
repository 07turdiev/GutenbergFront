import React from 'react'
import Image from "next/image";
import ThemeButton from "../Ui/ThemeButton";
import {INovel} from "../../models/INovel";
import {useRouter} from "next/router";
import {deleteFromSavedNovel, fetchNovelOne, saveNovel} from "../../store/actions/novel";
import {useDispatch} from "react-redux";
import {setIsSaved} from "../../store/actions/player";
import classNames from "classnames";
import ReactStars from "react-rating-stars-component";
import ShareMenu from "../../pages/books/[slug]/ShareMenu";
import useTranslation from 'next-translate/useTranslation';
import {useAppSelector} from "../../hooks/reducer";
import {selectAuth} from "../../store/selectors/auth";
import noPhoto from "../../assets/images/noPhotoNovel.jpg"
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import {fetchNovelsOfAuthor} from "../../store/actions/author";
import {selectAudioListByLang} from "../../store/selectors/novel";

interface Props {
    novel: INovel;
    sendNovelRating: (rating: number) => void;
}

const Index:React.FC<Props> = ({novel, sendNovelRating}) => {

    const {isLogin} = useAppSelector(selectAuth)
    const dispatch = useDispatch();
    const {locale} = useRouter();
    const router = useRouter();
    const {t} = useTranslation('common')

    const {...trackList} = useAppSelector(selectAudioListByLang);


    const addNovelToMark = async (slug, saved) => {

        if(!isLogin){
            router.push('/login');
            return
        }

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

        await dispatch(fetchNovelOne({
            locale: locale,
            slug: novel.slug
        }))
    }


    return (
        <div>
            <div className='p-4 bg-gray-100 rounded-lg mb-2 '>

                <div className='grid grid-cols-12 gap-4 md:gap-0'>
                    <div className="col-span-4 md:col-span-12">

                        <div className='w-full xl:h-80 lg:h-72 md:h-64 sm:h-56 h-40 relative mb-3 rounded-lg overflow-hidden'>
                            {
                                novel && novel.cover  ?
                                    <Image quality={100} src={novel.cover} layout='fill' objectFit='cover' priority/>
                                :
                                    <Image src={noPhoto} layout='fill' objectFit='cover'/>
                            }

                            {/* Save button positioned on top-right of image */}
                            <button 
                                className={classNames(
                                    'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10',
                                    {
                                        'bg-red-500 text-white shadow-lg hover:bg-red-600': novel.saved,
                                        'bg-white text-gray-600 shadow-lg hover:bg-gray-100 hover:text-red-500': !novel.saved
                                    }
                                )} 
                                onClick={()=>addNovelToMark(novel.slug, novel.saved)}
                            >
                                <svg 
                                    width="16" 
                                    height="16" 
                                    viewBox="0 0 24 24" 
                                    fill={novel.saved ? 'currentColor' : 'none'} 
                                    stroke="currentColor" 
                                    strokeWidth="2"
                                >
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                </svg>
                            </button>

                        </div>

                        {/* Save button moved to image overlay */}

                    </div>

                    <div className="col-span-8 md:hidden">
                        <h1 className='font-bold text-xl mb-3'>{novel.name}</h1>

                        <div className='mb-3'>

                            <div>
                                {
                                    novel && novel.author ?
                                        <div className='text-primary mr-5 cursor-pointer' onClick={()=>router.push(`/authors/${novel.author.slug}`)}>
                                            {novel.author.name}
                                        </div>
                                        : null
                                }
                            </div>


                            <div className='flex items-center mb-5'>
                                <ReactStars
                                    count={5}
                                    value={novel.rating}
                                    size={24}
                                    color="#D0D0D0"
                                    half={true}
                                    edit={true}
                                    activeColor="#ffd700"
                                    onChange={sendNovelRating}
                                />

                                <span className='ml-2 font-bold'>
                                      {novel.rating.toFixed(0)}
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

                <div className='md:hidden grid grid-cols-12 gap-1 items-center'>

                    <div className="col-span-12">
                        <div className="flex items-center justify-center">
                            <ShareMenu/>
                        </div>
                    </div>

                </div>


            </div>

            <div className="hidden md:block">
                <ShareMenu/>
            </div>



        </div>
    );
};

export default Index;
