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
import { selectPrivacyData } from '../../store/selectors/privacy';
import { termsTextToHtml } from '../../utils/strapiAdapter';
import { wrapper } from '../../store/store';
import { fetchPrivacy } from '../../store/actions/privacy';

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;
    await dispatch(fetchPrivacy({locale: ctx.locale}))
    return {
        props: {},
    };
});

const PrivacyPolicyPage: React.FC = () => {
    const { t } = useTranslation('common');
    const { data: privacyData, loading, error } = useAppSelector(selectPrivacyData);
    
    const genres = [
        t('genreFan'),
        t('genreTexnika'),
        t('genreBadiiy'),
        t('genreIlmiy'),
        t('genreKomiks'),
        t('genreSheriy'),
        t('genreMoliya'),
        t('genreInnovatsiya'),
    ];
    const [activeGenre, setActiveGenre] = useState<string>(t('genreInnovatsiya'));
    
    return (
        <MainLayout>
            <HeadMeta 
                title={t('privacyMetaTitle')} 
                description={t('privacyMetaDescription')}
                keywords={t('privacyMetaKeywords')}
                ogImg="https://gutenbergnu.uz/og-default-img.jpg"
            />

            <section className={stylesAbout.staticHero}>
                <div className={stylesAbout.heroContainer}>
                    <div className={stylesAbout.imageWrapper}>
                        <Image
                            src={aboutImg}
                            alt={t('siteTitle')}
                            width={317}
                            height={410}
                            className={stylesAbout.heroImg}
                        />
                    </div>
                    <div className={stylesAbout.textWrapper}>
                        <h1 className={stylesAbout.heroTitle}>
                            <span className={stylesAbout.gutenberg}>{t('gutenbergBrand')}</span><br/>
                            <span className={stylesAbout.nashriyot}>{t('nashriyotUyi')}</span>
                        </h1>
                        <p className={stylesAbout.heroSubtitle}>
                            {t('heroMotto')}
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-3">
                <GenresSection genres={genres} activeGenre={activeGenre} onSelect={setActiveGenre} />
            </div>

            <div className={styles.termsPage}>
                <div className="container mx-auto px-3">
                    <h1 className={styles.pageTitle}>{t('privacyPageTitle')}</h1>

                    {loading && (
                        <div className={styles.contentText}>
                            <p>{t('privacyLoading')}</p>
                        </div>
                    )}

                    {error && (
                        <div className={styles.contentText}>
                            <p>{t('privacyError')} {error}</p>
                        </div>
                    )}

                    {privacyData && privacyData.text && (
                        <div 
                            className={styles.contentText}
                            dangerouslySetInnerHTML={{ 
                                __html: termsTextToHtml(privacyData.text) 
                            }}
                        />
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default PrivacyPolicyPage;
