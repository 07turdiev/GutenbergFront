import React from 'react';
import Image from 'next/image'
import Logo from '../../assets/images/logo.svg'
import LogoWhite from '../../assets/images/whiteLogo.svg'

interface Props {
    white?: boolean;
}

const SiteLogo:React.FC<Props> = ({white}) => {

    const logoSrc = white ? LogoWhite : Logo

    return (
        <Image priority src={logoSrc}/>
    );
};

export default SiteLogo;
