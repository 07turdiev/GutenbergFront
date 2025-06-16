import React from 'react';
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import {useRouter} from "next/router";
import Link from 'next/link';

const Index = () => {
    const router = useRouter();
    const { locales, locale: activeLocale } = router

    return (
        <Menu as="div" className="relative inline-block text-left border-l border-gray-200 lg:pl-3">
            <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                {activeLocale}
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
                <Menu.Items className="absolute right-0 w-12 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md overflow-hidden shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {
                        locales?.map((locale, index) => {

                            const { pathname, query, asPath } = router

                            if(activeLocale !== locale) {
                                return (
                                <Menu.Item key={locale}>
                                    <Link href={{ pathname, query }} as={asPath} locale={locale}>
                                        <a className='block text-center px-3 py-1 hover:bg-gray-100 text-sm'>{locale}</a>
                                    </Link>
                                </Menu.Item>

                                )
                            }

                        })
                    }

                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default Index;
