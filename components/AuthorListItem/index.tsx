import React from 'react';
import Image from "next/image";
import {IAuthor} from "../../models/IAuthors";
import noPhoto from '../../assets/images/noPhotoAvtor.jpg';
import {useRouter} from "next/router";
import {IReader} from "../../models/IReader";
import useTranslation from "next-translate/useTranslation";

interface Props {
    author: IAuthor | IReader;
    isReader?: boolean;
}

const Index:React.FC<Props> = ({author, isReader}) => {

    const router = useRouter();
    const {t} = useTranslation('common');

    const toDetailPage = () => {
        if(isReader){
            router.push(`/readers/${author.slug}`)
        }else{
            router.push(`/authors/${author.slug}`)
        }
    }

    return (
        <div key={author.slug} className='flex items-center mb-2 px-5 py-2 rounded odd:bg-gray-100 cursor-pointer group' onClick={toDetailPage}>
            <div className='w-[80px] h-[80px] rounded-full relative'>
                <div className='absolute w-[84px] h-[84px]  bg-gradient-to-r from-orange-300 via-red-500 to-pink-500 rounded-full'/>
                <div className='absolute top-[2px] left-[2px] bg-gray-50 z-12 w-full h-full rounded-full text-2xl flex items-center justify-center font-medium cursor-pointer overflow-hidden'>
                    {
                        author.photo ?
                            <Image src={author.photo.src} layout='fill' objectFit='cover' objectPosition='top center'/>
                        :
                            <Image src={noPhoto} layout='fill' objectFit='cover' objectPosition='top center'/>
                    }

                </div>
            </div>
            <div className='pl-5'>
                <h2 className='font-bold  text-xl group-hover:text-primary transition'>{author.name}</h2>
                <div className='text-gray-400'>{author.novels_count} {t('novelCountTitle')}</div>
            </div>
        </div>
    );
};

export default Index;