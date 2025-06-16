import React from 'react';
import Link from 'next/link';
import {toasts} from "../../utils/toasts";

const AddToMark = (locale: string ) => {
    return (
        <div>
            {toasts[locale].removeFromMark} <Link href='/profile/saved'><a className='underline hover:no-underline'>закладки</a></Link>
        </div>
    );
};

export default AddToMark;
