import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import HeadMeta from './../components/HeadMeta';
import { getSocialMediaLinks, SocialMediaData } from '../services/socialMedia';
import styles from './404.module.scss';

const Custom404 = () => {
    const router = useRouter();
    const { t } = useTranslation('common');
    const [socialMedia, setSocialMedia] = useState<SocialMediaData | null>(null);
    
    // Fetch social media links
    useEffect(() => {
        const fetchSocialMedia = async () => {
            const data = await getSocialMediaLinks();
            setSocialMedia(data);
        };
        fetchSocialMedia();
    }, []);
    
    // Function to go back to previous page
    const handleGoBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };
    
    // Function to generate random styles for animated particles
    const particleStyle = () => {
        const size = Math.random() * 5 + 2; // size between 2px and 7px
        const delay = Math.random() * 5; // delay up to 5s
        const duration = Math.random() * 5 + 3; // duration between 3s and 8s
        return {
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
        };
    };

    return (
        <>
            <HeadMeta title={t('error404')} description={t('pageNotFound')} />
            <div className={styles.notFoundPage}>
                <header className={styles.pageHeader}>
                    <Link href="/">
                        <a className={styles.logo}>gutenberg</a>
                    </Link>
                    <button onClick={handleGoBack} className={styles.btn}>
                        {t('goBack')}
                    </button>
                </header>

                <main className={styles.contentWrapper}>
                    <div className={styles.illustrationWrapper}>
                        <div className={styles.ufo}>
                            <div className={styles.ufoTop}></div>
                            <div className={styles.ufoBody}>
                                <div className={styles.ufoLight}></div>
                            </div>
                            <div className={styles.ufoBeam}></div>
                        </div>
                        {Array.from({ length: 15 }, (_, i) => (
                            <div 
                                key={i} 
                                className={styles.particle} 
                                style={particleStyle()}
                            ></div>
                        ))}
                    </div>
                    
                    <h1 className={styles.errorCode}>{t('error404')}</h1>
                    <p 
                        className={styles.errorMessage}
                        dangerouslySetInnerHTML={{ __html: t('errorMessage') }}
                    />

                    <div className={styles.socialLinks}>
                        {socialMedia?.facebook_havolasi && (
                            <a href={socialMedia.facebook_havolasi} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                        )}
                        {socialMedia?.instagram_havolasi && (
                            <a href={socialMedia.instagram_havolasi} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <i className="fab fa-instagram"></i>
                            </a>
                        )}
                        {socialMedia?.telegram_havolasi && (
                            <a href={socialMedia.telegram_havolasi} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                                <i className="fab fa-telegram"></i>
                            </a>
                        )}
                        {socialMedia?.youtube_havolasi && (
                            <a href={socialMedia.youtube_havolasi} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                                <i className="fab fa-youtube"></i>
                            </a>
                        )}
                        {socialMedia?.twitter_havolasi && (
                            <a href={socialMedia.twitter_havolasi} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <i className="fab fa-twitter"></i>
                            </a>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default Custom404;