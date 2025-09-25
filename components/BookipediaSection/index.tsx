import React, { useMemo, useState } from 'react';
import styles from './style.module.scss';
import Link from 'next/link';
import { IBlogPost } from '../../models/IBlog';
import { getBlogImageUrl } from '../../utils/strapiAdapter';

interface BookipediaSectionProps {
    posts?: IBlogPost[];
}

const BookipediaSection: React.FC<BookipediaSectionProps> = ({ posts }) => {
    const [visibleCount, setVisibleCount] = useState<number>(6);

    const safePosts = Array.isArray(posts) ? posts : [];
    const visiblePosts = useMemo(() => safePosts.slice(0, visibleCount), [safePosts, visibleCount]);
    const hasMore = visibleCount < safePosts.length;

    return (
        <section className={styles.bookipediaSection}>
            <div className={styles.sectionContainer}>
                <header className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Bookipedia</h2>
                    <p className={styles.sectionDescription}>
                        Nashriyotimiz tomonidan e'lon qilingan kitoblar va kitobxonlikka oid qiziqarli blogpostlarni shu yerda o'qishingiz mumkin
                    </p>
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
                                        <p>Bookipedia</p>
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

                {hasMore && (
                    <footer className={styles.sectionFooter}>
                        <button className={styles.btnLoadMore} onClick={() => setVisibleCount((c) => c + 3)}>Yana</button>
                    </footer>
                )}
            </div>
        </section>
    );
};

export default BookipediaSection;
