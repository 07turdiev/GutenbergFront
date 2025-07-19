import React, {useEffect} from 'react';
import SiteLogo from "../SiteLogo/SiteLogo";
import TelegramBotBanner from '../../assets/images/telegram_bot_banner.svg';
import Image from 'next/image';
import Link from 'next/link';
import {useAppSelector} from "../../hooks/reducer";
import {selectTrack} from "../../store/selectors/player";
import classNames from "classnames";
import {FacebookIcon, InstagramIcon, TelegramIcon, YoutubeIcon, XIcon} from "../Ui/Icons/socList";
import useTranslation from 'next-translate/useTranslation';
import {useDispatch} from "react-redux";
import {fetchAbout, fetchContacts, fetchSocialLinks} from "../../store/actions/about";
import {selectAbout, selectSocialLinks} from "../../store/selectors/about";
import {useRouter} from "next/router";

const Index = () => {

    const { active_slug } = useAppSelector(selectTrack);
    const {t} = useTranslation('common')
    const dispatch = useDispatch();
    const {social} = useAppSelector(selectSocialLinks)
    const {contacts} = useAppSelector(selectAbout)
    const {locale} = useRouter();

    const getContacts = async () => {
        await dispatch(fetchSocialLinks({locale}));
        await dispatch(fetchContacts({locale}));
    }

    useEffect(()=>{
        getContacts();
    }, [locale])


    return (
        <footer className={classNames('pt-10 bg-zinc-800 text-white')} style={{
            paddingBottom: active_slug ? 96 : 0
        }}>
            <div className="container mx-auto px-3">
                <div className="grid grid-cols-2">

                    <div className="md:col-span-1 col-span-2 mb-5">

                        <div className="mb-5 cursor-pointer md:mx-0 flex w-full justify-center md:justify-start">
                            <SiteLogo white/>
                        </div>

                        {
                            contacts ?
                                <>
                                    <div className='flex w-full items-center md:items-start flex-col mt-5 mb-7 md:mb-0'>
                                        {contacts.address && (
                                            <div className='flex items-center mb-3'>
                                                <span
                                                    className='w-8 h-8 bg-primary text-white rounded-2xl flex items-center justify-center mr-2'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                                         viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                    </svg>
                                                </span>
                                                <span>{t('address')}: {contacts.address}</span>
                                            </div>
                                        )}
                                        <a href={`tel:${contacts.phone}`} className='flex items-center mb-3'>
                                            <span
                                                className='w-8 h-8 bg-primary text-white rounded-2xl flex items-center justify-center mr-2'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                  <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                                </svg>
                                            </span>
                                            {contacts.phone}
                                        </a>

                                        <a href={`mailto:${contacts.email}`} className='flex items-center'>
                                            <span
                                                className='w-8 h-8 bg-primary text-white rounded-2xl flex items-center justify-center mr-2'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                                </svg>
                                            </span>
                                            {contacts.email}
                                        </a>
                                    </div>
                                </>
                            : null
                        }




                    </div>


                    <div className="md:col-span-1 col-span-2">
                        <div className="flex md:items-end items-center  flex-col  md:text-left text-center w-full">
                            <h3 className='text-xl md:mb-10 mb-5'>{t('downloadApp')}</h3>

                            <div>
                                <a href="https://t.me/gutenbergnu_bot" target="_blank" rel="noopener noreferrer" className='inline-block hover:opacity-80 transition-opacity'>
                                    <Image src={TelegramBotBanner} alt="Telegram bot" width={200} height={50}/>
                                </a>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            <div className="container mx-auto px-3 text-sm text-center flex flex-row justify-center md:justify-end py-4 md:py-1 text-gray-400">
                <span>{t('madeByElbek')}</span><a href="https://t.me/turdiev07" target="_blank" className='uppercase hover:text-white transition ml-1'>Elbek Turdiyev</a>
            </div>

            <div className="container mx-auto px-3 mt-2 pb-5">
                <div className='grid grid-cols-6 border-t border-zinc-600 pt-5'>

                    <div className="lg:col-span-4 col-span-6">

                        <div className="flex flex-wrap w-full text-sm lg:justify-start justify-center">

                            <p className='md:w-auto md:mb-0 w-full mb-2 opacity-50 text-center lg:text-left'>
                                {t('copyRight')} © | {(new Date()).getFullYear()}
                            </p>

                            <Link href='/rules'>
                                <a className='px-2  text-white opacity-50 transition hover:opacity-100'>{t('termsOfUse')}</a>
                            </Link>

                            <Link href='/privacy-policy'>
                                <a className='px-2   text-white opacity-50 transition hover:opacity-100'>{t('privacyPolicy')}</a>
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-2 col-span-6">
                        <div className="lg:text-right text-center mt-4 lg:mt-0">
                            {
                                social.map((item) => {
                                    switch (item[0]){
                                        case 'facebook_url': {
                                            return(
                                                <Link href={item[1]} key={item[0]}>
                                                    <a className='px-2 inline-block text-white transition' target='_blank'>
                                                        <FacebookIcon/>
                                                    </a>
                                                </Link>
                                            )
                                        }
                                        case 'telegram_url': {
                                            return(
                                                <Link href={item[1]} key={item[0]}>
                                                    <a className='px-2 inline-block text-white transition' target='_blank'>
                                                        <TelegramIcon/>
                                                    </a>
                                                </Link>
                                            )
                                        }
                                        case 'instagram_url': {
                                            return(
                                                <Link href={item[1]} key={item[0]}>
                                                    <a className='px-2 inline-block text-white transition' target='_blank'>
                                                        <InstagramIcon/>
                                                    </a>
                                                </Link>
                                            )
                                        }
                                        case 'youtube_url': {
                                            return(
                                                <Link href={item[1]} key={item[0]}>
                                                    <a className='px-2 inline-block text-white transition' target='_blank'>
                                                        <YoutubeIcon/>
                                                    </a>
                                                </Link>
                                            )
                                        }
                                        case 'x_url': {
                                            return(
                                                <Link href={item[1]} key={item[0]}>
                                                    <a className='px-2 inline-block text-white transition' target='_blank'>
                                                        <XIcon/>
                                                    </a>
                                                </Link>
                                            )
                                        }
                                        default: {
                                            return null
                                        }
                                    }
                                })
                            }

                        </div>

                    </div>

                </div>
            </div>

        </footer>
    );
};

export default Index;