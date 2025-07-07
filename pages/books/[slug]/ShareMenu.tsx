import React, {Fragment} from 'react';
import {Menu, Transition} from "@headlessui/react";
import {
    FacebookIcon,
    FacebookShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterIcon,
    TwitterShareButton
} from "react-share";
import {useRouter} from "next/router";
import useTranslation from 'next-translate/useTranslation';

const ShareMenu = () => {

    const router = useRouter();
    let shareUrl: string = '';

    const {t} = useTranslation('common')

    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        shareUrl =  'https://' + hostname + router.asPath
    }

    return (
        <Menu as="div" className="relative md:mb-3">

            <Menu.Button className="w-full flex items-center justify-center text-white block bg-primary rounded-md px-3 py-2 text-xs md:text-base  active:scale-99">

                    {t('share')}

                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
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
                <Menu.Items className="absolute right-0 w-44 p-2 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div>
                        <Menu.Item>
                            <FacebookShareButton url={shareUrl} className='w-full'>
                                <div className='w-full text-black px-3 py-2 block font-medium rounded flex items-center transition hover:bg-red-50 hover:text-primary block w-full cursor-pointer'>
                                    <FacebookIcon size={32} round className='mr-2'/>
                                    Facebook
                                </div>
                            </FacebookShareButton>
                        </Menu.Item>
                        <Menu.Item>

                                <TelegramShareButton url={shareUrl} className='w-full'>
                                    <div className='text-black px-3 py-2 block font-medium rounded flex items-center transition hover:bg-red-50 hover:text-primary block w-full'>
                                        <TelegramIcon size={32} round  className='mr-2'/>
                                        Telegram
                                    </div>
                                </TelegramShareButton>

                        </Menu.Item>
                        <Menu.Item>
                                <TwitterShareButton url={shareUrl} className='w-full'>
                                    <div className='text-black px-3 py-2 block font-medium rounded flex items-center transition hover:bg-red-50 hover:text-primary block w-full'>
                                        <TwitterIcon size={32} round className='mr-2'/>
                                        Twitter
                                    </div>
                                </TwitterShareButton>
                        </Menu.Item>
                    </div>

                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default ShareMenu;
