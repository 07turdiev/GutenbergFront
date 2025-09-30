import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import HeadMeta from '../../components/HeadMeta';
import styles from './style.module.scss';
import stylesAbout from '../about/style.module.scss';
import Image from 'next/image';
import aboutImg from '../../assets/images/aboutImg.png';
import useTranslation from 'next-translate/useTranslation';
import GenresSection from '../../components/GenresSection';

const TermsPage: React.FC = () => {
    const { t } = useTranslation('common');
    
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
                title="Foydalanish shartlari | Gutenberg" 
                description="Gutenberg platformasidan foydalanish shartlari va qoidalari"
                keywords="foydalanish shartlari, terms, qoidalar, Gutenberg"
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

            <div className="container mx-auto px-3">
                <GenresSection genres={genres} activeGenre={activeGenre} onSelect={setActiveGenre} />
            </div>

            <div className={styles.termsPage}>
                <div className="container mx-auto px-3">
                    <h1 className={styles.pageTitle}>Foydalanish shartlari</h1>

                    <p className={styles.contentText}>
                        Stenford professori Ilya Strebulaev va texnologiya sohasida katta tajribaga ega Alex Dang tomonidan yozilgan "The Venture Mindset" ("Venchur Tafakkuri") kitobi bugungi tez o'zgaruvchan dunyoda shunchaki omon qolish emas, balki g'ayrioddiy o'sishga erishishni maqsad qilgan har bir rahbar, tadbirkor va qaror qabul qiluvchi uchun qimmatli qo'llanmadir. Asarning asosiy g'oyasi — har qanday tashkilot, xoh u yirik korporatsiya bo'lsin, xoh kichik zavod, o'z faoliyatiga Silikon vodiysidagi eng muvaffaqiyatli venchur kapitalistlar (VC)ning tafakkur tarzini tatbiq etish orqali innovatsiyalarni rag'batlantirishi va raqobatchilardan o'zib ketishi mumkinligidadir.
                        <br /><br />
                        Stenford professori Ilya Strebulaev va texnologiya sohasida katta tajribaga ega Alex Dang tomonidan yozilgan "The Venture Mindset" ("Venchur Tafakkuri") kitobi bugungi tez o'zgaruvchan dunyoda shunchaki omon qolish emas, balki g'ayrioddiy o'sishga erishishni maqsad qilgan har bir rahbar, tadbirkor va qaror qabul qiluvchi uchun qimmatli qo'llanmadir. Asarning asosiy g'oyasi — har qanday tashkilot, xoh u yirik korporatsiya bo'lsin, xoh kichik zavod, o'z faoliyatiga Silikon vodiysidagi eng muvaffaqiyatli venchur kapitalistlar (VC)ning tafakkur tarzini tatbiq etish orqali innovatsiyalarni rag'batlantirishi va raqobatchilardan o'zib ketishi mumkinligidadir.
                        <br /><br />
                        Stenford professori Ilya Strebulaev va texnologiya sohasida katta tajribaga ega Alex Dang tomonidan yozilgan "The Venture Mindset" ("Venchur Tafakkuri") kitobi bugungi tez o'zgaruvchan dunyoda shunchaki omon qolish emas, balki g'ayrioddiy o'sishga erishishni maqsad qilgan har bir rahbar, tadbirkor va qaror qabul qiluvchi uchun qimmatli qo'llanmadir. Asarning asosiy g'oyasi — har qanday tashkilot, xoh u yirik korporatsiya bo'lsin, xoh kichik zavod, o'z faoliyatiga Silikon vodiysidagi eng muvaffaqiyatli venchur kapitalistlar (VC)ning tafakkur tarzini tatbiq etish orqali innovatsiyalarni rag'batlantirishi va raqobatchilardan o'zib ketishi mumkinligidadir.
                    </p>

                    <div className={styles.brandbookCard}>
                        <h2>Brendbook</h2>
                        <p>
                            Nashriyot brendidan foydalanish yuzasidan umumiy ko'rsatmalar - brendbook
                        </p>
                        <a href="#" className={styles.downloadButton}>Yuklab olish</a>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default TermsPage;


