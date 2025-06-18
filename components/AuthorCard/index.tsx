import React from 'react';
import {IAuthor} from "../../models/IAuthors";
import Image from 'next/image';
import {useRouter} from "next/router";
import noPhoto from '../../assets/images/noPhotoAvtor.jpg';

interface Props {
    author: IAuthor;
    link?: string;
}

const Index:React.FC<Props> = ({author, link}) => {

    const router = useRouter();

    return (
        <div className='group' onClick={()=>router.push(link ? link : `/authors/${author.slug}`)}>
            <div className='md:w-[100px] md:h-[100px] w-[80px] h-[80px] rounded-full relative mb-5 '>
                <div className='absolute md:w-[104px] md:h-[104px] w-[84px] h-[84px] bg-gradient-to-r from-orange-300 via-red-500 to-pink-500 rounded-full'/>
                <div className='absolute top-[2px] left-[2px] bg-gray-50 z-12 w-full h-full rounded-full text-2xl flex items-center justify-center font-medium cursor-pointer overflow-hidden'>
                    {
                        author.photo ?
                            <Image 
                                src={author.photo.src} 
                                layout='fill' 
                                {...(author.photo.base64 && author.photo.base64 !== '' ? {placeholder: 'blur', blurDataURL: author.photo.base64} : {})}
                                objectFit='cover' 
                                objectPosition='top center'
                            />
                        :
                            <Image src={noPhoto} layout='fill' objectFit='cover' objectPosition='top center'/>
                    }

                </div>
            </div>
            <div className='font-bold leading-5 lg:text-base md:text-md text-sm group-hover:text-primary transition cursor-pointer'>
                {author.name}
            </div>
            <div className='text-gray-400'>
                {author.novels_count} книг
            </div>
        </div>
    );
};

export default Index;
