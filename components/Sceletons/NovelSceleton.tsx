import React from 'react';

const NovelSceleton = () => {
    return (
        <div>
            <div className='w-full h-60 rounded-md bg-slate-100 animate-pulse mb-3'/>
            <div className='w-full h-4 bg-slate-100 animate-pulse mb-3'/>
            <div className='w-2/3 h-2 bg-slate-100 animate-pulse mb-4'/>
            <div className='flex items-center'>
                <div className='w-16 h-6 rounded-md bg-slate-100 animate-pulse mb-3 mr-3'/>
                <div className='w-10 h-3 rounded-md bg-slate-100 animate-pulse mb-3'/>

            </div>
        </div>
    );
};

export default NovelSceleton;
