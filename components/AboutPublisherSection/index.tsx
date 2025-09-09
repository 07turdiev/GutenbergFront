import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import aboutImg from '../../assets/images/aboutImg.png';
import styles from './style.module.scss';
import useTranslation from 'next-translate/useTranslation';

const AboutPublisherSection: React.FC = () => {
    const { t } = useTranslation('common');
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Mobile layout */}
                <div className={styles.mobile}>
                    {/* Metric Container - Biz haqimizda */}
                    <div className={styles.metric}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none" className={styles.metricIcon}>
                            <path d="M7.07523 3.11523L6.50531 3.2458C6.55693 3.46881 6.56338 3.69977 6.52429 3.92527C6.4852 4.15077 6.40135 4.3663 6.27761 4.55934C6.15388 4.75238 5.99272 4.91908 5.80352 5.04974C5.61432 5.1804 5.40084 5.27242 5.1755 5.32044C4.71856 5.41587 4.24214 5.32951 3.84865 5.07993C3.45516 4.83034 3.176 4.43746 3.07118 3.98571L1.93134 4.21784C1.77503 4.2517 1.62725 4.31667 1.49694 4.40882C1.36663 4.50098 1.25649 4.6184 1.17317 4.754C1.08985 4.88961 1.03509 5.04057 1.01219 5.19777C0.989288 5.35498 0.998726 5.51516 1.03993 5.66864C1.03993 5.66864 1.56601 8.09147 2.17977 10.819M18.0352 3.10072C17.9479 3.34501 17.8115 3.56915 17.6344 3.75957C17.4572 3.95 17.243 4.10273 17.0046 4.20852C16.7662 4.31432 16.5087 4.37097 16.2477 4.37504C15.9866 4.37912 15.7274 4.33054 15.4858 4.23224C15.2442 4.13394 15.0253 3.98797 14.8422 3.80317C14.6591 3.61837 14.5157 3.3986 14.4207 3.15716C14.3256 2.91572 14.281 2.65764 14.2894 2.39856C14.2978 2.13948 14.3591 1.88479 14.4696 1.64993L13.2859 1.09862C12.9698 0.967852 12.6145 0.966107 12.2972 1.09377C11.9798 1.22142 11.726 1.46819 11.5907 1.7805L6.68067 13.2563L6.03768 14.7071C5.90596 15.0209 5.90421 15.3736 6.03279 15.6887C6.16138 16.0037 6.40993 16.2558 6.72451 16.39L12.6575 18.8999C12.9736 19.0307 13.3288 19.0324 13.6462 18.9048C13.9636 18.7771 14.2174 18.5303 14.3527 18.218L19.9057 5.2479C20.0282 4.9463 20.0315 4.60993 19.915 4.30601C19.7985 4.00209 19.5708 3.753 19.2773 3.6085L18.0352 3.10072Z" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className={styles.metricText}>{t('about')}</div>
                    </div>

                    {/* Heading + Arrow */}
                    <div className={styles.headingRow}>
                        <h1 className={styles.heading}>{t('aboutPublisherHeading')}</h1>
                        <Link href="/about">
                            <a className={styles.arrowBtn} aria-label="Batafsil">
                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <circle cx="30" cy="29.9993" r="29.5" fill="#009DFF" fillOpacity="0.15" stroke="#009DFF"/>
                                    <path d="M20.0001 19.9993H39.9995M39.9995 19.9993V39.9987M39.9995 19.9993L20.0001 39.9987" stroke="#009DFF"/>
                                </svg>
                            </a>
                        </Link>
                    </div>

                    {/* About Description */}
                    <p className={styles.desc}>{t('aboutPublisherDescription')}</p>

                    {/* About Image */}
                    <div className={styles.imageWrap}>
                        <Image 
                            src={aboutImg} 
                            alt="Gutenberg haqida" 
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Content Section */}
                    <div className={styles.goals}>
                        <div className={styles.goalsTitle}>{t('ourGoalTitle')}</div>
                        <p className={styles.goalsText}>{t('ourGoalText')}</p>
                    </div>

                    {/* CTA Button */}
                    <Link href="/contact">
                        <a className={styles.cta}>
                            <span>{t('contactUs')}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 0.999268H13M13 0.999268V12.9993M13 0.999268L1 12.9993" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </a>
                    </Link>
                </div>

                {/* Desktop layout */}
                <div className={styles.desktop}>
                    {/* Metric Container - Biz haqimizda */}
                    <div className={styles.metricAbs}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none" className={styles.metricIcon}>
                            <path d="M7.07523 3.11523L6.50531 3.2458C6.55693 3.46881 6.56338 3.69977 6.52429 3.92527C6.4852 4.15077 6.40135 4.3663 6.27761 4.55934C6.15388 4.75238 5.99272 4.91908 5.80352 5.04974C5.61432 5.1804 5.40084 5.27242 5.1755 5.32044C4.71856 5.41587 4.24214 5.32951 3.84865 5.07993C3.45516 4.83034 3.176 4.43746 3.07118 3.98571L1.93134 4.21784C1.77503 4.2517 1.62725 4.31667 1.49694 4.40882C1.36663 4.50098 1.25649 4.6184 1.17317 4.754C1.08985 4.88961 1.03509 5.04057 1.01219 5.19777C0.989288 5.35498 0.998726 5.51516 1.03993 5.66864C1.03993 5.66864 1.56601 8.09147 2.17977 10.819M18.0352 3.10072C17.9479 3.34501 17.8115 3.56915 17.6344 3.75957C17.4572 3.95 17.243 4.10273 17.0046 4.20852C16.7662 4.31432 16.5087 4.37097 16.2477 4.37504C15.9866 4.37912 15.7274 4.33054 15.4858 4.23224C15.2442 4.13394 15.0253 3.98797 14.8422 3.80317C14.6591 3.61837 14.5157 3.3986 14.4207 3.15716C14.3256 2.91572 14.281 2.65764 14.2894 2.39856C14.2978 2.13948 14.3591 1.88479 14.4696 1.64993L13.2859 1.09862C12.9698 0.967852 12.6145 0.966107 12.2972 1.09377C11.9798 1.22142 11.726 1.46819 11.5907 1.7805L6.68067 13.2563L6.03768 14.7071C5.90596 15.0209 5.90421 15.3736 6.03279 15.6887C6.16138 16.0037 6.40993 16.2558 6.72451 16.39L12.6575 18.8999C12.9736 19.0307 13.3288 19.0324 13.6462 18.9048C13.9636 18.7771 14.2174 18.5303 14.3527 18.218L19.9057 5.2479C20.0282 4.9463 20.0315 4.60993 19.915 4.30601C19.7985 4.00209 19.5708 3.753 19.2773 3.6085L18.0352 3.10072Z" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className={styles.metricTextDesk}>{t('about')}</div>
                    </div>

                    {/* Main Heading */}
                    <h1 className={styles.headingAbs}>{t('aboutPublisherHeading')}</h1>

                    {/* Arrow Icon */}
                    <Link href="/about">
                        <a className={styles.arrowAbs} aria-label="Batafsil">
                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                                <circle cx="30" cy="29.9993" r="29.5" fill="#009DFF" fillOpacity="0.15" stroke="#009DFF"/>
                                <path d="M20.0001 19.9993H39.9995M39.9995 19.9993V39.9987M39.9995 19.9993L20.0001 39.9987" stroke="#009DFF"/>
                            </svg>
                        </a>
                    </Link>

                    {/* About Description */}
                    <div className={styles.descAbs}>{t('aboutPublisherDescription')}</div>

                    {/* About Image */}
                    <div className={styles.imageAbs}>
                        <Image 
                            src={aboutImg} 
                            alt="Gutenberg haqida" 
                            width={402}
                            height={234}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content Section */}
                    <div className={styles.contentAbs}>
                        {/* Content Title */}
                        <div className={styles.contentTitleAbs}>{t('ourGoalTitle')}</div>

                        {/* Content Text */}
                        <div className={styles.contentTextAbs}>{t('ourGoalText')}</div>

                        {/* CTA Button */}
                        <Link href="/contact">
                            <a className={styles.ctaAbs}>
                                <span className={styles.ctaTextAbs}>{t('contactUs')}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M1 0.999268H13M13 0.999268V12.9993M13 0.999268L1 12.9993" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutPublisherSection;