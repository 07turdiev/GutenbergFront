import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import HeadMeta from '../../components/HeadMeta';
import styles from './style.module.scss';
import stylesAbout from '../about/style.module.scss';
import Image from 'next/image';
import aboutImg from '../../assets/images/aboutImg.png';
import useTranslation from 'next-translate/useTranslation';
import GenresSection from '../../components/GenresSection';

const PrivacyPolicyPage: React.FC = () => {
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
                title="Mahfiylik va xavfsizlik siyosati | Gutenberg" 
                description="Gutenberg platformasining mahfiylik va xavfsizlik siyosati, shaxsiy ma'lumotlarni himoya qilish"
                keywords="mahfiylik, xavfsizlik, privacy, security, shaxsiy ma'lumotlar, Gutenberg"
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
                    <h1 className={styles.pageTitle}>Maxfiylik siyosati</h1>

                    <div className={styles.contentText}>
                        <h2 style={{fontSize: '32px', fontWeight: '600', marginBottom: '20px', color: '#212121'}}>1. Umumiy qoidalar</h2>
                        <p style={{marginBottom: '20px'}}>
                            Gutenberg platformasi foydalanuvchilarining shaxsiy ma'lumotlarini himoya qilish va ularning xavfsizligini ta'minlash uchun jiddiy mas'uliyatni o'z zimmasiga oladi. Bu siyosat bizning foydalanuvchilar bilan bog'liq ma'lumotlarni qanday to'plash, saqlash va foydalanishimizni batafsil tushuntiradi.
                        </p>

                        <h2 style={{fontSize: '32px', fontWeight: '600', marginBottom: '20px', color: '#212121'}}>2. To'planadigan ma'lumotlar</h2>
                        <p style={{marginBottom: '20px'}}>
                            Biz quyidagi turdagi shaxsiy ma'lumotlarni to'playmiz:
                        </p>
                        <ul style={{marginLeft: '30px', marginBottom: '20px'}}>
                            <li>Ism, familiya va elektron pochta manzili</li>
                            <li>Telefon raqami va yashash joyi</li>
                            <li>Foydalanish tarixi va platformadagi faoliyat</li>
                            <li>Texnik ma'lumotlar (IP manzil, brauzer turi, qurilma ma'lumotlari)</li>
                            <li>To'lov ma'lumotlari (xavfsiz to'lov tizimlari orqali)</li>
                        </ul>

                        <h2 style={{fontSize: '32px', fontWeight: '600', marginBottom: '20px', color: '#212121'}}>3. Ma'lumotlardan foydalanish</h2>
                        <p style={{marginBottom: '20px'}}>
                            To'plangan ma'lumotlar quyidagi maqsadlarda ishlatiladi:
                        </p>
                        <ul style={{marginLeft: '30px', marginBottom: '20px'}}>
                            <li>Xizmatlarni taqdim etish va yaxshilash</li>
                            <li>Foydalanuvchi hisobini boshqarish</li>
                            <li>Texnik yordam ko'rsatish</li>
                            <li>Xavfsizlikni ta'minlash</li>
                            <li>Qonuniy talablarga javob berish</li>
                        </ul>

                        <h2 style={{fontSize: '32px', fontWeight: '600', marginBottom: '20px', color: '#212121'}}>4. Ma'lumotlarni himoya qilish</h2>
                        <p style={{marginBottom: '20px'}}>
                            Biz foydalanuvchilar ma'lumotlarini himoya qilish uchun eng zamonaviy texnologiyalardan foydalanamiz:
                        </p>
                        <ul style={{marginLeft: '30px', marginBottom: '20px'}}>
                            <li>SSL shifrlash texnologiyasi</li>
                            <li>Xavfsiz serverlar va ma'lumotlar bazasi</li>
                            <li>Muntazam xavfsizlik tekshiruvlari</li>
                            <li>Cheklangan kirish huquqlari</li>
                            <li>Ma'lumotlarni nusxalash va zaxiralash</li>
                        </ul>

                        <h2 style={{fontSize: '32px', fontWeight: '600', marginBottom: '20px', color: '#212121'}}>5. Foydalanuvchi huquqlari</h2>
                        <p style={{marginBottom: '20px'}}>
                            Har bir foydalanuvchi quyidagi huquqlarga ega:
                        </p>
                        <ul style={{marginLeft: '30px', marginBottom: '20px'}}>
                            <li>O'z ma'lumotlarini ko'rish va o'zgartirish</li>
                            <li>Ma'lumotlarni o'chirishni so'rash</li>
                            <li>Ma'lumotlardan foydalanishni cheklash</li>
                            <li>Ma'lumotlarni boshqa joyga ko'chirish</li>
                            <li>Shikoyat qilish huquqi</li>
                        </ul>

                        <h2 style={{fontSize: '32px', fontWeight: '600', marginBottom: '20px', color: '#212121'}}>6. Aloqa</h2>
                        <p style={{marginBottom: '20px'}}>
                            Mahfiylik va xavfsizlik bo'yicha savollar uchun biz bilan bog'laning:
                        </p>
                        <p style={{marginBottom: '10px'}}>
                            <strong>Elektron pochta:</strong> privacy@gutenbergnu.uz
                        </p>
                        <p style={{marginBottom: '10px'}}>
                            <strong>Telefon:</strong> +998 (XX) XXX-XX-XX
                        </p>
                        <p style={{marginBottom: '20px'}}>
                            <strong>Manzil:</strong> Toshkent shahri, O'zbekiston
                        </p>

                        <p style={{fontStyle: 'italic', color: '#666'}}>
                            Bu siyosat 2024 yil 1 yanvardan kuchga kirgan va kerak bo'lganda yangilanadi.
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PrivacyPolicyPage;
