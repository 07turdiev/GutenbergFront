import React, { useMemo } from 'react';
import Link from 'next/link';
import styles from './style.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector } from '../../hooks/reducer';
import { selectLatestBlogPosts } from '../../store/selectors/blog';
import { IBlogPost } from '../../models/IBlog';
import { ensureAbsoluteUrl } from '../../config/api';

interface ArticleItem {
    id: number | string;
    title: string;
    category: string;
    imageUrl: string;
    url: string;
}

const BookipediaSection: React.FC = () => {
    const { t } = useTranslation('common');
    const latestBlogPosts = useAppSelector(selectLatestBlogPosts);

    const getImageUrl = (post: IBlogPost): string => {
        if (!post.rasmi) return 'https://placehold.co/400x300/e0e0e0/e0e0e0';
        if (post.rasmi.formats?.medium?.url) return ensureAbsoluteUrl(post.rasmi.formats.medium.url);
        return ensureAbsoluteUrl(post.rasmi.url);
    };

    const articles: ArticleItem[] = useMemo(() => {
        if (!latestBlogPosts || latestBlogPosts.length === 0) return [];
        return latestBlogPosts.slice(0, 3).map((post) => ({
            id: post.id,
            title: post.sarlavha,
            category: 'Bookipedia',
            imageUrl: getImageUrl(post),
            url: `/blog/${post.slug}`,
        }));
    }, [latestBlogPosts]);

    return (
        <section className={styles.bookipediaSection}>
            <div className={styles.sectionContainer}>
                <header className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Bookipedia</h2>
                    <div className={styles.sectionDetails}>
                        <p className={styles.sectionDescription}>
                            {t('bookipediaDescription')}
                        </p>
                        <Link href="#">
                            <a className={styles.sectionLink}>
                                {t('readMore')}
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                                    <path d="M11.1538 18.5377L16.6923 12.9993L11.1538 7.46081M1 12.9993C1 6.37185 6.37258 0.999268 13 0.999267C19.6274 0.999266 25 6.37185 25 12.9993C25 19.6267 19.6274 24.9993 13 24.9993C6.37258 24.9993 1 19.6267 1 12.9993Z" stroke="#009DFF" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </a>
                        </Link>
                    </div>
                </header>

                {articles.length > 0 && (
                <main className={styles.articlesGrid}>
                    {articles.map((article) => (
                        <Link key={article.id} href={article.url}>
                            <a className={styles.articleCard}>
                                <div className={styles.cardImageWrapper}>
                                    <img src={article.imageUrl} alt={article.title} />
                                </div>
                                <div className={styles.cardContent}>
                                    <div className={styles.cardText}>
                                        <h3>{article.title}</h3>
                                        <p>{article.category}</p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                                        <path d="M11.1538 18.5377L16.6923 12.9993L11.1538 7.46081M1 12.9993C1 6.37185 6.37258 0.999268 13 0.999267C19.6274 0.999266 25 6.37185 25 12.9993C25 19.6267 19.6274 24.9993 13 24.9993C6.37258 24.9993 1 19.6267 1 12.9993Z" stroke="#009DFF" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </a>
                        </Link>
                    ))}
                </main>
                )}
            </div>
        </section>
    );
};

export default BookipediaSection;


