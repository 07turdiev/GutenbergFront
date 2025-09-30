import React from 'react';
import HeadMeta from "../HeadMeta";
import styles from './DocumentsPageStyle.module.scss';
import stylesAbout from './AboutPageStyle.module.scss';
import aboutImg from '../../assets/images/aboutImg.png';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';

interface DocumentItem {
    title: string;
    imageUrl: string;
}

const mainDocs: DocumentItem[] = [
    { title: 'Guvohnoma', imageUrl: 'https://placehold.co/400x547/e0e0e0/e0e0e0' },
    { title: 'Tasdiqnoma', imageUrl: 'https://placehold.co/400x547/d4d4d4/d4d4d4' },
];

const DocumentsPage: React.FC = () => {
    const { t } = useTranslation('common');
    return (
        <>
            <HeadMeta 
                title="Hujjatlar"
                description="Gutenberg nashriyot uyining hujjatlar bo'limi"
                keywords="hujjatlar, guvohnoma, tasdiqnoma, shartlar, maxfiylik"
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
                <div className="container mx-auto px-3">
                    <section className={styles.mainDocsSection}>
                        <h2 className={styles.sectionTitle}>Hujjatlar</h2>
                        <div className={styles.docsGrid}>
                            {mainDocs.map((doc) => (
                                <div className={styles.docCard} key={doc.title}>
                                    <img src={doc.imageUrl} alt={doc.title} />
                                    <h3>{doc.title}</h3>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className={styles.legalCardsSection}>
                        <div className={`${styles.legalCard} ${styles.termsCard}`}>
                            <h3>Foydalanish shartlari</h3>
                            <p>
                                Nashriyotning elektron resurslaridan, brending ma’lumotlaridan, nashr etilgan kitoblaridan hamda kitoblardagi parchalardan foydalnish shartlari.
                            </p>
                            <a href="#"><span>Batafsil</span></a>
                        </div>
                        <div className={`${styles.legalCard} ${styles.privacyCard}`}>
                            <h3>Maxfiylik siyosati</h3>
                            <p>
                                “Gutenberg nashriyot uyi” MChJ tomonidan tuzilgan shartnomalar, hamkorlik memorandumlari, veb-resurslarda foydalanuvchilar tomonidan kiritilgan ma’lumotlarning maxfiyligini ta’minlash to’g’risida.
                            </p>
                            <a href="#"><span>Batafsil</span></a>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default DocumentsPage;


