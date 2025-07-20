import React from 'react';
import {useRouter} from "next/router";
import icon from '../../../assets/images/catIcon.png'
import Image from 'next/image';

interface Props {
    slug: string;
}

const Index:React.FC<Props> = ({children, slug}) => {
    const router = useRouter();
    return (
        <button
                className='md:px-4 px-2 py-2 bg-gray-100 rounded-md flex items-center transition hover:bg-primary hover:text-white '
                onClick={()=>router.push(`/categories/${slug}`)}
        >
            <span className='relative md:w-8 md:h-8 h-6 w-6 rounded-full bg-white flex items-center justify-center mr-2'>
                <Image src={icon} objectFit='contain' layout='fill'/>
            </span>

            {children}
        </button>
    );
};

export default Index;
