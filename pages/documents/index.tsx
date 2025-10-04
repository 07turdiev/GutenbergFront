import React, { useState } from 'react';
import HeadMeta from "../../components/HeadMeta";
import styles from './style.module.scss';
import stylesAbout from '../about/style.module.scss';
import aboutImg from '../../assets/images/aboutImg.png';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import MainLayout from "../../layouts/MainLayout";
import { useAppSelector } from '../../hooks/reducer';
import { selectDocumentsData } from '../../store/selectors/documents';
import { wrapper } from '../../store/store';
import { fetchDocuments } from '../../store/actions/documents';
import ImageModal from '../../components/ImageModal';

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;
    await dispatch(fetchDocuments({locale: ctx.locale}))
    return {
        props: {},
    };
});

const DocumentsPage: React.FC = () => {
    const { t } = useTranslation('common');
    const { data: documentsData, loading, error } = useAppSelector(selectDocumentsData);
    const [selectedImage, setSelectedImage] = useState<{url: string, alt: string} | null>(null);
    return (
        <MainLayout>
            <HeadMeta 
                title={t('documentsMetaTitle')}
                description={t('documentsMetaDescription')}
                keywords={t('documentsMetaKeywords')}
                ogImg="https://gutenbergnu.uz/og-default-img.jpg"
            />
            <div className={styles.documentsPage}>
            <section className={stylesAbout.staticHero}>
                    <div className={stylesAbout.heroContainer}>
                        <div className={stylesAbout.imageWrapper}>
                            <Image
                                src={aboutImg}
                                alt="Gutenberg Nashriyot Uyi"
                                width={317}
                                height={400}
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
                <div className="container mx-auto px-3">
                    <section className={styles.mainDocsSection}>
                        <h2 className={styles.sectionTitle}>{t('documentsPageTitle')}</h2>
                        
                        {loading && (
                            <div className={styles.loadingMessage}>
                                <p>{t('documentsLoading')}</p>
                            </div>
                        )}

                        {error && (
                            <div className={styles.errorMessage}>
                                <p>{t('documentsError')} {error}</p>
                            </div>
                        )}

                        {documentsData && documentsData.length > 0 && (
                            <div className={styles.docsGrid}>
                                {documentsData.map((doc) => (
                                    doc.Rasmi && (
                                        <div 
                                            className={styles.docCard} 
                                            key={doc.id}
                                            onClick={() => setSelectedImage({
                                                url: doc.Rasmi!.url,
                                                alt: doc.Nomi
                                            })}
                                        >
                                            <img 
                                                src={doc.Rasmi.formats?.medium?.url || doc.Rasmi.url} 
                                                alt={doc.Nomi}
                                                loading="lazy"
                                            />
                                            <h3>{doc.Nomi}</h3>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </section>

                    <section className={styles.legalCardsSection}>
                        <div className={`${styles.legalCard} ${styles.termsCard}`}>
                            <h3>{t('termsOfUse')}</h3>
                            <p>
                                {t('documentsTermsDescription')}
                            </p>
                            <a href="/terms"><span>{t('readMore')}</span></a>
                        </div>
                        <div className={`${styles.legalCard} ${styles.privacyCard}`}>
                            <h3>{t('privacyPolicy')}</h3>
                            <p>
                                {t('documentsPrivacyDescription')}
                            </p>
                            <a href="/privacy-policy"><span>{t('readMore')}</span></a>
                        </div>
                    </section>
                </div>
            </div>
            
            <ImageModal
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                imageUrl={selectedImage?.url || ''}
                imageAlt={selectedImage?.alt || ''}
            />
        </MainLayout>
    );
};

export default DocumentsPage;


