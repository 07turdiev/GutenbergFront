import React from 'react';

const ProfileUserCard = () => {
    return (
        <div className='mb-5 border-b border-gray-200 pb-5'>
            <div className='flex items-center animate-pulse'>
                <div className='rounded-full w-12 h-12 bg-slate-100 '/>
                <div className='pl-2 w-52'>
                    <div className='h-5 bg-slate-100 rounded mb-2 mb-1'/>
                    <div className='h-2 bg-slate-100 rounded'/>
                </div>
            </div>
        </div>
    );
};

export default ProfileUserCard;