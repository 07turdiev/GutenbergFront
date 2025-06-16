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
import ShareMenu from "../../pages/novels/[slug]/ShareMenu";
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

                        <div className='w-full xl:h-52 sm:h-48 h-32 relative mb-3 rounded-lg overflow-hidden'>
                            {
                                novel && novel.cover  ?
                                    <Image quality={100} src={novel.cover} layout='fill' objectFit='cover' priority/>
                                :
                                    <Image src={noPhoto} layout='fill' objectFit='cover'/>
                            }

                        </div>

                        <div className='hidden md:flex'>

                            {
                                novel.saved ?
                                    <button className={classNames('w-8 h-8 shrink-0 mr-1 rounded-md border text-white bg-primary border-primary transition hover:border-primary flex items-center justify-center')} onClick={()=>addNovelToMark(novel.slug, novel.saved)} type='button'>
                                        <svg width="14" height="18" viewBox="0 0 18 21"  xmlns="http://www.w3.org/2000/svg" fill='currentColor'>
                                            <path d="M14.833 0H3.16634C1.88301 0 0.833008 1.05 0.833008 2.33333V21L8.99968 17.5L17.1663 21V2.33333C17.1663 1.05 16.1163 0 14.833 0ZM14.833 17.5L8.99968 14.9567L3.16634 17.5V3.5C3.16634 2.85833 3.69134 2.33333 4.33301 2.33333H13.6663C14.308 2.33333 14.833 2.85833 14.833 3.5V17.5Z"/>
                                        </svg>
                                    </button>
                                    :
                                    <button className={classNames('w-8 h-8 shrink-0 mr-1 rounded-md border transition  border-primary text-primary flex items-center justify-center')} onClick={()=>addNovelToMark(novel.slug, novel.saved)}>
                                        <svg width="14" height="18" viewBox="0 0 18 21"  xmlns="http://www.w3.org/2000/svg" fill='currentColor'>
                                            <path d="M14.833 0H3.16634C1.88301 0 0.833008 1.05 0.833008 2.33333V21L8.99968 17.5L17.1663 21V2.33333C17.1663 1.05 16.1163 0 14.833 0ZM14.833 17.5L8.99968 14.9567L3.16634 17.5V3.5C3.16634 2.85833 3.69134 2.33333 4.33301 2.33333H13.6663C14.308 2.33333 14.833 2.85833 14.833 3.5V17.5Z"/>
                                        </svg>
                                    </button>
                            }

                            <Menu as="div" className="relative inline-block w-full">
                                <Menu.Button className='w-full text-white text-sm bg-gradient-to-r from-primary to-accent border-none h-[32px] rounded-md hover:opacity-90 transition active:scale-99  disabled:opacity-25'>
                                    {t('download') }
                                </Menu.Button>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-[110px] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="px-1 py-1 ">
                                            {
                                                trackList.audioListRu.length ?
                                                    <Menu.Item>
                                                        <a href={`https://akback.technocorp.uz/ru/api/novels/${novel.slug}/zip/`} className='block px-3 py-1 text-gray-900 hover:bg-gray-100 transition rounded-md'>ru</a>
                                                    </Menu.Item>
                                                : null
                                            }

                                            {
                                                trackList.audioListUz.length ?
                                                    <Menu.Item>
                                                        <a href={`https://akback.technocorp.uz/uz/api/novels/${novel.slug}/zip/`} className='block px-3 py-1 text-gray-900 hover:bg-gray-100 transition rounded-md'>uz</a>
                                                    </Menu.Item>
                                                : null
                                            }


                                        </div>

                                    </Menu.Items>
                                </Transition>

                            </Menu>


                        </div>

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

                    <div className="col-span-7 md:col-span-6">
                        <div className="flex items-center">
                            {
                                novel.saved ?
                                    <button className={classNames('w-9 h-9 shrink-0 mr-1 rounded-md border text-white bg-primary border-primary transition hover:border-primary flex items-center justify-center')} onClick={()=>addNovelToMark(novel.slug, novel.saved)} type='button'>
                                        <svg width="14" height="18" viewBox="0 0 18 21"  xmlns="http://www.w3.org/2000/svg" fill='currentColor'>
                                            <path d="M14.833 0H3.16634C1.88301 0 0.833008 1.05 0.833008 2.33333V21L8.99968 17.5L17.1663 21V2.33333C17.1663 1.05 16.1163 0 14.833 0ZM14.833 17.5L8.99968 14.9567L3.16634 17.5V3.5C3.16634 2.85833 3.69134 2.33333 4.33301 2.33333H13.6663C14.308 2.33333 14.833 2.85833 14.833 3.5V17.5Z"/>
                                        </svg>
                                    </button>
                                    :
                                    <button className={classNames('w-9 h-9 shrink-0 mr-1 rounded-md border transition  border-primary text-primary flex items-center justify-center')} onClick={()=>addNovelToMark(novel.slug, novel.saved)}>
                                        <svg width="14" height="18" viewBox="0 0 18 21"  xmlns="http://www.w3.org/2000/svg" fill='currentColor'>
                                            <path d="M14.833 0H3.16634C1.88301 0 0.833008 1.05 0.833008 2.33333V21L8.99968 17.5L17.1663 21V2.33333C17.1663 1.05 16.1163 0 14.833 0ZM14.833 17.5L8.99968 14.9567L3.16634 17.5V3.5C3.16634 2.85833 3.69134 2.33333 4.33301 2.33333H13.6663C14.308 2.33333 14.833 2.85833 14.833 3.5V17.5Z"/>
                                        </svg>
                                    </button>
                            }

                            <ThemeButton block gradient size='xs' color='white' className='h-9'>
                                {t('download')}(62mb)
                            </ThemeButton>
                        </div>
                    </div>

                    <div className="col-span-5 md:col-span-6">
                        <ShareMenu/>
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
