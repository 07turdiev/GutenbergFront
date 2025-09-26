import {INovel, IRichTextContent} from "../models/INovel";
import {ICategory} from "../models/ICategory";
import {IAuthor} from "../models/IAuthors";
import {IAbout, IContacts, ISocial, IStatistics} from "../models/IAbout";
import {ITeamMember} from "../models/ITeam";
import {IBlogPost} from "../models/IBlog";
import { getApiBaseUrl, ensureAbsoluteUrl } from "../config/api";

// Convert Strapi rich text to plain text
export const richTextToPlainText = (richText: IRichTextContent[]): string => {
    if (!richText || !Array.isArray(richText)) return '';
    
    return richText
        .map(block => 
            block.children
                ?.map(child => child.text || '')
                .join('')
        )
        .join('\n\n')  // Use double newline to separate paragraphs
        .trim();
};

// Convert Strapi rich text to excerpt (first 150 chars)
export const richTextToExcerpt = (richText: IRichTextContent[], maxLength: number = 150): string => {
    const plainText = richTextToPlainText(richText);
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText;
};

// Helper function to clean age rate value
const cleanAgeRate = (ageRate: string): string => {
    if (!ageRate) return '';
    // Remove "yosh" prefix and "+" suffix, keep only the number
    return ageRate.replace(/^yosh/i, '').replace(/\+$/, '');
};

// Convert new Novel format to backward compatible format
export const adaptNovelData = (novel: INovel): INovel => {
    if (!novel) return null;
    
    return {
        ...novel,
        // Map new fields to old field names for backward compatibility
        name: novel.nomi || novel.name || '',
        description: novel.tavsifi ? richTextToPlainText(novel.tavsifi) : (novel.description || ''),
        age_rate: cleanAgeRate(novel.yosh_chegarasi || novel.age_rate || ''),
        actual: novel.dolzarb ?? novel.actual ?? false,
        new: novel.yangi ?? novel.new ?? false,
        rating: novel.reyting || novel.rating || 0,
        duration_uz: novel.audio_davomiyligi || novel.duration_uz || 0,
        duration: `${novel.audio_davomiyligi || 0}`, // Convert to string for compatibility
        author: novel.mualliflar ? adaptAuthorData(novel.mualliflar) : (novel.author || null),
        genre: novel.kategoriya?.map(c => adaptCategoryData(c).name || c.Nomi) || novel.genre || [],
        categories: novel.kategoriya?.map(c => adaptCategoryData(c).name || c.Nomi) || novel.categories || [],
        published_at: novel.publishedAt || novel.published_at || '',
        cover: novel.muqova ? {
            src: ensureAbsoluteUrl(novel.muqova.url),
            width: novel.muqova.width || 0,
            height: novel.muqova.height || 0,
            base64: ''
        } : (novel.cover || null),
        // Map audio file if available
        audio_list: novel.audio ? [{
            file: ensureAbsoluteUrl(novel.audio.url),
            name: novel.nomi || '',
            duration: novel.audio_davomiyligi || 0,
            order: 1
        }] : (novel.audio_list || []),
        // Ensure serializable fields
        saved: novel.saved || false,
        language: novel.locale || novel.language || 'uz'
    };
};

// Convert new Author format to backward compatible format
export const adaptAuthorData = (author: IAuthor): IAuthor => {
    if (!author) return null;
    
    // Ensure photo is never undefined, only null or valid object
    let photo = null;
    if (author.rasmi && author.rasmi.url) {
        photo = {
            src: ensureAbsoluteUrl(author.rasmi.url),
            width: author.rasmi.width || 0,
            height: author.rasmi.height || 0,
            base64: ''
        };
    } else if (author.suratilar?.[0]?.url) {
        photo = {
            src: ensureAbsoluteUrl(author.suratilar[0].url),
            width: author.suratilar[0].width || 0,
            height: author.suratilar[0].height || 0,
            base64: ''
        };
    }
    
    return {
        ...author,
        name: author.ismi || author.name || '',
        biography: author.tarjimai_holi ? richTextToPlainText(author.tarjimai_holi) : (author.biography || ''),
        novels_count: author.romanlar_soni || author.novels_count || 0,
        photo: photo,
        // Ensure all fields are serializable
        followed: author.followed || false
    };
};

// Convert new Category format to backward compatible format
export const adaptCategoryData = (category: ICategory): ICategory => {
    if (!category) return null;
    
    return {
        ...category,
        name: category.Nomi || category.name || '',
        parent: category.ota_kategoriya || category.parent || '',
        icon: category.ikonka || category.icon || ''
    };
};

// Adapt array of novels
export const adaptNovelsArray = (novels: INovel[]): INovel[] => {
    return novels.map(novel => adaptNovelData(novel));
};

// Adapt array of authors
export const adaptAuthorsArray = (authors: IAuthor[]): IAuthor[] => {
    return authors.map(author => adaptAuthorData(author));
};

// Adapt array of categories
export const adaptCategoriesArray = (categories: ICategory[]): ICategory[] => {
    return categories.map(category => adaptCategoryData(category));
};

// Convert Strapi rich text to HTML
export const richTextToHtml = (richText: IRichTextContent[]): string => {
    if (!richText || !Array.isArray(richText)) return '';
    
    return richText
        .map(block => {
            if (block.type === 'paragraph') {
                const content = block.children
                    ?.map((child: any) => {
                        let text = child.text || '';
                        if (child.bold) text = `<strong>${text}</strong>`;
                        if (child.italic) text = `<em>${text}</em>`;
                        if (child.underline) text = `<u>${text}</u>`;
                        return text;
                    })
                    .join('');
                // Convert newline characters to HTML line breaks
                const contentWithBreaks = content.replace(/\n/g, '<br/>' );
                return `<p>${contentWithBreaks}</p>`;
            }
            return '';
        })
        .join('')
        .trim();
};

// Convert new About format to backward compatible format
export const adaptAboutData = (about: any): IAbout => {
    if (!about || !about.data) return null;
    
    return {
        description: about.data.tavsifi ? richTextToHtml(about.data.tavsifi) : ''
    };
};

// Convert new Contacts format to backward compatible format  
export const adaptContactsData = (contacts: any): IContacts => {
    if (!contacts || !contacts.data) return null;
    
    return {
        address: contacts.data.manzili || contacts.data.manzil || '',
        email: contacts.data.email || '',
        phone: contacts.data.telefoni || contacts.data.telefon || '',
        lng: contacts.data.kenglik || '',
        ltd: contacts.data.uzunlik || ''
    };
};

// Convert new Social format to backward compatible format
export const adaptSocialData = (social: any): ISocial => {
    if (!social || !social.data) return { social: [] };
    
    const socialArray: [string, string][] = [
        ['facebook_url', social.data.facebook_havolasi],
        ['telegram_url', social.data.telegram_havolasi],
        ['instagram_url', social.data.instagram_havolasi],
        ['youtube_url', social.data.youtube_havolasi],
        ['x_url', social.data.twitter_havolasi], 
    ].filter(([_, value]) => !!value) as [string, string][];
    
    return {
        social: socialArray
    };
};

// Convert new Statistics format to backward compatible format
export const adaptStatisticsData = (statistics: any): IStatistics => {
    if (!statistics || !statistics.data) return null;
    
    return {
        authors: statistics.data.mualliflar_soni || 0,
        novels: statistics.data.kitoblar_soni || 0,
        users: statistics.data.foydalanuvchilar_soni || 0,
        readers: statistics.data.oquvchilar_soni || 0
    };
};

// Convert new Team Member format to backward compatible format
export const adaptTeamMemberData = (member: ITeamMember): ITeamMember => {
    if (!member) return null;
    
    // Ensure photo URL is absolute
    let photo = null;
    if (member.rasmi && member.rasmi.url) {
        // Process main URL
        const photoUrl = ensureAbsoluteUrl(member.rasmi.url);
        
        // Process formats URLs
        let formats = null;
        if (member.rasmi.formats) {
            formats = {};
            Object.keys(member.rasmi.formats).forEach(key => {
                const format = member.rasmi.formats[key];
                formats[key] = {
                    ...format,
                    url: ensureAbsoluteUrl(format.url)
                };
            });
        }
        
        photo = {
            ...member.rasmi,
            url: photoUrl,
            formats: formats || member.rasmi.formats
        };
    }
    
    return {
        ...member,
        rasmi: photo
    };
};

// Adapt array of team members
export const adaptTeamMembersArray = (members: ITeamMember[]): ITeamMember[] => {
    return members.map(member => adaptTeamMemberData(member));
};

// Convert blog content blocks to HTML
export const blogContentToHtml = (content: any[]): string => {
    if (!content || !Array.isArray(content)) return '';
    
    return content
        .map(block => {
            if (block.type === 'paragraph') {
                const text = block.children
                    ?.map((child: any) => {
                        let textContent = child.text || '';
                        if (child.bold) textContent = `<strong>${textContent}</strong>`;
                        if (child.italic) textContent = `<em>${textContent}</em>`;
                        if (child.underline) textContent = `<u>${textContent}</u>`;
                        if (child.code) textContent = `<code>${textContent}</code>`;
                        // Convert newlines inside inline runs
                        return textContent.replace(/\n/g, '<br/>' );
                    })
                    .join('');
                return `<p>${text}</p>`;
            } else if (block.type === 'heading') {
                const level = block.level || 2;
                const text = block.children?.map((child: any) => child.text || '').join('');
                return `<h${level}>${text}</h${level}>`;
            } else if (block.type === 'list') {
                const tag = block.format === 'ordered' ? 'ol' : 'ul';
                const items = block.children
                    ?.map((item: any) => {
                        const text = item.children?.map((child: any) => child.text || '').join('');
                        return `<li>${text}</li>`;
                    })
                    .join('');
                return `<${tag}>${items}</${tag}>`;
            } else if (block.type === 'quote') {
                const text = block.children?.map((child: any) => child.text || '').join('');
                return `<blockquote>${text}</blockquote>`;
            }
            return '';
        })
        .join('')
        .trim();
};

// Convert blog content to plain text
export const blogContentToPlainText = (content: any[]): string => {
    if (!content || !Array.isArray(content)) return '';
    
    return content
        .map(block => 
            block.children
                ?.map((child: any) => child.text || '')
                .join('')
        )
        .join('\n\n')
        .trim();
};

// Get blog image URL with base URL
export const getBlogImageUrl = (image: any): string => {
    if (!image || !image.url) return '';
    return ensureAbsoluteUrl(image.url);
};

// Adapt new Bookipedia API item to IBlogPost
export const adaptBookipediaPost = (item: any): IBlogPost => {
    if (!item) return null as any;

    const image = item.Rasmi_asosiy || item.Rasmi || null;

    const contentText: string = item.Matn || '';
    const contentBlocks: any[] = contentText
        ? [
            {
                type: 'paragraph',
                children: [
                    {
                        text: contentText,
                        type: 'text'
                    }
                ]
            }
        ]
        : [];

    const viewsRaw = item.korishlar_soni ?? item.Obunachilar ?? 0;
    const views = typeof viewsRaw === 'string' ? parseInt(viewsRaw, 10) || 0 : (viewsRaw || 0);

    // Ensure absolute URL on main image and formats
    let adaptedImage = image;
    if (adaptedImage && adaptedImage.url) {
        adaptedImage = {
            ...adaptedImage,
            url: ensureAbsoluteUrl(adaptedImage.url),
            formats: adaptedImage.formats
                ? Object.keys(adaptedImage.formats).reduce((acc: any, key: string) => {
                    const f = adaptedImage.formats[key];
                    acc[key] = {
                        ...f,
                        url: ensureAbsoluteUrl(f.url)
                    };
                    return acc;
                }, {})
                : adaptedImage.formats
        };
    }

    // Build gallery from Rams1, Rasm2, Rasm3 (array)
    const galleryItems: any[] = [];
    const imageCandidates = [item.Rams1, item.Rasm2];
    imageCandidates.forEach((img) => {
        if (img && img.url) {
            galleryItems.push(img);
        }
    });
    if (Array.isArray(item.Rasm3)) {
        item.Rasm3.forEach((img: any) => {
            if (img && img.url) galleryItems.push(img);
        });
    }

    const adapted: IBlogPost = {
        id: item.id,
        documentId: item.documentId,
        sarlavha: item.Nomi || '',
        slug: item.slug || '',
        kontent: contentBlocks,
        chop_sanasi: item.Sana || item.createdAt || '',
        korishlar_soni: views,
        youtube_havolasi: null,
        createdAt: item.createdAt || '',
        updatedAt: item.updatedAt || '',
        publishedAt: item.publishedAt || '',
        locale: item.locale || 'uz',
        rasmi: adaptedImage || null
    };

    // Attach optional fields without breaking IBlogPost typing at use sites
    (adapted as any).reyting = item.Reyting ?? null;
    (adapted as any).gallery = galleryItems.map((img: any) => ({
        id: img?.id,
        url: ensureAbsoluteUrl(img?.url)
    }));

    return adapted;
};

export const adaptBookipediaArray = (items: any[]): IBlogPost[] => {
    if (!Array.isArray(items)) return [] as IBlogPost[];
    return items.map((i) => adaptBookipediaPost(i));
};

// Extract YouTube video ID from various URL formats
export const extractYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    
    // First check if it's an iframe HTML string
    if (url.includes('<iframe') && url.includes('youtube.com/embed/')) {
        const iframeSrcMatch = url.match(/src="https:\/\/www\.youtube\.com\/embed\/([^"?]+)/);
        if (iframeSrcMatch && iframeSrcMatch[1]) {
            return iframeSrcMatch[1];
        }
    }
    
    // Handle various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/,
        /youtube\.com\/watch\?.*&v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            // Remove any additional parameters after the video ID
            return match[1].split('?')[0];
        }
    }
    
    // If URL is already just a video ID (e.g., "4L-j3HrDN4M")
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return url;
    }
    
    return null;
};

// Check if a string contains YouTube iframe HTML
export const isYouTubeIframe = (content: string): boolean => {
    return content && content.includes('<iframe') && content.includes('youtube.com/embed/');
};

// Extract iframe src URL from iframe HTML
export const extractIframeSrc = (iframeHtml: string): string | null => {
    if (!iframeHtml) return null;
    const srcMatch = iframeHtml.match(/src="([^"]+)"/);
    return srcMatch ? srcMatch[1] : null;
}; 