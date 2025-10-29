import React, { useMemo } from 'react';
import styles from './style.module.scss';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { IBlogPost } from '../../models/IBlog';
import { getBlogImageUrl } from '../../utils/strapiAdapter';

interface BookipediaSectionProps {
    posts?: IBlogPost[];
}

const BookipediaSection: React.FC<BookipediaSectionProps> = ({ posts }) => {
    const { t } = useTranslation('common');

    const safePosts = Array.isArray(posts) ? posts : [];
    const sortedPosts = useMemo(() => {
        const arr = [...safePosts];
        arr.sort((a, b) => {
            const aDate = new Date(a.publishedAt || a.createdAt || a.updatedAt || a.chop_sanasi || 0).getTime();
            const bDate = new Date(b.publishedAt || b.createdAt || b.updatedAt || b.chop_sanasi || 0).getTime();
            return bDate - aDate;
        });
        return arr;
    }, [safePosts]);

    const visiblePosts = useMemo(() => sortedPosts.slice(0, 3), [sortedPosts]);

    return (
        <section className={styles.bookipediaSection}>
            <div className={styles.sectionContainer}>
                <header className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{t('bookipedia')}</h2>
                    <div className={styles.sectionDetails}>
                        <p className={styles.sectionDescription}>
                            {t('bookipediaDescription')}
                        </p>
                        <Link href="/bookipedia">
                            <a className={styles.sectionLink}>
                            Ko‘proq o‘qish
                                <span className={styles.arrowCircle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 39 39" fill="none">
                                        <path d="M13 12.9994H26M26 12.9994V25.9994M26 12.9994L13 25.9994" stroke="#009DFF"/>
                                    </svg>
                                </span>
                            </a>
                        </Link>
                    </div>
                </header>

                <main className={styles.articlesGrid}>
                    {visiblePosts.map((post) => (
                        <Link href={`/bookipedia/${post.slug}`} key={post.id}>
                            <a className={styles.articleCard}>
                                <div className={styles.cardImageWrapper}>
                                    <img src={getBlogImageUrl(post.rasmi)} alt={post.sarlavha} />
                                </div>
                                <div className={styles.cardContent}>
                                    <div className={styles.cardText}>
                                        <h3>{post.sarlavha}</h3>
                                        <p>{t('bookipedia')}</p>
                                    </div>
                                    <span className={styles.arrowCircle}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39" fill="none">
                                            <path d="M13 12.9994H26M26 12.9994V25.9994M26 12.9994L13 25.9994" stroke="#009DFF"/>
                                        </svg>
                                    </span>
                                </div>
                            </a>
                        </Link>
                    ))}
                </main>

                {/* Only showing the latest 3 posts; no load more button */}
            </div>
        </section>
    );
};

export default BookipediaSection;
