import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import HeadMeta from '../../components/HeadMeta';
import styles from './style.module.scss';
import stylesAbout from '../about/style.module.scss';
import Image from 'next/image';
import aboutImg from '../../assets/images/aboutImg.png';
import useTranslation from 'next-translate/useTranslation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';

interface FormDataState {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
}

const initialFormState: FormDataState = {
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
};

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState<FormDataState>(initialFormState);
    const { t } = useTranslation('common');

    const contactDetails = [
        { title: 'Mualliflik huquqi yuzasidan', value: 'rights@gutenbergnu.uz' },
        { title: 'Vakant o\'rinlar, ijodiy ishlar, mualliflar uchun', value: '+99 8(90) 125-07-09' },
        { title: 'Moliyaviy masalalar yuzasidan', value: 'director@gutenbergnu.uz' },
        { title: 'Sotuvlar, marketing, ulgurji va chakana savdo', value: '+99 8(90) 125-07-09' },
    ];

    const socialIcons = ['facebook-f', 'google', 'instagram', 'youtube'];

    const testimonials = [
        { name: "A.Sa'dullayev", text: 'Gutenberg nashriyot uyi zamonaviy dunyo qarashdagi, mas\'uliyati yoshlar ishlovchi nashriyot. Kelajakda o\'z nomiga munosib tarzda buyuk ishlarni amalga oshirishiga ishonaman' },
        { name: "A.Sa'dullayev", text: 'Gutenberg nashriyot uyi zamonaviy dunyo qarashdagi, mas\'uliyati yoshlar ishlovchi nashriyot. Kelajakda o\'z nomiga munosib tarzda buyuk ishlarni amalga oshirishiga ishonaman' },
        { name: "A.Sa'dullayev", text: 'Gutenberg nashriyot uyi zamonaviy dunyo qarashdagi, mas\'uliyati yoshlar ishlovchi nashriyot. Kelajakda o\'z nomiga munosib tarzda buyuk ishlarni amalga oshirishiga ishonaman' },
        { name: "A.Sa'dullayev", text: 'Gutenberg nashriyot uyi zamonaviy dunyo qarashdagi, mas\'uliyati yoshlar ishlovchi nashriyot. Kelajakda o\'z nomiga munosib tarzda buyuk ishlarni amalga oshirishiga ishonaman' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Murojaatingiz yuborildi!');
        setFormData(initialFormState);
    };

    return (
        <MainLayout>
            <HeadMeta 
                title="Aloqa — Gutenberg Nashriyot Uyi" 
                description="Biz bilan aloqaga chiqing. Savollar, taklif va murojaatlar uchun aloqa sahifasi." 
                keywords="aloqa, bog'lanish, kontakt, Gutenberg"
                ogImg="https://gutenbergnu.uz/og-default-img.jpg"
            />

            <div className={styles.contactPage}>
                {/* Reused About hero section at the very top */}
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
                <section className={`${styles.heroSection} ${styles.pageSection}`}>
                    <div className="container mx-auto px-3">
                        <div className={styles.heroBox}>
                            <div className={styles.heroContainer}>
                                <h1 className={styles.heroTitle}>Aloqa</h1>
                                <p className={styles.heroSubtitle}>Nashriyot bilan aloqa o'rnatish uchun turli xil axborot kanallaridan foydalanishingiz mumkin.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={`${styles.formSection} ${styles.pageSection}`}>
                    <div className="container mx-auto px-3">
                        <form className={styles.contactForm} onSubmit={handleSubmit}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="firstName">Ismingiz*</label>
                                <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="lastName">Familiyangiz*</label>
                                <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Elektron pochta*</label>
                                <input type="email" id="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="subject">Mavzu*</label>
                                <input type="text" id="subject" value={formData.subject} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="message">Murojaat matni*</label>
                            <textarea id="message" rows={4} value={formData.message} onChange={handleChange} required />
                        </div>
                        <button type="submit" className={styles.btnSubmit}>Yuborish</button>
                        </form>
                    </div>
                </section>

                <section className={`${styles.detailedInfoSection} ${styles.pageSection}`}>
                    <div className="container mx-auto px-3">
                        <h2 className={styles.sectionTitle}>Gutenberg nashriyoti bilan aloqa uchun ma&apos;lumotlar</h2>
                        <p className={styles.sectionDescription}>
                            Qanday masalada murojaat qilishini istayotgan bo&apos;lsangiz, aynan o&apos;sha masala uchun ochilgan elektron pochta manzili yoki telefon raqami orqali aloqaga chiqishingizni so&apos;raymiz. Aks holda murojaatingiz ko&apos;rmasdan qoldirilishi mumkin.
                        </p>
                        <div className={styles.contactGrid}>
                            {contactDetails.map((contact) => (
                                <div className={styles.contactItem} key={contact.title}>
                                    <p>{contact.title}</p>
                                    <strong>{contact.value}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className={`${styles.pageSection}`}>
                    <div className={`container mx-auto px-3 ${styles.locationSocialSection}`}>
                        <div className={`${styles.infoCard} ${styles.locationCard}`}>
                            <h3>Rasmiy manzil</h3>
                            <p>&quot;Gutenberg nashriyot uyi&quot;ning rasmiy xatlar va yozishmalar uchun xatlarni qabul qiluvchi manzili</p>
                            <strong>Manzil: Samarqand shahar, Dahbet ko&apos;chasi, 8-uy; Pochta indeksi: 140100</strong>
                            <a href="#" className={styles.mapLink}>Xaritadan ko&apos;rish</a>
                        </div>
                        <div className={`${styles.infoCard} ${styles.socialCard}`}>
                            <h3>Rasmiy sahifalar</h3>
                            <p>&quot;Gutenberg nashriyot uyi&quot;ning ijtimoiy tarmoqlardagi rasmiy sahifalari orqali aloqaga chiqish mumkin.</p>
                            <div className={styles.socialLinks}>
                                {socialIcons.map((icon)=> (
                                    <a href="#" key={icon} aria-label={icon}>
                                        <i className={`fab fa-${icon}`}/>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className={`${styles.testimonialsSection} ${styles.pageSection}`}>
                    <div className="container mx-auto px-3">
                        <h2 className={styles.sectionTitle}>Hamkorlarimizning biz haqimizdagi fikr-mulohazalari</h2>
                        <Swiper
                            modules={[Autoplay]}
                            autoplay={{ delay: 5000, disableOnInteraction: false }}
                            loop
                            slidesPerView={2.5}
                            spaceBetween={20}
                            breakpoints={{
                                320: { slidesPerView: 1.1, spaceBetween: 12 },
                                640: { slidesPerView: 1.6, spaceBetween: 16 },
                                1024: { slidesPerView: 2.5, spaceBetween: 20 },
                                1400: { slidesPerView: 2.5, spaceBetween: 20 },
                            }}
                        >
                            {testimonials.map((testimonial) => (
                                <SwiperSlide key={testimonial.name}>
                                    <div className={styles.testimonialCard}>
                                        <div className={styles.cardIcon}></div>
                                        <p className={styles.testimonialText}>{testimonial.text}</p>
                                        <p className={styles.testimonialAuthor}>{testimonial.name}</p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};

export default ContactPage;


