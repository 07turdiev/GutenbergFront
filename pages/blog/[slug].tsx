import React from 'react';
import { useRouter } from 'next/router';
import MainLayout from "../../layouts/MainLayout";
import useTranslation from "next-translate/useTranslation";
import HeadMeta from '../../components/HeadMeta';
import Link from 'next/link';

// Vaqtincha test ma'lumotlari
const mockBlogPost = {
    id: 1,
    slug: "audio-kitoblar-kelajagi",
    title: "Audio kitoblarning kelajagi",
    content: `
        <p>Audio kitoblar zamonaviy dunyoda tobora ommalashib bormoqda. Bu trend nafaqat texnologik rivojlanish bilan bog'liq, balki odamlarning vaqt bilan samarali ishlash ehtiyoji bilan ham aloqadordir.</p>
        
        <h2>Nima uchun audio kitoblar mashhur?</h2>
        <p>Audio kitoblarning asosiy afzalliklari:</p>
        <ul>
            <li>Ko'z yorilmaslik</li>
            <li>Ko'p vazifani bir vaqtda bajarishga imkon beradi</li>
            <li>Transport vositalarda foydalanish qulayligi</li>
            <li>Narratorning professional ijrosi</li>
        </ul>
        
        <h2>Kelajakdagi istiqbollar</h2>
        <p>Ekspertlar fikricha, yaqin 5 yil ichida audio kitoblar bozori 30% ga o'sishi kutilmoqda. Bu o'sishda AI texnologiyalari ham muhim rol o'ynaydi.</p>
        
        <blockquote>
            "Audio kitoblar - bu kelajakning kutubxonasi" - texnologiya eksperti
        </blockquote>
    `,
    publishDate: "2024-01-15",
    author: "Alisher Navoiy",
    audioUrl: "/audio/blog-post-audio.mp3",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tags: ["texnologiya", "audio", "kitoblar", "kelajak"]
};

const BlogPostPage = () => {
    const router = useRouter();
    const { slug } = router.query;
    const { t } = useTranslation('common');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const extractVideoId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    };

    return (
        <MainLayout>
            <HeadMeta title={mockBlogPost.title} description={mockBlogPost.title} />
            <div className="container mx-auto px-3 mb-10">
                
                <div className="mb-8">
                    <Link href="/blog">
                        <a className="inline-flex items-center text-primary hover:text-accent">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            Blogga qaytish
                        </a>
                    </Link>
                </div>

                <article className="max-w-4xl mx-auto">
                    
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold mb-4 text-gray-800">
                            {mockBlogPost.title}
                        </h1>
                        
                        <div className="flex items-center justify-between text-gray-600 mb-6">
                            <div className="flex items-center space-x-4">
                                <span>{mockBlogPost.author}</span>
                                <span>•</span>
                                <span>{formatDate(mockBlogPost.publishDate)}</span>
                            </div>
                        </div>
                    </header>

                    <div className="relative h-96 bg-gradient-to-r from-primary to-accent rounded-lg mb-8">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white text-6xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m2.25-13.5h-9a3 3 0 00-3 3v6a3 3 0 003 3h9a3 3 0 003-3v-6a3 3 0 00-3-3z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {mockBlogPost.audioUrl && (
                        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.79-1.59-1.76V9.98c0-.97.71-1.76 1.59-1.76h2.24z" />
                                </svg>
                                Audio versiya
                            </h3>
                            <audio controls className="w-full">
                                <source src={mockBlogPost.audioUrl} type="audio/mpeg" />
                                Brauzeringiz audio elementini qo'llab-quvvatlamaydi.
                            </audio>
                        </div>
                    )}

                    {mockBlogPost.youtubeUrl && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                                </svg>
                                Video versiya
                            </h3>
                            <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                                {extractVideoId(mockBlogPost.youtubeUrl) ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${extractVideoId(mockBlogPost.youtubeUrl)}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-gray-500">Video yuklanmadi</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div 
                        className="prose prose-lg max-w-none mb-8"
                        dangerouslySetInnerHTML={{ __html: mockBlogPost.content }}
                    />

                    {mockBlogPost.tags && mockBlogPost.tags.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">Teglar:</h3>
                            <div className="flex flex-wrap gap-2">
                                {mockBlogPost.tags.map((tag, index) => (
                                    <span 
                                        key={index}
                                        className="bg-red-100 text-primary px-3 py-1 rounded-full text-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="border-t pt-8">
                        <h3 className="text-lg font-semibold mb-4">Ulashing:</h3>
                        <div className="flex space-x-4">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Facebook
                            </button>
                            <button className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                                Twitter
                            </button>
                            <button className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                                Telegram
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </MainLayout>
    );
};

export default BlogPostPage; 