import React, { useState } from 'react';
import Image from "next/image";
import aboutImg from "../../assets/images/aboutImg.png";
import authorsCountImg from "../../assets/images/authorsCount.svg";
import CountUp from "react-countup";
import booksCountImg from "../../assets/images/booksCount.svg";
import personCountImg from "../../assets/images/personCount.svg";
import {useAppSelector} from "../../hooks/reducer";
import {selectAbout} from "../../store/selectors/about";
import {useInView} from "react-intersection-observer";
import useTranslation from "next-translate/useTranslation";
import {useRouter} from "next/router";
import HeadMeta from "../../components/HeadMeta";
import GenresSection from "../../components/GenresSection";
import BooksShowcaseSection from "../../components/BooksShowcaseSection";
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './style.module.scss';
import { selectTeamMembers } from "../../store/selectors/team";
import MainLayout from "../../layouts/MainLayout";
import {wrapper} from "../../store/store";
import {fetchAbout, fetchStatistics} from "../../store/actions/about";
import {fetchNovels} from "../../store/actions/novel";
import {fetchTeamMembers} from "../../store/actions/team";
import { ensureAbsoluteUrl } from "../../config/api";

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const dispatch = store.dispatch;
    await dispatch(fetchAbout({locale: ctx.locale}))
    await dispatch(fetchStatistics({locale: ctx.locale}))
    await dispatch(fetchTeamMembers({locale: ctx.locale}))
    await dispatch(fetchNovels({ locale: ctx.locale, opt: { params: { 'pagination[pageSize]': 5, 'sort[0]': 'createdAt:desc' } }, ctx }))
    return {
        props: {},
    };
});

const AboutPage = () => {

    const router = useRouter();
    const { locale } = router;
    const {description, statistics} = useAppSelector(selectAbout)
    const { t } = useTranslation('common')

    const [ref, inView] = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });

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

    const teamMembersStore = useAppSelector(selectTeamMembers);
    const teamMembers = (teamMembersStore || []).map((m)=>({
        id: m.id,
        name: m.ismi,
        role: m.Lavozimi,
        imageUrl: m?.rasmi?.formats?.small?.url ? m.rasmi.formats.small.url : (m?.rasmi?.url ? m.rasmi.url : 'https://placehold.co/400x547/e0e0e0/e0e0e0'),
        url: '#',
        nameClass: styles.nameBlue,
        roleClass: styles.roleBlue,
    }));

    return (
        <MainLayout>
            <HeadMeta 
                title={t('aboutMetaTitle')}
                description={t('aboutMetaDescription')}
                keywords={t('aboutMetaKeywords')}
                ogImg="https://gutenbergnu.uz/og-default-img.jpg"
            />
            <section className={styles.staticHero}>
                <div className={styles.heroContainer}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src={aboutImg}
                            alt="Gutenberg Nashriyot Uyi"
                            width={317}
                            height={410}
                            className={styles.heroImg}
                        />
                    </div>
                    <div className={styles.textWrapper}>
                        <h1 className={styles.heroTitle}>
                            <span className={styles.gutenberg}>GUTENBERG</span><br/>
                            <span className={styles.nashriyot}>NASHRIYOT UYI</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            {t('heroMotto')}
                        </p>
                    </div>
                </div>
            </section>
            <div className="container mx-auto px-3">
                
                <GenresSection genres={genres} activeGenre={activeGenre} onSelect={setActiveGenre} />
                <section className={styles.aboutPublisherSection}>
                    <div className={styles.aboutContainer}>
                        <h2 className={styles.sectionTitle}>{t('publisherAboutTitle')}</h2>
                        {description && (description as any).description && (
                            <div className={styles.sectionText} dangerouslySetInnerHTML={{ __html: (description as any).description }} />
                        )}
                    </div>
                </section>

                {/* GroupSection */}
                <section className={styles.teamSection}>
                    <div className={styles.sectionContainer}>
                        <header className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>{t('team')}</h2>
                            <p className={styles.sectionDescription}>
                                {t('teamSubtitle')}
                            </p>
                        </header>

                        <Swiper
                            slidesPerView={2.5}
                            spaceBetween={20}
                            className={styles.teamSwiper}
                            breakpoints={{
                                320: { slidesPerView: 1.5, spaceBetween: 16 },
                                640: { slidesPerView: 2, spaceBetween: 20 },
                                1024: { slidesPerView: 2.5, spaceBetween: 20 },
                                1400: { slidesPerView: 2.5, spaceBetween: 20 },
                            }}
                        >
                            {teamMembers.map((member) => (
                                <SwiperSlide key={member.id} className={styles.teamSlide}>
                                    <div className={styles.teamCard}>
                                        <div className={styles.imageWrapperTeam}>
                                            <img src={member.imageUrl?.startsWith('http') ? member.imageUrl : ensureAbsoluteUrl(member.imageUrl)} alt={member.name} className={styles.teamImage} />
                                        </div>
                                        <div className={styles.teamInfo}>
                                            <h3 className={member.nameClass}>{member.name}</h3>
                                            <p className={member.roleClass}>{member.role}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </section>
                <section className="container mx-auto px-3 md:mb-12 mb-7 md:mt-16 mt-10">
                    <BooksShowcaseSection />
                </section>
            </div>
        </MainLayout>
    );
};

export default AboutPage;
