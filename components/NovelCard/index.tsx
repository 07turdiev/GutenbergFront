import React from 'react';
import {INovel} from "../../models/INovel";
import Image from 'next/image';
import ReactStars from "react-rating-stars-component";
import CatBtn from "../Ui/CatBtn";
import TextTruncate from 'react-text-truncate';
import {useRouter} from "next/router";
import classes from './style.module.scss';
import {useAppSelector} from "../../hooks/reducer";
import {selectAuth} from "../../store/selectors/auth";
import noPhoto from '../../assets/images/noPhotoNovel.jpg';
import novelNew from '../../assets/images/noveNew.svg';
import * as moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
momentDurationFormatSetup(moment);

import classNames from "classnames";

interface Props {
    novel: INovel;
    addToMark?: (slug: string, saved: boolean) => void;
}

const Index:React.FC<Props> = ({novel, addToMark}) => {

    const {isLogin} = useAppSelector(selectAuth)
    const router = useRouter();

    let novelDuration;

    if(novel){
        if(router.locale === 'uz'){
            novelDuration = moment.duration(novel.duration_uz, "second").format("mm");
        }else{
            novelDuration =  moment.duration(novel.duration_ru, "second").format('mm');
        }
    }

    return (
        <div className='novelCard h-full flex flex-col relative overflow-hidden rounded-md p-1 group '>

            {
                novel.new ?
                    <div className={classes.label} style={{backgroundImage: `url(${novelNew.src})`}}>
                        <span className='relative'>
                            {router.locale === 'ru' ? 'Новый' : 'Yangi'}
                        </span>
                    </div>
                : null
            }
            <div className='relative h-60 shadow-md w-full mb-3 rounded-md overflow-hidden cursor-pointer' onClick={()=>router.push('/novels/' + novel.slug)}>

                {
                    novel.cover ?
                        <Image quality={100} src={novel.cover.src}  placeholder="blur" blurDataURL={novel.cover.base64} layout='fill' objectFit='cover' objectPosition='top center'/>
                    :
                        <Image quality={100} src={noPhoto}  placeholder="blur" blurDataURL={noPhoto.src} layout='fill' objectFit='cover' objectPosition='top center'/>
                }


            </div>

            <div className='flex mb-1 justify-between items-start '>

                <div className='font-bold grow leading-5 cursor-pointer transition duration-300 group-hover:text-orange-700'  onClick={()=>router.push('/novels/' + novel.slug)}>
                    <TextTruncate
                        key={isLogin}
                        line={2}
                        element="h2"
                        truncateText="…"
                        text={novel.name}
                    />
                </div>

                {
                    isLogin ?
                        <>
                            <button className={classNames( 'mt-2', {
                                'fill-transparent transition text-gray-400 hover:text-primary': !novel.saved,
                                'fill-primary text-primary': novel.saved,
                            })}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} onClick={()=>addToMark(novel.slug, novel.saved)}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </button>
                        </>

                    : null
                }


            </div>
            <div className='mr-3 flex items-center font-medium mb-1'>
                <ReactStars
                    count={5}
                    value={novel.rating}
                    size={20}
                    half
                    color="#D0D0D0"
                    edit={false}
                    activeColor="#ffd700"
                />
                <span className='ml-2'>
                    {novel.rating.toFixed(1)}
                </span>
            </div>
            <div className='text-gray-400 mb-3 cursor-pointer transition hover:text-primary text-sm'>
                {
                    novel.author ?
                       <div onClick={()=>router.push(`/authors/${novel.author.slug}`)} className='truncate'>
                           {novel.author.name}
                       </div>
                    : null

                }
            </div>
            <div className="flex items-center w-full mt-auto">
                <CatBtn size='xs' onClick={()=>router.push(`/genres/${novel.genre[0]}`)}>
                    {novel.genre[0]}
                </CatBtn>
                <span className='text-gray-400 ml-2 text-xs whitespace-nowrap'>
                    {novelDuration} мин
                </span>
            </div>
        </div>
    );
}

export default Index;
