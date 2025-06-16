import React from 'react';

const ProfileSceleton = () => {
    return (
        <div className='container mx-auto px-3 mb-10'>

            <div className='mb-5 border-b border-gray-200 pb-5'>
                <div className='flex items-center animate-pulse'>
                    <div className='rounded-full w-12 h-12 bg-slate-100 '/>
                    <div className='pl-2 w-52'>
                        <div className='h-5 bg-slate-100 rounded mb-2 mb-1'/>
                        <div className='h-2 bg-slate-100 rounded'/>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-10 gap-6">
                <div className="col-span-2">
                    <div className='animate-pulse'>
                        <div className='h-8 bg-slate-100 rounded mb-3'/>
                        <div className='h-8 bg-slate-100 rounded mb-3'/>
                        <div className='h-8 bg-slate-100 rounded mb-3'/>
                        <div className='h-8 bg-slate-100 rounded mb-3'/>
                        <div className='h-8 bg-slate-100 rounded mb-3'/>
                        <div className='h-8 bg-slate-100 rounded mb-3'/>
                        <div className='h-8 bg-slate-100 rounded mb-3'/>
                    </div>
                </div>
                <div className="col-span-8">

                    <div className='flex items-center animate-pulse mb-10'>
                        <div className='rounded-full w-16 h-16 bg-slate-100 '/>
                        <div className='pl-2 w-52'>
                            <div className='h-5 bg-slate-100 rounded mb-2 mb-1'/>
                            <div className='h-2 bg-slate-100 rounded'/>
                        </div>
                    </div>

                    <div className='grid grid-cols-3 gap-4 mb-5'>
                        <div className="col-span-1">
                            <div className='h-10 bg-slate-100 rounded mb-2 animate-pulse'/>
                        </div>
                        <div className="col-span-1">
                            <div className='h-10 bg-slate-100 rounded mb-2 animate-pulse'/>
                        </div>
                        <div className="col-span-1">
                            <div className='h-10 bg-slate-100 rounded mb-2 animate-pulse'/>
                        </div>
                        <div className="col-span-1">
                            <div className='h-10 bg-slate-100 rounded mb-2 animate-pulse'/>
                        </div>
                        <div className="col-span-1">
                            <div className='h-10 bg-slate-100 rounded mb-2 animate-pulse'/>
                        </div>
                    </div>

                    <div className='h-12 bg-slate-100  w-52 rounded animate-pulse mb-14'/>


                    <div className='grid grid-cols-3 gap-4 mb-5'>
                        <div className="col-span-1">
                            <div className='h-10 bg-slate-100 rounded mb-2 animate-pulse'/>
                        </div>
                        <div className="col-span-1">
                            <div className='h-10 bg-slate-100 rounded mb-2 animate-pulse'/>
                        </div>
                    </div>

                    <div className='h-12 bg-slate-100  w-32 rounded animate-pulse mb-14'/>

                </div>
            </div>
        </div>
    );
};

export default ProfileSceleton;
