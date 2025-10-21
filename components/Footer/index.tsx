import React, {useEffect, useMemo} from 'react';
import Link from 'next/link';
import {useAppSelector} from "../../hooks/reducer";
import {selectTrack} from "../../store/selectors/player";
import {useDispatch} from "react-redux";
import {fetchSocialLinks} from "../../store/actions/about";
import {selectSocialLinks} from "../../store/selectors/about";
import {useRouter} from "next/router";
import styles from './style.module.scss';
import SiteLogo from '../SiteLogo/SiteLogo';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaTelegramPlane, FaTwitter } from 'react-icons/fa';
import useTranslation from 'next-translate/useTranslation';

const Index = () => {

    const { active_slug } = useAppSelector(selectTrack);
    const { t } = useTranslation('common');
    const dispatch = useDispatch();
    const {social} = useAppSelector(selectSocialLinks)
    const {locale} = useRouter();

    const getContacts = async () => {
        await dispatch(fetchSocialLinks({locale}));
    }

    useEffect(()=>{
        getContacts();
    }, [locale])

    const getSocialUrl = (key: string) => {
        const found = social.find((s: [string, string]) => s[0] === key);
        return found ? found[1] : '#';
    };

    const navColumns = useMemo(() => ([
        {
            title: t('footer_activity'),
            links: [
                { text: t('books'), url: '/books' },
                { text: t('authorsPage'), url: '/authors' },
                { text: t('bookipedia'), url: '/bookipedia' }
            ],
        },
        {
            title: t('footer_publisher'),
            links: [
                { text: t('about'), url: '/about' },
                { text: t('contact'), url: getSocialUrl('telegram_url') || '#' }
            ],
        },
        {
            title: t('footer_legal'),
            links: [
                { text: t('termsOfUse'), url: '/terms' },
                { text: t('privacyPolicy'), url: '/privacy-policy' },
                { text: t('publisherDocuments'), url: '#' }
            ],
        },
    ]), [social, t]);

    const socialGroups = useMemo(() => ([
        {
            title: t('footer_subscribe'),
            links: [
                { url: getSocialUrl('facebook_url'), label: 'Facebook', icon: <FaFacebookF /> },
                { url: getSocialUrl('twitter_url'), label: 'Twitter', icon: <FaTwitter /> },
                { url: getSocialUrl('instagram_url'), label: 'Instagram', icon: <FaInstagram /> },
                { url: getSocialUrl('youtube_url'), label: 'YouTube', icon: <FaYoutube /> },
                { url: getSocialUrl('telegram_channel_url'), label: 'Telegram', icon: <FaTelegramPlane /> },
            ],
        },
        {
            title: t('footer_quick_contact'),
            links: [
                { url: getSocialUrl('whatsapp_url'), label: 'WhatsApp', icon: <FaWhatsapp /> },
                { url: getSocialUrl('telegram_url'), label: 'Telegram', icon: <FaTelegramPlane /> },
            ],
        },
    ]), [social, t]);

    return (
        <footer className={styles.siteFooter} style={active_slug ? { paddingBottom: 96 } : undefined}>
            <div className="container mx-auto px-3">
                <div className={styles.footerContainer}>
                    <div className={styles.footerLeft}>
                        <div className={styles.logo}>
                            <Link href="/">
                                <a>
                                    <SiteLogo white />
                                </a>
                            </Link>
                        </div>

                        <nav className={styles.footerNav}>
                            {navColumns.map((column) => (
                                <div key={column.title} className={styles.navColumn}>
                                    <h3>{column.title}</h3>
                                    <ul>
                                        {column.links.map((link) => (
                                            <li key={link.text}>
                                                <Link href={link.url}>
                                                    <a>{link.text}</a>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </div>

                    <div className={styles.footerRight}>
                        {socialGroups.map((group) => (
                            <div key={group.title} className={styles.socialGroup}>
                                <p>{group.title}</p>
                                <ul className={styles.socialList}>
                                    {group.links.map((item) => (
                                        <li key={item.label}>
                                            <a href={item.url || '#'} aria-label={item.label} target="_blank" rel="noreferrer noopener">
                                                {item.icon}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Index;