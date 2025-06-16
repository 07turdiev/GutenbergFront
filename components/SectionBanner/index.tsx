import React from 'react';
import Image from 'next/image';
import banner from '../../assets/images/banner.jpg'

const Index = () => {
    return (
        <div>
           <Image src={banner} layout='fill'/>
        </div>
    );
};

export default Index;