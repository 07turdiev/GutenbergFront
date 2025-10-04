import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import HeadMeta from '../../components/HeadMeta';
import styles from './style.module.scss';
import stylesAbout from '../about/style.module.scss';
import Image from 'next/image';
import aboutImg from '../../assets/images/aboutImg.png';
import useTranslation from 'next-translate/useTranslation';
import GenresSection from '../../components/GenresSection';
import { useAppSelector } from '../../hooks/reducer';
import { selectTermsData } from '../../store/selectors/terms';
import { termsTextToHtml } from '../../utils/strapiAdapter';
import { wrapper } from '../../store/store';
import { fetchTerms } from '../../store/actions/terms';

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;
    await dispatch(fetchTerms({locale: ctx.locale}))
    return {
        props: {},
    };
});

const TermsPage: React.FC = () => {
    const { t } = useTranslation('common');
    const { data: termsData, loading, error } = useAppSelector(selectTermsData);
    
    const genres = [
        'Fan',
        'Texnika',
        'Badiiy',
        'Ilmiy',
        'Komiks',
        "She'riy",
        'Moliya',
        'Innovatsiya',
    ];
    const [activeGenre, setActiveGenre] = useState<string>('Innovatsiya');
    
    return (
        <MainLayout>
            <HeadMeta 
                title={t('termsMetaTitle')} 
                description={t('termsMetaDescription')}
                keywords={t('termsMetaKeywords')}
                ogImg="https://gutenbergnu.uz/og-default-img.jpg"
            />

            <section className={stylesAbout.staticHero}>
                <div className={stylesAbout.heroContainer}>
                    <div className={stylesAbout.imageWrapper}>
                        <Image
                            src={aboutImg}
                            alt="Gutenberg Nashriyot Uyi"
                            width={317}
                            height={410}
                            className={stylesAbout.heroImg}
                        />
                    </div>
                    <div className={stylesAbout.textWrapper}>
                        <h1 className={stylesAbout.heroTitle}>
                            <span className={stylesAbout.gutenberg}>GUTENBERG</span><br/>
                            <span className={stylesAbout.nashriyot}>NASHRIYOT UYI</span>
                        </h1>
                        <p className={stylesAbout.heroSubtitle}>
                            {t('heroMotto')}
                        </p>
                    </div>
                </div>
            </section>

            <div className="mx-auto px-3">
                <GenresSection genres={genres} activeGenre={activeGenre} onSelect={setActiveGenre} />
            </div>

            <div className={styles.termsPage}>
                <div className="container mx-auto px-3">
                    <h1 className={styles.pageTitle}>{t('termsPageTitle')}</h1>

                    {loading && (
                        <div className={styles.contentText}>
                            <p>{t('termsLoading')}</p>
                        </div>
                    )}

                    {error && (
                        <div className={styles.contentText}>
                            <p>{t('termsError')} {error}</p>
                        </div>
                    )}

                    {termsData && termsData.text && (
                        <div 
                            className={styles.contentText}
                            dangerouslySetInnerHTML={{ 
                                __html: termsTextToHtml(termsData.text) 
                            }}
                        />
                    )}

                    {termsData && termsData.Brendbook && (
                        <div className={styles.brandbookCard}>
                            <h2>{t('termsBrandbookTitle')}</h2>
                            <p>
                                {t('termsBrandbookDescription')}
                            </p>
                            <a 
                                href={termsData.Brendbook.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.downloadButton}
                            >
                                {t('termsBrandbookDownload')}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default TermsPage;


