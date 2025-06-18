import {INovel, IRichTextContent} from "../models/INovel";
import {IAuthor} from "../models/IAuthors";
import {IGenre} from "../models/IGenre";
import {ICategory} from "../models/ICategory";
import {IAbout, IContacts, ISocial, IStatistics} from "../models/IAbout";

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

// Convert new Novel format to backward compatible format
export const adaptNovelData = (novel: INovel): INovel => {
    if (!novel) return null;
    
    return {
        ...novel,
        // Map new fields to old field names for backward compatibility
        name: novel.nomi || novel.name || '',
        description: novel.tavsifi ? richTextToPlainText(novel.tavsifi) : (novel.description || ''),
        age_rate: novel.yosh_chegarasi || novel.age_rate || '',
        actual: novel.dolzarb ?? novel.actual ?? false,
        new: novel.yangi ?? novel.new ?? false,
        rating: novel.reyting || novel.rating || 0,
        duration_uz: novel.audio_davomiyligi || novel.duration_uz || 0,
        duration: `${novel.audio_davomiyligi || 0}`, // Convert to string for compatibility
        author: novel.mualliflar ? adaptAuthorData(novel.mualliflar) : (novel.author || null),
        genre: novel.janrlars?.map(g => adaptGenreData(g).name || g.nomi) || novel.genre || [],
        categories: novel.kategoriyalars?.map(c => adaptCategoryData(c).name || c.nomi) || novel.categories || [],
        published_at: novel.publishedAt || novel.published_at || '',
        cover: novel.muqova ? {
            src: novel.muqova.url.startsWith('http') ? novel.muqova.url : `http://localhost:1337${novel.muqova.url}`,
            width: novel.muqova.width || 0,
            height: novel.muqova.height || 0,
            base64: ''
        } : (novel.cover || null),
        // Map audio file if available
        audio_list: novel.audio ? [{
            file: novel.audio.url.startsWith('http') ? novel.audio.url : `http://localhost:1337${novel.audio.url}`,
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
            src: author.rasmi.url.startsWith('http') ? author.rasmi.url : `http://localhost:1337${author.rasmi.url}`,
            width: author.rasmi.width || 0,
            height: author.rasmi.height || 0,
            base64: ''
        };
    } else if (author.suratilar?.[0]?.url) {
        photo = {
            src: author.suratilar[0].url.startsWith('http') ? author.suratilar[0].url : `http://localhost:1337${author.suratilar[0].url}`,
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

// Convert new Genre format to backward compatible format  
export const adaptGenreData = (genre: IGenre): IGenre => {
    if (!genre) return null;
    
    return {
        ...genre,
        name: genre.nomi || genre.name || ''
    };
};

// Convert new Category format to backward compatible format
export const adaptCategoryData = (category: ICategory): ICategory => {
    if (!category) return null;
    
    return {
        ...category,
        name: category.nomi || category.name || '',
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

// Adapt array of genres
export const adaptGenresArray = (genres: IGenre[]): IGenre[] => {
    return genres.map(genre => adaptGenreData(genre));
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
                return `<p>${content}</p>`;
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
        address: contacts.data.manzil || '',
        email: contacts.data.email || '',
        phone: contacts.data.telefon || '',
        lng: contacts.data.kenglik || '',
        ltd: contacts.data.uzunlik || ''
    };
};

// Convert new Social format to backward compatible format
export const adaptSocialData = (social: any): ISocial => {
    if (!social || !social.data) return null;
    
    return {
        facebook_url: social.data.facebook_havolasi || '',
        instagram_url: social.data.instagram_havolasi || '',
        telegram_url: social.data.telegram_havolasi || '',
        youtube_url: social.data.youtube_havolasi || ''
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