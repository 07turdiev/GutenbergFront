import React from 'react';
import Image from "next/image";
import aboutImg from "../../assets/images/aboutImg.png";
import authorsCountImg from "../../assets/images/authorsCount.svg";
import CountUp from "react-countup";
import booksCountImg from "../../assets/images/booksCount.svg";
import personCountImg from "../../assets/images/personCount.svg";
import {useAppSelector} from "../../hooks/reducer";
import {selectAbout} from "../../store/selectors/about";
import {useInView} from "react-intersection-observer";
import useTranslation from "next-translate/useTranslation";
import {useRouter} from "next/router";
import HeadMeta from "../HeadMeta";

const AboutPage = () => {

    const router = useRouter();
    const { locale } = router;
    const {description, statistics} = useAppSelector(selectAbout)
    const { t } = useTranslation('common')

    const [ref, inView] = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });

    return (
        <>
            <HeadMeta 
                title="Gutenberg Haqida | O'zbekistondagi Eng Yirik Audio Kutubxona" 
                description="Gutenberg - O'zbekistondagi eng yirik audio kutubxona. Minglab audio kitoblar, yuzlab mualliflar va millionlab tinglovchilar. Audio adabiyot dunyosiga sayohat."
                keywords="Gutenberg haqida, o'zbek audio kutubxona, audio kitoblar platformasi, Gutenberg tarix, audio adabiyot"
                ogImg="https://gutenbergnu.uz/og-default-img.jpg"
            />
            <div className='bg-primary py-12 -mt-10 mb-10'>
                <div className="container mx-auto px-3">
                    <div className="grid grid-cols-12 items-center gap-5">
                        <div className="col-span-12 sm:col-span-6">
                            { locale ==='ru'?
                                <h1 className='text-2xl font-bold mb-5'>
                                    О проекте <br/>
                                    <span className='text-white CeroPro'>GUTENBERG</span>
                                </h1>
                                :
                                <h1 className='text-2xl font-bold mb-5'>
                                    <span className='text-white CeroPro'>GUTENBERG
                                    <br />
                                    nashiryoti haqida</span>
                                </h1>
                            }
                            <p className='text-white'>
                                {t('aboutText')}
                            </p>
                        </div>
                        <div className="col-span-12 sm:col-span-6 relative flex sm:justify-end pr-10">
                            <Image 
                                src={aboutImg}
                                width={250}
                                height={300}
                                className="w-full max-w-xs h-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-3">
                <h2 className='font-bold mb-3 text-xl'>{t('whatIs')}</h2>
                <div className="mb-10">
                    {description && description.description && (
                        <div 
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{__html: description.description}}
                        />
                    )}
                </div>

                <div className='mr-auto ml-auto' >
                    <div className='bg-gray-100 py-10 px-10 rounded-md mb-10'>
                        <h2 className='text-center font-bold text-3xl mb-8'>{t('statistics')}</h2>

                        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-5" ref={ref}>
                            <div className="col-span-1">
                                <div className="text-center">
                                    <div className='bg-white shadow-2xl w-24 h-24 flex items-center justify-center rounded-md ml-auto mr-auto mb-5'>
                                        <Image src={authorsCountImg}/>
                                    </div>
                                    <div className='text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent'>
                                        <CountUp start={0} end={inView ? (statistics?.authors ?? 0) : 0} duration={2} separator=" "/>
                                    </div>
                                    <h2 className='font-bold text-xl'>
                                        {t('authorsCountText')}
                                    </h2>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="text-center">
                                    <div className='bg-white shadow-2xl w-24 h-24 flex items-center justify-center rounded-md ml-auto mr-auto mb-5'>
                                        <Image src={booksCountImg}/>
                                    </div>
                                    <div className='text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-3'>
                                        <CountUp start={0} end={inView ? (statistics?.novels ?? 0) : 0} duration={2} separator=" "/>
                                    </div>
                                    <h2 className='font-bold text-xl'>
                                        {t('Books')}
                                    </h2>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="text-center">
                                    <div className='bg-white shadow-2xl w-24 h-24 flex items-center justify-center rounded-md ml-auto mr-auto mb-5 mb-3'>
                                        <Image src={personCountImg}/>
                                    </div>
                                    <div className='text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-3'>
                                        <CountUp start={0} end={inView ? (statistics?.users ?? 0) : 0} duration={2} separator=" "/>
                                    </div>
                                    <h2 className='font-bold text-xl'>
                                        {t('readersCountText')}
                                    </h2>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


            </div>
        </>
    );
};

export default AboutPage;