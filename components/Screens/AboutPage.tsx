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
import styles from './AboutPageStyle.module.scss';

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
                title="Gutenberg Haqida" 
                description="Gutenberg - O'zbekistondagi eng yirik audio kutubxona. Minglab audio kitoblar, yuzlab mualliflar va millionlab tinglovchilar. Audio adabiyot dunyosiga sayohat."
                keywords="Gutenberg haqida, o'zbek audio kutubxona, audio kitoblar platformasi, Gutenberg tarix, audio adabiyot"
                ogImg="https://gutenbergnu.uz/og-default-img.jpg"
            />
            <section className={styles.staticHero}>
                <div className={styles.heroContainer}>
                    <div className={styles.imageWrapper}>
                        <svg className={styles.bgPathSvg} xmlns="http://www.w3.org/2000/svg" width="238" height="886" viewBox="0 0 238 886" fill="none">
                            <path d="M-97 -9.00001C84.1494 -9.00001 231 188.89 231 433C231 677.11 84.1494 875 -97 875" stroke="url(#paint0_linear_about)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                            <defs>
                                <linearGradient id="paint0_linear_about" x1="67" y1="746.187" x2="67" y2="118.98" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="white"/>
                                    <stop offset="0.167353" stopColor="#00EEFF"/>
                                    <stop offset="0.39751" stopColor="#0022FF"/>
                                    <stop offset="0.606743" stopColor="#AE00FF"/>
                                    <stop offset="0.845" stopColor="#FF0066"/>
                                    <stop offset="1" stopColor="white"/>
                                </linearGradient>
                            </defs>
                        </svg>
                        <Image
                            src={aboutImg}
                            alt="Gutenberg Nashriyot Uyi"
                            width={317}
                            height={410}
                            className={styles.heroImg}
                        />
                    </div>
                    <div className={styles.textWrapper}>
                        <h1 className={styles.heroTitle}>
                            <span className={styles.gutenberg}>GUTENBERG</span><br/>
                            <span className={styles.nashriyot}>NASHRIYOT UYI</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Ad astra per aspera - Zulmatdan ziyoga
                        </p>
                    </div>
                </div>
            </section>
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