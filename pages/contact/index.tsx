import React, { useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import MainLayout from '../../layouts/MainLayout';
import HeadMeta from '../../components/HeadMeta';
import styles from './style.module.scss';
import stylesAbout from '../about/style.module.scss';
import Image from 'next/image';
import aboutImg from '../../assets/images/aboutImg.png';
import useTranslation from 'next-translate/useTranslation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import $api from '../../http';
import { richTextToPlainText } from '../../utils/strapiAdapter';

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

interface ContactApiData {
    Matn?: any[];
    Mualliflik_email?: string;
    Moliyaviy_email?: string;
    Tel_raqam1?: string;
    Tel_raqam2?: string;
    Manzil?: string;
    Joylashuv?: string;
}

interface ContactPageProps {
    contactData: ContactApiData | null;
    testimonials: { name: string; text: string }[];
    socialLinks: {
        facebook?: string;
        google?: string;
        instagram?: string;
        youtube?: string;
    };
}

const ContactPage: React.FC<ContactPageProps> = ({ contactData, testimonials, socialLinks }) => {
    const [formData, setFormData] = useState<FormDataState>(initialFormState);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useTranslation('common');

    const contactDetails = useMemo(() => {
        if (!contactData) return [] as { title: string; value: string; href?: string }[];
        const telHref = (phone?: string) => phone ? `tel:${(phone || '').replace(/[^+\d]/g, '')}` : '';
        const mailHref = (email?: string) => email ? `mailto:${email}` : '';
        return [
            { title: t('contactDetailsCopyright'), value: contactData.Mualliflik_email || '', href: mailHref(contactData.Mualliflik_email) },
            { title: t('contactDetailsVacancy'), value: contactData.Tel_raqam1 || '', href: telHref(contactData.Tel_raqam1) },
            { title: t('contactDetailsFinancial'), value: contactData.Moliyaviy_email || '', href: mailHref(contactData.Moliyaviy_email) },
            { title: t('contactDetailsSales'), value: contactData.Tel_raqam2 || '', href: telHref(contactData.Tel_raqam2) },
        ];
    }, [contactData, t]);

    // testimonials now comes from server props

    // Check for existing cooldown on component mount
    React.useEffect(() => {
        const lastSubmission = localStorage.getItem('lastSubmission');
        if (lastSubmission) {
            const timeSinceLastSubmission = Date.now() - parseInt(lastSubmission);
            const remainingTime = 30 * 60 * 1000 - timeSinceLastSubmission; // 30 minutes in milliseconds
            
            if (remainingTime > 0) {
                setTimeLeft(Math.ceil(remainingTime / 1000)); // Convert to seconds
            }
        }
    }, []);

    // Countdown timer effect
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        
        if (timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (timeLeft > 0) {
            return; // Prevent submission if cooldown is active
        }
        
        setIsSubmitting(true);
        
        try {
            const murojaatData = {
                data: {
                    Ismi: formData.firstName,
                    Familiyasi: formData.lastName,
                    email: formData.email,
                    Mavzu: formData.subject,
                    Murojaat_matni: [
                        {
                            type: "paragraph",
                            children: [
                                {
                                    text: formData.message,
                                    type: "text"
                                }
                            ]
                        }
                    ]
                }
            };

            const response = await $api.post('/api/murojaatlars', murojaatData);
            
            if (response.status === 200 || response.status === 201) {
                setIsSubmitted(true);
                setFormData(initialFormState);
                setTimeLeft(30 * 60); // Set 30 minutes cooldown
                localStorage.setItem('lastSubmission', Date.now().toString());
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    setIsSubmitted(false);
                }, 5000);
            } else {
                alert(t('contactFormError'));
            }
        } catch (error) {
            console.error('Murojaat yuborishda xatolik:', error);
            alert(t('contactFormError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <HeadMeta 
                title={t('contactMetaTitle')} 
                description={t('contactMetaDescription')} 
                keywords={t('contactMetaKeywords')}
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
                                <h1 className={styles.heroTitle}>{t('contactHeroTitle')}</h1>
                                <p className={styles.heroSubtitle}>{t('contactHeroSubtitle')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={`${styles.formSection} ${styles.pageSection}`}>
                    <div className="container mx-auto px-3">
                        {isSubmitted && (
                            <div className={styles.successMessage}>
                                <p>✅ {t('contactFormSuccess')}</p>
                            </div>
                        )}
                        <form className={styles.contactForm} onSubmit={handleSubmit}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="firstName">{t('contactFormFirstName')}*</label>
                                <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="lastName">{t('contactFormLastName')}*</label>
                                <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">{t('contactFormEmail')}*</label>
                                <input type="email" id="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="subject">{t('contactFormSubject')}*</label>
                                <select id="subject" value={formData.subject} onChange={handleChange} required>
                                    <option value="">{t('contactFormSelectSubject')}</option>
                                    <option value={t('contactSubjectCopyright')}>{t('contactSubjectCopyright')}</option>
                                    <option value={t('contactSubjectVacancy')}>{t('contactSubjectVacancy')}</option>
                                    <option value={t('contactSubjectPublishing')}>{t('contactSubjectPublishing')}</option>
                                    <option value={t('contactSubjectInquiry')}>{t('contactSubjectInquiry')}</option>
                                    <option value={t('contactSubjectComplaint')}>{t('contactSubjectComplaint')}</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="message">{t('contactFormMessage')}*</label>
                            <textarea id="message" rows={4} value={formData.message} onChange={handleChange} required />
                        </div>
                        <button 
                            type="submit" 
                            className={`${styles.btnSubmit} ${timeLeft > 0 ? styles.btnCooldown : ''}`}
                            disabled={timeLeft > 0 || isSubmitting}
                        >
                            {timeLeft > 0 ? formatTime(timeLeft) : (isSubmitting ? t('contactFormSubmitting') : t('contactFormSubmit'))}
                        </button>
                        </form>
                    </div>
                </section>

                <section className={`${styles.detailedInfoSection} ${styles.pageSection}`}>
                    <div className="container mx-auto px-3">
                        <h2 className={styles.sectionTitle}>{t('contactFormTitle')}</h2>
                        <p className={styles.sectionDescription}>
                            {richTextToPlainText((contactData && contactData.Matn) ? (contactData.Matn as any) : []) || t('contactFormDescription')}
                        </p>
                        <div className={styles.contactGrid}>
                            {contactDetails.map((contact) => (
                                <div className={styles.contactItem} key={contact.title}>
                                    <p>{contact.title}</p>
                                    {contact.href ? (
                                        <strong>
                                            <a href={contact.href}>{contact.value}</a>
                                        </strong>
                                    ) : (
                                        <strong>{contact.value}</strong>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className={`${styles.pageSection}`}>
                    <div className={`container mx-auto px-3 ${styles.locationSocialSection}`}>
                        <div className={`${styles.infoCard} ${styles.locationCard}`}>
                            <h3>{t('contactLocationTitle')}</h3>
                            <p>{t('contactLocationDescription')}</p>
                            <strong>{t('contactLocationAddress')} {contactData?.Manzil || ''}</strong>
                            <a href={`geo:${(contactData?.Joylashuv || '').trim()}`} className={styles.mapLink}>{t('contactLocationMap')}</a>
                        </div>
                        <div className={`${styles.infoCard} ${styles.socialCard}`}>
                            <h3>{t('contactSocialTitle')}</h3>
                            <p>{t('contactSocialDescription')}</p>
                            <div className={styles.socialLinks}>
                                {socialLinks?.facebook && (
                                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="facebook">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M2 0.5H14C14.8269 0.5 15.5 1.17314 15.5 2V14C15.5 14.8269 14.8269 15.5 14 15.5H11.5V11H12.8389L12.9639 10.6855L13.9639 8.18555L14.2383 7.5H11.5V6.00879C11.5303 6.00492 11.5718 6.00173 11.627 6H13.5V2.5H11C10.0717 2.5 9.18177 2.86901 8.52539 3.52539C7.86901 4.18177 7.5 5.07174 7.5 6V7.5H5.5V11H7.5V15.5H2C1.17314 15.5 0.5 14.8269 0.5 14V2C0.5 1.17314 1.17314 0.5 2 0.5Z" fill="#212121" stroke="black"/>
                                    </svg>
                                </a>
                                )}
                                {socialLinks?.google && (
                                <a href={socialLinks.google} target="_blank" rel="noopener noreferrer" aria-label="google">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 16" fill="none">
                                        <path d="M7.64091 6.71675V9.5435H11.9713C11.851 10.6862 10.7082 12.8514 7.64091 12.8514C5.05474 12.8514 2.94971 10.6862 2.94971 8.03991C2.94971 5.39359 4.93445 3.22842 7.52063 3.22842C9.02422 3.22842 10.0467 3.82985 10.588 4.37115L12.693 2.38641C11.6142 1.36269 10.256 0.68192 8.79029 0.430228C7.32455 0.178536 5.81708 0.367227 4.45859 0.972431C3.1001 1.57763 1.95163 2.57216 1.15846 3.83019C0.365295 5.08822 -0.0369313 6.55324 0.00266623 8.03991C0.00266623 12.25 3.43086 15.6782 7.64091 15.6782C12.0915 15.6782 14.9784 12.4905 14.9784 8.1602L14.8582 6.71675" fill="#212121"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M21.3236 8.61128V11.2877H19.5794V8.61128H16.903V6.86712H19.5794V4.19072H21.3236V6.86712H24V8.61128H21.3236Z" fill="#212121"/>
                                    </svg>
                                </a>
                                )}
                                {socialLinks?.instagram && (
                                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="instagram">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M8 1.44578C10.1205 1.44578 10.4096 1.44578 11.2771 1.44578C12.0482 1.44578 12.4337 1.63855 12.7229 1.73494C13.1084 1.92771 13.3976 2.0241 13.6867 2.31325C13.9759 2.60241 14.1687 2.89157 14.2651 3.27711C14.3614 3.56627 14.4578 3.95181 14.5542 4.72289C14.5542 5.59036 14.5542 5.78313 14.5542 8C14.5542 10.2169 14.5542 10.4096 14.5542 11.2771C14.5542 12.0482 14.3614 12.4337 14.2651 12.7229C14.0723 13.1084 13.9759 13.3976 13.6867 13.6867C13.3976 13.9759 13.1084 14.1687 12.7229 14.2651C12.4337 14.3614 12.0482 14.4578 11.2771 14.5542C10.4096 14.5542 10.2169 14.5542 8 14.5542C5.78313 14.5542 5.59036 14.5542 4.72289 14.5542C3.95181 14.5542 3.56627 14.3614 3.27711 14.2651C2.89157 14.0723 2.60241 13.9759 2.31325 13.6867C2.0241 13.3976 1.83133 13.1084 1.73494 12.7229C1.63855 12.4337 1.54217 12.0482 1.44578 11.2771C1.44578 10.4096 1.44578 10.2169 1.44578 8C1.44578 5.78313 1.44578 5.59036 1.44578 4.72289C1.44578 3.95181 1.63855 3.56627 1.73494 3.27711C1.92771 2.89157 2.0241 2.60241 2.31325 2.31325C2.60241 2.0241 2.89157 1.83133 3.27711 1.73494C3.56627 1.63855 3.95181 1.54217 4.72289 1.44578C5.59036 1.44578 5.87952 1.44578 8 1.44578ZM8 0C5.78313 0 5.59036 0 4.72289 0C3.85542 0 3.27711 0.192772 2.79518 0.385543C2.31325 0.578314 1.83133 0.867471 1.3494 1.3494C0.867471 1.83133 0.674699 2.21687 0.385543 2.79518C0.192772 3.27711 0.0963856 3.85542 0 4.72289C0 5.59036 0 5.87952 0 8C0 10.2169 0 10.4096 0 11.2771C0 12.1446 0.192772 12.7229 0.385543 13.2048C0.578314 13.6867 0.867471 14.1687 1.3494 14.6506C1.83133 15.1325 2.21687 15.3253 2.79518 15.6145C3.27711 15.8072 3.85542 15.9036 4.72289 16C5.59036 16 5.87952 16 8 16C10.1205 16 10.4096 16 11.2771 16C12.1446 16 12.7229 15.8072 13.2048 15.6145C13.6867 15.4217 14.1687 15.1325 14.6506 14.6506C15.1325 14.1687 15.3253 13.7831 15.6145 13.2048C15.8072 12.7229 15.9036 12.1446 16 11.2771C16 10.4096 16 10.1205 16 8C16 5.87952 16 5.59036 16 4.72289C16 3.85542 15.8072 3.27711 15.6145 2.79518C15.4217 2.31325 15.1325 1.83133 14.6506 1.3494C14.1687 0.867471 13.7831 0.674699 13.2048 0.385543C12.7229 0.192772 12.1446 0.0963856 11.2771 0C10.4096 0 10.2169 0 8 0Z" fill="#212121"/>
                                        <path d="M8 3.85542C5.68675 3.85542 3.85542 5.68675 3.85542 8C3.85542 10.3133 5.68675 12.1446 8 12.1446C10.3133 12.1446 12.1446 10.3133 12.1446 8C12.1446 5.68675 10.3133 3.85542 8 3.85542ZM8 10.6988C6.55422 10.6988 5.30121 9.54217 5.30121 8C5.30121 6.55422 6.45783 5.30121 8 5.30121C9.44578 5.30121 10.6988 6.45783 10.6988 8C10.6988 9.44578 9.44578 10.6988 8 10.6988Z" fill="#212121"/>
                                        <path d="M12.241 4.72289C12.7733 4.72289 13.2048 4.29136 13.2048 3.75904C13.2048 3.22671 12.7733 2.79518 12.241 2.79518C11.7086 2.79518 11.2771 3.22671 11.2771 3.75904C11.2771 4.29136 11.7086 4.72289 12.241 4.72289Z" fill="#212121"/>
                                    </svg>
                                </a>
                                )}
                                {socialLinks?.youtube && (
                                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="youtube">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 22 16" fill="none">
                                        <path d="M21.45 2.42857C21.175 1.42857 20.4875 0.714286 19.525 0.428572C17.875 2.55448e-07 10.8625 0 10.8625 0C10.8625 0 3.98751 2.55448e-07 2.20001 0.428572C1.23751 0.714286 0.549996 1.42857 0.274996 2.42857C-4.20026e-06 4.28572 0 8 0 8C0 8 4.17978e-06 11.7143 0.412504 13.5714C0.687504 14.5714 1.375 15.2857 2.3375 15.5714C3.9875 16 11 16 11 16C11 16 17.875 16 19.6625 15.5714C20.625 15.2857 21.3125 14.5714 21.5875 13.5714C22 11.7143 22 8 22 8C22 8 22 4.28572 21.45 2.42857ZM8.79999 11.4286V4.57143L14.575 8L8.79999 11.4286Z" fill="#212121"/>
                                    </svg>
                                </a>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className={`${styles.testimonialsSection} ${styles.pageSection}`}>
                    <div className="container mx-auto px-3">
                        <h2 className={styles.sectionTitle}>{t('contactTestimonialsTitle')}</h2>
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    try {
        const locale = ctx.locale || 'uz';
        const [contactRes, testimonialsRes, socialRes] = await Promise.all([
            $api.get(`/api/aloqa?locale=${locale}`),
            $api.get(`/api/hamkorlar-fikris?locale=${locale}`),
            $api.get(`/api/ijtimoiy-tarmoqlar?locale=${locale}`)
        ]);

        const testimonials = Array.isArray(testimonialsRes?.data?.data)
            ? testimonialsRes.data.data.map((i: any) => ({
                name: i?.Ismi || '',
                text: i?.Matn || ''
            }))
            : [];
        const ensureHttpUrl = (url?: string) => {
            if (!url) return undefined;
            let u = String(url).trim();
            if (u.startsWith('htpps://')) u = 'https://' + u.slice('htpps://'.length);
            if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
            return u;
        };

        const socialData = socialRes?.data?.data || {};
        const socialLinks = {
            facebook: ensureHttpUrl(socialData.facebook_havolasi),
            google: ensureHttpUrl(socialData.Google_havolasi),
            instagram: ensureHttpUrl(socialData.instagram_havolasi),
            youtube: ensureHttpUrl(socialData.youtube_havolasi),
        };

        return {
            props: {
                contactData: contactRes?.data?.data || null,
                testimonials,
                socialLinks,
            },
        };
    } catch (e) {
        return {
            props: {
                contactData: null,
                testimonials: [],
                socialLinks: {},
            },
        };
    }
};

export default ContactPage;


