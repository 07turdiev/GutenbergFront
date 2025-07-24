import React from 'react';
import SiteLogo from "../SiteLogo/SiteLogo";
import {useRouter} from "next/router";
import HeaderMenu from '../HeaderMenu';
import SearchBtn from "./SearchBtn";
import LocaleSwitcher from '../LocaleSwitcher';
import AuthButtons from './AuthButtons';

import classes from './style.module.scss';
import classNames from "classnames";


const Header = () => {

    const router = useRouter()

    return (
        <>
            <div className='py-5 shadow-lg fixed top-0 left-0 w-full z-50'>
                <div className={classNames('absolute top-0 left-0 w-full h-full ',  classes.blurred)} />
                <div className='container mx-auto px-3 relative z-30'>
                    <div className="grid grid-cols-12 items-center">
                        <div className="lg:col-span-2 col-span-6 sm:col-span-4">
                            <div className='xl:w-44 w-32 cursor-pointer' onClick={()=>router.push('/')}> <SiteLogo/> </div>
                        </div>
                        <div className="lg:col-span-3 col-span-8 lg:order-3 hidden lg:block">
                            <div className="flex items-center ml-auto justify-end pl-5 space-x-3">
                                <LocaleSwitcher/>
                                <SearchBtn />
                                {/* <AuthButtons/> */}
                            </div>
                        </div>
                        <div className="lg:col-span-7 lg:order-2 col-span-6 sm:col-span-8">
                            <div className='lg:flex lg:justify-center'>
                                <HeaderMenu/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
