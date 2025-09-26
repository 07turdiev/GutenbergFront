import React, { useEffect, useMemo, useState } from 'react';
import styles from './style.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getApiUrl, ensureAbsoluteUrl } from '../../config/api';

type StrapiImageFormat = {
    url: string;
    width?: number;
    height?: number;
};

type StrapiImage = {
    url?: string;
    formats?: Record<string, StrapiImageFormat>;
};

type BookipediaItem = {
    id: number;
    slug: string;
    Nomi: string;
    Matn?: string;
    Obunachilar?: string;
    Rasmi?: StrapiImage;
    Obunachi_rasmi1?: StrapiImage;
    Obunachi_rasmi2?: StrapiImage;
    Obunachi_rasmi3?: StrapiImage;
};

const BookipediaHero: React.FC = () => {
    const router = useRouter();

    const [item, setItem] = useState<BookipediaItem | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showCopied, setShowCopied] = useState<boolean>(false);
    const [telegramUrl, setTelegramUrl] = useState<string>('https://t.me/gutenbergnu');

    const buildImageUrl = (img?: StrapiImage, preferred: string[] = ['large', 'medium', 'small', 'thumbnail']): string | null => {
        if (!img) return null;
        if (img.formats) {
            for (const key of preferred) {
                const fmt = img.formats[key];
                if (fmt?.url) return ensureAbsoluteUrl(fmt.url);
            }
        }
        return img.url ? ensureAbsoluteUrl(img.url) : null;
    };

    const safeExtractMedia = (media: any): StrapiImage | undefined => {
        if (!media) return undefined;
        // Already flat object with url/formats
        if (media.url || media.formats) return media as StrapiImage;
        // Strapi v4 shape: { data: { attributes: { url, formats } } }
        if (media.data) {
            const attributes = media.data.attributes || media.data;
            return {
                url: attributes?.url,
                formats: attributes?.formats,
            } as StrapiImage;
        }
        return undefined;
    };

    useEffect(() => {
        const controller = new AbortController();
        const fetchLatest = async () => {
            try {
                setLoading(true);
                const locale = router.locale || 'uz';
                const params = new URLSearchParams();
                params.set('locale', locale);
                params.append('populate', 'Rasmi');
                params.append('populate', 'Obunachi_rasmi1');
                params.append('populate', 'Obunachi_rasmi2');
                params.append('populate', 'Obunachi_rasmi3');
                params.set('sort[0]', 'createdAt:desc');
                params.set('pagination[pageSize]', '1');

                const url = `${getApiUrl()}api/bookipedias?${params.toString()}`;
                const res = await fetch(url, { signal: controller.signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                const raw = json?.data?.[0] ?? null;
                if (!raw) {
                    setItem(null);
                    return;
                }
                const a = raw.attributes || raw; // support both shapes
                const normalized: BookipediaItem = {
                    id: raw.id ?? a.id,
                    slug: a.slug,
                    Nomi: a.Nomi,
                    Matn: a.Matn,
                    Obunachilar: a.Obunachilar,
                    Rasmi: safeExtractMedia(a.Rasmi),
                    Obunachi_rasmi1: safeExtractMedia(a.Obunachi_rasmi1),
                    Obunachi_rasmi2: safeExtractMedia(a.Obunachi_rasmi2),
                    Obunachi_rasmi3: safeExtractMedia(a.Obunachi_rasmi3),
                };
                setItem(normalized);
            } catch (e) {
                // Silently keep placeholders on error
                setItem(null);
            } finally {
                setLoading(false);
            }
        };

        fetchLatest();
        return () => controller.abort();
    }, [router.locale]);

    // Fetch social links for Telegram channel
    useEffect(() => {
        const controller = new AbortController();
        const fetchSocials = async () => {
            try {
                const url = `${getApiUrl()}api/ijtimoiy-tarmoqlar`;
                const res = await fetch(url, { signal: controller.signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                const data = json?.data || {};
                const channel = data?.Telegram_kanal || data?.telegram_havolasi || data?.telegram_kanal;
                if (typeof channel === 'string' && channel.startsWith('http')) {
                    setTelegramUrl(channel);
                }
            } catch (_) {
                // keep default fallback
            }
        };
        fetchSocials();
        return () => controller.abort();
    }, []);

    const heroImageSrc = useMemo(() => buildImageUrl(item?.Rasmi) || 'https://placehold.co/452x585/e0e0e0/ffffff?text=&font=poppins', [item]);
    const user1Src = useMemo(() => buildImageUrl(item?.Obunachi_rasmi1, ['small', 'thumbnail']) || 'https://placehold.co/33x33/e0e0e0/e0e0e0', [item]);
    const user2Src = useMemo(() => buildImageUrl(item?.Obunachi_rasmi2, ['small', 'thumbnail']) || 'https://placehold.co/33x33/d4d4d4/d4d4d4', [item]);
    const user3Src = useMemo(() => buildImageUrl(item?.Obunachi_rasmi3, ['small', 'thumbnail']) || 'https://placehold.co/33x33/c8c8c8/c8c8c8', [item]);
    const titleText = item?.Nomi || "Qanday qilib ko'proq kitob o'qish mumkin?";
    const descriptionText = useMemo(() => {
        const text = item?.Matn || "Noaniq sharoitda qanday qilib dadil qarorlar qabul qilish, omadsizliklardan imkoniyat sifatida foydalanish va uzoq muddatli, barqaror muvaffaqiyatga erishish haqidagi fundamental qo'llanma.";
        return text.length > 250 ? `${text.substring(0, 250)}...` : text;
    }, [item]);
    const readers = item?.Obunachilar ? `${item.Obunachilar}+` : '1K+';

    const handleShare = async () => {
        if (!item?.slug) return;
        
        const url = `${window.location.origin}/bookipedia/${item.slug}`;
        
        try {
            await navigator.clipboard.writeText(url);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        }
    };

    return (
        <section className={styles.heroContainer}>
                <div className={styles.imageColumn}>
                    <div className={styles.imageWrapper}>
                        <img
                            src={heroImageSrc}
                            alt={titleText}
                        />
                    </div>
                </div>

                <div className={styles.contentColumn}>
                    <div className={styles.statsCard}>
                        <span>{readers}</span>
                        <p>O'quvchilar</p>
                        <div className={styles.userIcons}>
                            <img src={user1Src} alt="user" />
                            <img src={user2Src} alt="user" />
                            <img src={user3Src} alt="user" />
                        </div>
                        <button
                            className={styles.arrowBtn}
                            aria-label="Keyingi"
                            onClick={() => window.open(telegramUrl, '_blank', 'noopener,noreferrer')}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="15" viewBox="0 0 13 15" fill="none">
                        <path d="M6.07692 1L12 7.5M12 7.5L6.07692 14M12 7.5L1 7.5" stroke="#009DFF" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        </button>
                    </div>

                    <h1 className={styles.mainTitle}>{titleText}</h1>

                    <div className={styles.descriptionAndActions}>
                        <div className={styles.actions}>
                            <Link href={item?.slug ? `/bookipedia/${item.slug}` : '#'}>
                                <a className={styles.btnRead}>{loading ? '...' : "O'qish"}</a>
                            </Link>
                            <button className={styles.btnShare} aria-label="Ulashish" onClick={handleShare}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17" fill="none">
                            <path d="M4.99902 0.90625C2.23802 0.90625 -0.000976562 3.14525 -0.000976562 5.90625V6.90625C-0.000976562 8.00625 0.329029 9.20024 1.28003 10.2192C1.65703 10.6222 2.28303 10.6582 2.68703 10.2812C3.09003 9.90425 3.12602 9.24724 2.74902 8.84424C2.20902 8.26524 1.99902 7.54725 1.99902 6.90625V5.90625C1.99902 4.24925 3.34202 2.90625 4.99902 2.90625H10.999C12.656 2.90625 13.999 4.24925 13.999 5.90625V6.90625C13.999 8.56325 12.656 9.90625 10.999 9.90625H8.99902C8.44702 9.90625 7.99902 10.3542 7.99902 10.9062C7.99902 11.4583 8.44702 11.9062 8.99902 11.9062H10.999C13.76 11.9062 15.999 9.66725 15.999 6.90625V5.90625C15.999 3.14525 13.76 0.90625 10.999 0.90625H4.99902ZM8.99902 5.90625C6.23802 5.90625 3.99902 8.14525 3.99902 10.9062V11.9062C3.99902 14.6672 6.23802 16.9062 8.99902 16.9062H14.999C17.76 16.9062 19.999 14.6672 19.999 11.9062V10.9062C19.999 9.80625 19.669 8.61224 18.718 7.59424C18.341 7.19024 17.715 7.15425 17.311 7.53125C16.908 7.90825 16.872 8.56524 17.249 8.96924C17.789 9.54724 17.999 10.2653 17.999 10.9062V11.9062C17.999 13.5632 16.656 14.9062 14.999 14.9062H8.99902C7.34202 14.9062 5.99902 13.5632 5.99902 11.9062V10.9062C5.99902 9.24925 7.34202 7.90625 8.99902 7.90625H10.999C11.551 7.90625 11.999 7.45825 11.999 6.90625C11.999 6.35425 11.551 5.90625 10.999 5.90625H8.99902Z" fill="#58BB43"/>
                            </svg>
                            </button>
                        </div>
                        <p className={styles.description}>
                            {descriptionText}
                        </p>
                    </div>
                    
                    {showCopied && (
                        <div className={styles.copiedToast}>
                            <span>Havola nusxa olindi!</span>
                        </div>
                    )}
                </div>
        </section>
    );
};

export default BookipediaHero;


