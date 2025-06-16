import React from 'react';
import MainLayout from "../layouts/MainLayout";
import HeadMeta from './../components/HeadMeta';

const index = () => {
    return (
        <MainLayout>
            <HeadMeta title='404' description='Page not found' />

            <div className='container mx-auto px-3'>
                <div className="flex flex-col justify-center content-center items-center text-center h-60">
                    <div>
                        <h1 className='text-3xl mb-10 text-gray-500'>Sahifa mavjud emas</h1>
                        <div className="text-4xl mb-10">
                            404
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default index;