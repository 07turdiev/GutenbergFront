import React from 'react';

const Index = () => {
    return (
        <div className='px-3 py-12 text-center flex justify-center flex-col items-center'>
            <div className='text-gray-500 mb-6'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>

            <div className='text-red-300'>
                Что то пошло не так
            </div>
        </div>
    );
};

export default Index;
