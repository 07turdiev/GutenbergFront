import React from 'react';
import SiteLogo from "../SiteLogo/SiteLogo";
import {useRouter} from "next/router";
import SearchBtn from "./SearchBtn";
import LocaleSwitcher from '../LocaleSwitcher';
import classes from './style.module.scss';
import classNames from "classnames";
import SearchForm from "../SearchForm";
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { useMenu } from '../contexts/MenuContext';


const Header = () => {

    const router = useRouter();
    const { t } = useTranslation('common');
    const { isMenuOpen, toggleMenu, closeMenu } = useMenu();
    const [showSearch, setShowSearch] = React.useState(false);

    // Menu sections for the drawer
    const menuSections = React.useMemo(() => {
        const isActive = (url: string) => url !== '#' && (router.asPath === url || router.asPath.startsWith(url + '/'));
        return [
            {
                title: t('menuMainSection'),
                items: [
                    { text: t('home'), url: '/', active: isActive('/') },
                    { text: t('books'), url: '/books', active: isActive('/books') },
                    { text: t('bookipedia'), url: '/bookipedia', active: isActive('/bookipedia') },
                    { text: t('authorsPage'), url: '/authors', active: isActive('/authors') },
                ],
            },
            {
                title: t('menuAboutSection'),
                items: [
                    { text: t('about'), url: '/about', active: isActive('/about') },
                    { text: t('contact'), url: '/contact', active: isActive('/contact') },
                    { text: t('termsOfUse'), url: '#', active: false },
                    { text: t('privacyPolicy'), url: '#', active: false },
                    { text: t('publisherDocuments'), url: '/documents', active: isActive('/documents') },
                ],
            },
        ];
    }, [router.asPath, router.locale, t]);

    return (
        <>
            <div className='py-3 shadow-lg fixed top-0 left-0 w-full z-50'>
                <div className={classNames('absolute top-0 left-0 w-full h-full ',  classes.blurred)} />
                <div className='container mx-auto px-3 relative z-30'>
                    <nav className="flex items-center justify-between">
                        {/* Left */}
                        <div className="flex items-center gap-5 flex-1">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center gap-2 text-gray-700 hover:text-black"
                            >
                                <span className="hidden md:inline text-base">{t('menu')}</span>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            {/* Mobile logo (left-shifted) */}
                            <div className='md:hidden w-24 cursor-pointer' onClick={()=>router.push('/')}> <SiteLogo white/> </div>

                            <div className="hidden md:flex items-center gap-4">
                                <button
                                    onClick={() => setShowSearch(true)}
                                    className="inline-flex items-center gap-2 text-gray-700 hover:text-black"
                                >
                                    <span>{t('search')}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                                <span className="text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none" className="w-5 h-5">
                                        <path d="M3.55762 3.19231V1" stroke="#383838" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M5.75 3.19231V1" stroke="#383838" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M7.94238 3.19231V1" stroke="#383838" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M9.76923 2.09619H1.73077C1.32718 2.09619 1 2.42337 1 2.82696V9.76927C1 10.1729 1.32718 10.5 1.73077 10.5H9.76923C10.1728 10.5 10.5 10.1729 10.5 9.76927V2.82696C10.5 2.42337 10.1728 2.09619 9.76923 2.09619Z" stroke="#383838" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M3.19238 5.75H8.30777" stroke="#383838" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M3.19238 7.94238H6.11546" stroke="#383838" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Center logo */}
                        <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
                            <div className='xl:w-36 w-28 cursor-pointer' onClick={()=>router.push('/')}> <SiteLogo white/> </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-4 justify-end flex-1">
                            <div className="hidden lg:block"><LocaleSwitcher/></div>
                            <button
                                onClick={() => router.push('/contact')}
                                className="hidden md:inline-flex items-center justify-center h-11 px-5 py-2.5 rounded-full bg-[#EB0000] text-white font-medium shadow-[0_5px_15px_-5px_rgba(235,0,0,0.5)] relative overflow-hidden group transition-all duration-300 ease-out group-hover:w-11 group-hover:px-0"
                            >
                                <span className="block transition-all duration-300 ease-out group-hover:opacity-0 group-hover:translate-y-2">{t('contact')}</span>
                                <span
                                    aria-hidden
                                    className="absolute inset-0 flex items-center justify-center -translate-y-full opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                        <path d="M10.2661 4.75722C9.96241 3.9979 9.22699 3.5 8.40918 3.5H5.65841C4.61197 3.5 3.76367 4.3481 3.76367 5.39453C3.76367 14.2892 10.9745 21.5 19.8691 21.5C20.9156 21.5 21.7637 20.6516 21.7637 19.6052L21.7641 16.854C21.7641 16.0361 21.2664 15.3009 20.507 14.9971L17.8706 13.9429C17.1885 13.6701 16.412 13.7929 15.8476 14.2632L15.1672 14.8307C14.3725 15.4929 13.2033 15.4402 12.4719 14.7088L10.5559 12.7911C9.82446 12.0596 9.77041 10.8913 10.4326 10.0967L11 9.4163C11.4703 8.85195 11.5942 8.07516 11.3213 7.39309L10.2661 4.75722Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </button>

                            {/* Mobile right-side icons */}
                            <div className="md:hidden inline-flex items-center gap-2.5">
                                <button
                                    className="w-9 h-9 inline-flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
                                    onClick={() => setShowSearch(true)}
                                    aria-label="Search"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                                <LocaleSwitcher />
                            </div>
                        </div>
                    </nav>

                    {/* Off-canvas left menu with smooth slide */}
                    <div
                        className={classNames(
                            "fixed inset-0 z-40 transition pointer-events-none",
                            isMenuOpen ? "pointer-events-auto" : ""
                        )}
                        aria-hidden={!isMenuOpen}
                    >
                        {/* Overlay */}
                        <div
                            onClick={closeMenu}
                            className={classNames(
                                "absolute inset-0 bg-black/40 transition-opacity duration-300",
                                isMenuOpen ? "opacity-100" : "opacity-0"
                            )}
                        />
                        {/* Drawer */}
                        <div
                            className={classNames(
                                "absolute top-0 left-0 h-full w-[90%] max-w-[524px] bg-white shadow-2xl px-10 py-7 flex flex-col transform transition-transform duration-400",
                                isMenuOpen ? "translate-x-0" : "-translate-x-full"
                            )}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between pb-7">
                                <button onClick={() => router.push('/')} className="inline-flex items-center">
                                    <span className="text-[32px] font-extrabold text-[#1a2a52] leading-none">gutenberg<span className="text-[#4c6fff]">.</span></span>
                                </button>
                                <button
                                    className="w-9 h-9 inline-flex items-center justify-center rounded-full hover:bg-gray-100"
                                    onClick={closeMenu}
                                    aria-label="Close menu"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto pl-[60px]">
                                {menuSections.map(section => (
                                    <div key={section.title} className="mb-12">
                                        <h2 className="text-[22px] font-semibold text-black mb-5">{section.title}</h2>
                                        <ul className="flex flex-col gap-5">
                                            {section.items.map(item => (
                                                <li key={item.text}>
                                                    {item.url === '#' ? (
                                                        <span
                                                            className={classNames(
                                                                "inline-block text-[20px] font-normal text-black px-4 py-1.5 rounded-2xl",
                                                                item.active ? "bg-[#D9F0FF] border border-[#009DFF] text-[#009DFF]" : "hover:bg-gray-50"
                                                            )}
                                                        >
                                                            {item.text}
                                                        </span>
                                                    ) : (
                                                        <Link href={item.url}>
                                                            <a
                                                                onClick={closeMenu}
                                                                className={classNames(
                                                                    "inline-block text-[20px] font-normal text-black px-4 py-1.5 rounded-2xl transition",
                                                                    item.active ? "bg-[#D9F0FF] border border-[#009DFF] text-[#009DFF]" : "hover:bg-gray-50"
                                                                )}
                                                            >
                                                                {item.text}
                                                            </a>
                                                        </Link>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="pt-7 pl-[60px]">
                                <p className="text-[16px] font-light leading-6 text-black">
                                    &copy; {t('copyRight')}<br />
                                    {t('companyFooter')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global search modal controlled here */}
            <SearchForm open={showSearch} onClose={() => setShowSearch(false)} />
        </>
    );
};

export default Header;
