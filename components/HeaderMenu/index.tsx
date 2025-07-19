import React, { useState } from 'react';
import { Menu } from "../../utils/menu";
import { useRouter } from "next/router";
import Link from 'next/link';
import classNames from "classnames";
import SearchBtn from "../Header/SearchBtn";
import LocaleSwitcher from '../LocaleSwitcher';
import MobileAuthButtons from '../Header/MobileAuthButtons';
import MobileAuthIndicator from '../Header/MobileAuthIndicator';

const Index = () => {

    const router = useRouter();
    const { locale, pathname } = router;
    const [visible, setVisible] = useState(false);

    return (
        <div>

            <div className='text-right flex lg:hidden w-full justify-end items-center space-x-3'>
                {/* <MobileAuthIndicator /> */}
                <button onClick={() => setVisible(!visible)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>

            <div className={classNames(
                'lg:flex',
                'lg:static',
                'lg:w-full',
                'lg:translate-x-0',
                'fixed',
                'right-0',
                'top-0',
                'sm:w-2/3',
                'w-full',
                'h-full',
                'lg:bg-transparent',
                'transition',
                'bg-white',
                "overflow-y-auto",
                'z-50',
                'lg:z-auto',
                {
                    'translate-x-full': !visible,
                    'translate-x-0': visible
                }
            )}>

                <div className='lg:hidden block'>
                    <div className='flex shadow py-3 px-3 items-center justify-between'>
                        <button className="mr-3" onClick={() => setVisible(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="flex items-center space-x-2">
                            <LocaleSwitcher />
                            <SearchBtn />
                        </div>
                    </div>
                    {/* Auth section for mobile */}
                    <div className="px-3 py-3 border-b border-gray-100">
                        <MobileAuthButtons onClose={() => setVisible(false)} />
                    </div>
                </div>

                <ul className='lg:flex'>
                    {
                        Menu[locale].map((item) => {
                            const isActive = pathname === item.href || 
                                           (item.href !== '/' && pathname.startsWith(item.href));
                            
                            return (
                                <li key={item.href}>
                                    <Link href={item.href}>
                                        <a className={classNames(
                                            'lg:border-0 block px-4 py-3 font-medium px-3 py-2 border-b border-b-gray-50 transition-colors duration-200',
                                            {
                                                'text-primary bg-red-50 lg:bg-transparent lg:border-b-2 lg:border-primary': isActive,
                                                'text-gray-700 hover:text-primary-hover hover:bg-red-50 lg:hover:bg-transparent': !isActive
                                            }
                                        )}>
                                            {item.title}
                                        </a>
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>

            </div>

            {/* Backdrop for mobile menu */}
            {visible && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" 
                    onClick={() => setVisible(false)}
                />
            )}

        </div>
    );
};

export default Index;
