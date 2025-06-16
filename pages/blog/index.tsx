import React from 'react';
import MainLayout from "../../layouts/MainLayout";
import useTranslation from "next-translate/useTranslation";
import HeadMeta from '../../components/HeadMeta';
import Link from 'next/link';

// Vaqtincha test ma'lumotlari (keyinroq API dan keladi)
const mockBlogPosts = [
    {
        id: 1,
        slug: "audio-kitoblar-kelajagi",
        title: "Audio kitoblarning kelajagi",
        excerpt: "Audio kitoblar qanchalik tez rivojlanib borayotgani va bu sohaning istiqbollari haqida...",
        publishDate: "2024-01-15",
        image: "/images/blog/post1.jpg",
        author: "Alisher Navoiy"
    },
    {
        id: 2,
        slug: "ijodiy-jarayon",
        title: "Ijodiy jarayonda audio va text",
        excerpt: "Zamonaviy adabiyot yaratishda audio va matn o'rtasidagi bog'liqlik muhimligi...",
        publishDate: "2024-01-10",
        image: "/images/blog/post2.jpg",
        author: "Zarina Abdullayeva"
    },
    {
        id: 3,
        slug: "texnologiya-va-kitob",
        title: "Texnologiya va kitob duniyosi",
        excerpt: "Qanday qilib zamonaviy texnologiyalar kitob o'qish tajribasini o'zgartirmoqda...",
        publishDate: "2024-01-05",
        image: "/images/blog/post3.jpg",
        author: "Bobur Karimov"
    },
    {
        id: 4,
        slug: "uzbek-adabiyoti-audio",
        title: "O'zbek adabiyoti audio formatda",
        excerpt: "Milliy adabiyotimizni audio shaklda taqdim etishning afzalliklari va qiyinchiliklari...",
        publishDate: "2024-01-01",
        image: "/images/blog/post4.jpg",
        author: "Nilufar Saidova"
    }
];

const BlogPage = () => {
    const { t } = useTranslation('common');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <MainLayout>
            <HeadMeta title={t('blog')} description={t('blog')} />
            <div className="container mx-auto px-3 mb-10">
                
                {/* Sarlavha */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">{t('blog')}</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        So'nggi yangiliklar, maqolalar va qiziqarli ma'lumotlar
                    </p>
                </div>

                {/* Blog postlari */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockBlogPosts.map((post) => (
                        <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            
                            {/* Rasm */}
                            <div className="relative h-48 bg-gradient-to-r from-primary to-accent">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-white text-4xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m2.25-13.5h-9a3 3 0 00-3 3v6a3 3 0 003 3h9a3 3 0 003-3v-6a3 3 0 00-3-3z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Kontent */}
                            <div className="p-6">
                                
                                {/* Sana va muallif */}
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                    <span>{formatDate(post.publishDate)}</span>
                                    <span>{post.author}</span>
                                </div>

                                {/* Sarlavha */}
                                <h2 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
                                    {post.title}
                                </h2>
                                
                                {/* Qisqacha matn */}
                                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                
                                {/* Batafsil tugmasi */}
                                <Link href={`/blog/${post.slug}`}>
                                    <a className="inline-flex items-center text-primary hover:text-accent font-medium text-sm">
                                        {t('readMore')}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </a>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Pagination (keyinroq API bilan bog'lanadi) */}
                <div className="mt-12 flex justify-center">
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                            Avvalgi
                        </button>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg">
                            1
                        </button>
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                            2
                        </button>
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                            Keyingi
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default BlogPage; 