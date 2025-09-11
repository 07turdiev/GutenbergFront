import React, { useEffect, useState } from 'react';
import styles from './style.module.scss';
import $api from '../../http';
import { useRouter } from 'next/router';
import { ensureAbsoluteUrl } from '../../config/api';
import useTranslation from 'next-translate/useTranslation';

interface TestimonialItem {
    id: number;
    name: string;
    role: string;
    imageUrl: string;
    quoteText: string;
}

const TestimonialsSection: React.FC = () => {
    const router = useRouter();
    const { t } = useTranslation('common');
    const [items, setItems] = useState<TestimonialItem[]>([]);
    const [activeTestimonialId, setActiveTestimonialId] = useState<number>(2);

    useEffect(() => {
        const fetchDonolar = async () => {
            try {
                const locale = router.locale || 'uz';
                // Use locale query parameter
                let response;
                try {
                    response = await $api.get(`api/donolar?populate=Rasmi&populate=Rasmi2&populate=Rasmi3&locale=${locale}`);
                } catch (e) {
                    response = await $api.get(`api/donolar?populate=Rasmi&populate=Rasmi2&populate=Rasmi3&locale=uz`);
                }
                const data = response?.data?.data;
                if (!data) return;

                const img1Raw = data?.Rasmi?.formats?.medium?.url || data?.Rasmi?.formats?.small?.url || data?.Rasmi?.url || '';
                const img2Raw = data?.Rasmi2?.formats?.medium?.url || data?.Rasmi2?.formats?.small?.url || data?.Rasmi2?.url || '';
                const img3Raw = data?.Rasmi3?.formats?.medium?.url || data?.Rasmi3?.formats?.small?.url || data?.Rasmi3?.url || '';
                const placeholder = 'https://placehold.co/399x386/e0e0e0/e0e0e0';
                const imageUrl1 = img1Raw ? ensureAbsoluteUrl(img1Raw) : placeholder;
                const imageUrl2 = img2Raw ? ensureAbsoluteUrl(img2Raw) : placeholder;
                const imageUrl3 = img3Raw ? ensureAbsoluteUrl(img3Raw) : placeholder;
                const mapped: TestimonialItem[] = [
                    {
                        id: 1,
                        name: data?.Ismi || '',
                        role: data?.Kim || '',
                        imageUrl: imageUrl1,
                        quoteText: data?.Sharh || '',
                    },
                    {
                        id: 2,
                        name: data?.Ismi2 || '',
                        role: data?.Kim2 || '',
                        imageUrl: imageUrl2,
                        quoteText: data?.Sharh2 || '',
                    },
                    {
                        id: 3,
                        name: data?.Ismi3 || '',
                        role: data?.Kim3 || '',
                        imageUrl: imageUrl3,
                        quoteText: data?.Sharh3 || '',
                    },
                ];

                let result = mapped;
                const someMissing = mapped.some(m => !m.name || !m.quoteText || !m.role);
                if (someMissing && locale !== 'uz') {
                    try {
                        // Fallback to uz content for missing fields
                        let fbRes;
                        try {
                            fbRes = await $api.get(`api/donolar?populate=Rasmi&populate=Rasmi2&populate=Rasmi3&locale=uz`);
                        } catch (e) {
                            fbRes = await $api.get(`api/donolar?populate=Rasmi&populate=Rasmi2&populate=Rasmi3&locale=uz`);
                        }
                        const fb = fbRes?.data?.data;
                        if (fb) {
                            const fbImg1 = fb?.Rasmi?.formats?.medium?.url || fb?.Rasmi?.formats?.small?.url || fb?.Rasmi?.url || '';
                            const fbImg2 = fb?.Rasmi2?.formats?.medium?.url || fb?.Rasmi2?.formats?.small?.url || fb?.Rasmi2?.url || '';
                            const fbImg3 = fb?.Rasmi3?.formats?.medium?.url || fb?.Rasmi3?.formats?.small?.url || fb?.Rasmi3?.url || '';
                            const fbMapped: TestimonialItem[] = [
                                { id: 1, name: fb?.Ismi || '', role: fb?.Kim || '', imageUrl: fbImg1 ? ensureAbsoluteUrl(fbImg1) : placeholder, quoteText: fb?.Sharh || '' },
                                { id: 2, name: fb?.Ismi2 || '', role: fb?.Kim2 || '', imageUrl: fbImg2 ? ensureAbsoluteUrl(fbImg2) : placeholder, quoteText: fb?.Sharh2 || '' },
                                { id: 3, name: fb?.Ismi3 || '', role: fb?.Kim3 || '', imageUrl: fbImg3 ? ensureAbsoluteUrl(fbImg3) : placeholder, quoteText: fb?.Sharh3 || '' },
                            ];
                            result = mapped.map((m, i) => ({
                                ...m,
                                name: m.name || fbMapped[i]?.name || '',
                                role: m.role || fbMapped[i]?.role || '',
                                quoteText: m.quoteText || fbMapped[i]?.quoteText || '',
                                imageUrl: m.imageUrl || fbMapped[i]?.imageUrl || placeholder,
                            }));
                        }
                    } catch (e) {
                        // ignore fb errors
                    }
                }

                const filtered = result.filter(m => m.name || m.quoteText || m.role);
                setItems(filtered);
                setActiveTestimonialId(filtered[1]?.id ?? filtered[0]?.id ?? 1);
            } catch (e) {
                // silently keep defaults
                // console.log(e);
            }
        };
        fetchDonolar();
    }, [router.locale]);

    return (
        <section className={styles.testimonialsSection}>
            <div className={styles.sectionContainer}>
                <header className={styles.sectionHeader}>
                    <p className={styles.sectionPretitle}>{t('testimonials_pretitle') || 'Iqtiboslar'}</p>
                    <h2 className={styles.sectionTitle}>{t('testimonials_title') || 'Donolar nima deydi?'}</h2>
                </header>

                <main className={styles.testimonialsGrid}>
                    {items.map((testimonial) => {
                        const isActive = testimonial.id === activeTestimonialId;
                        return (
                            <div
                                key={testimonial.id}
                                className={`${styles.testimonialCard} ${isActive ? styles.isActive : ''}`}
                                onClick={() => setActiveTestimonialId(testimonial.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') setActiveTestimonialId(testimonial.id);
                                }}
                            >
                                <div className={styles.cardInner}>
                                    <div className={styles.cardImageContent} aria-hidden={isActive}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={testimonial.imageUrl}
                                            alt={testimonial.name}
                                            className={styles.cardImage}
                                        />
                                        <div className={styles.cardInfo}>
                                            <h3>{testimonial.name}</h3>
                                            <p>{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <div className={styles.cardQuoteContent} aria-hidden={!isActive}>
                                        <div className={styles.quoteBody}>
                                            <span className={styles.quoteIcon}>“</span>
                                            <p className={styles.quoteText}>{testimonial.quoteText}</p>
                                        </div>
                                        <div className={styles.cardInfo}>
                                            <h3>{testimonial.name}</h3>
                                            <p>{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </main>
            </div>
        </section>
    );
};

export default TestimonialsSection;


