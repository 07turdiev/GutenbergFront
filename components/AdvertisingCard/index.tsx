import React from 'react';
import img from '../../assets/images/For_banner2 2.png'
import Image from 'next/image';
import classNames from "classnames";
import {IAdvertising} from "../../models/IAdvertising";
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    left?: boolean;
    background?: string;
    banner: IAdvertising;
}

const Index: React.FC<Props> = ({ left, banner }) => {
    const {t} = useTranslation('common')

   if(!banner.link){
       return  null
   }

    return (
        <div className=' lg:px-5 lg:py-5 px-3 py-2 rounded-xl bg-amber-400 text-white h-full' style={{backgroundColor: banner.color}}>
            <div className="grid grid-cols-12 items-center">

                <div className="sm:col-span-7 col-span-8 order-2">
                    <h3 className='font-bold lg:mb-6 lg:mt-4 mb-3 lg:text-lg text-sm lg:leading-6 leading-4'>{banner.text}</h3>
                    <Link href={banner.link}>
                        <a className='border border-white px-3 py-2 text-xs text-white rounded-3xl' target='_blank'>{t('moreDetails')}</a>
                    </Link>
                </div>

                <div className={classNames("sm:col-span-5 col-span-4", {
                    'order-1': left,
                    'order-3': !left
                })}>
                    <div className="relative w-full sm:h-32 h-24">
                        <Image src={img} layout='fill' objectFit='contain'/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;