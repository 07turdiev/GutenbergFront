import {INovel, IRichTextContent} from "../models/INovel";
import {ICategory} from "../models/ICategory";
import {IAuthor} from "../models/IAuthors";
import {IAbout, IContacts, ISocial, IStatistics} from "../models/IAbout";
import {ITeamMember} from "../models/ITeam";
import {IBlogPost} from "../models/IBlog";
import {ITermsData, ITermsResponse} from "../models/ITerms";
import {IPrivacyData, IPrivacyResponse} from "../models/IPrivacy";
import {IDocument, IDocumentsResponse} from "../models/IDocuments";
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
        slug: novel.slug || novel.slug, // ensure slug is preserved
        description: Array.isArray((novel as any).tavsifi)
            ? richTextToPlainText((novel as any).tavsifi as any)
            : (typeof (novel as any).tavsifi === 'string'
                ? parseBookipediaMarkdownToBlocks((novel as any).tavsifi)
                    .map((b: any) => (b.children || []).map((c: any) => c.text || '').join(''))
                    .join('\n\n')
                : (novel.description || '')),
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

// Parse Bookipedia markdown-like plain text to rich text blocks
// Supports: images (![alt](url)), links ([text](url)), bold (**text**), italic (_text_), underline (<u>text</u> or escaped \u003C tags), line breaks
export const parseBookipediaMarkdownToBlocks = (input: string): any[] => {
    if (!input || typeof input !== 'string') return [];

    // Unescape escaped HTML entities like \u003C and \u003E to real < and >
    const unescaped = input.replace(/\\u003C/g, '<').replace(/\\u003E/g, '>');

    // First extract fenced code blocks ```...```
    const codeFenceRegex = /```[\s\S]*?```/g;
    const preCodeSegments: Array<{ type: 'text' | 'code'; value: string }> = [];
    let cfLast = 0; let cfMatch: RegExpExecArray | null;
    while ((cfMatch = codeFenceRegex.exec(unescaped)) !== null) {
        if (cfMatch.index > cfLast) {
            preCodeSegments.push({ type: 'text', value: unescaped.slice(cfLast, cfMatch.index) });
        }
        const fenced = cfMatch[0].replace(/^```\n?/, '').replace(/```$/, '');
        preCodeSegments.push({ type: 'code', value: fenced });
        cfLast = codeFenceRegex.lastIndex;
    }
    if (cfLast < unescaped.length) {
        preCodeSegments.push({ type: 'text', value: unescaped.slice(cfLast) });
    }

    // Then within text segments, split around images so images can become standalone blocks
    const segments: Array<{ type: 'text' | 'image' | 'code'; value: string; alt?: string; url?: string }> = [];
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    for (const seg of preCodeSegments) {
        if (seg.type === 'code') {
            segments.push(seg);
            continue;
        }
        let lastIndex = 0; let match: RegExpExecArray | null; const chunk = seg.value;
        while ((match = imageRegex.exec(chunk)) !== null) {
            if (match.index > lastIndex) {
                segments.push({ type: 'text', value: chunk.slice(lastIndex, match.index) });
            }
            segments.push({ type: 'image', value: '', alt: match[1] || '', url: match[2] });
            lastIndex = imageRegex.lastIndex;
        }
        if (lastIndex < chunk.length) {
            segments.push({ type: 'text', value: chunk.slice(lastIndex) });
        }
    }

    // Helper to parse inline formatting into children array
        const parseInline = (text: string): any[] => {
        const children: any[] = [];
        if (!text) return children;

        // Normalize Windows newlines
        let t = text.replace(/\r\n/g, '\n');

        // Process underline HTML tags into markers
        // Replace <u>...</u> with special tokens to avoid conflict during bold/italic parsing
        const underlineOpen = '__UNDERLINE_OPEN__';
        const underlineClose = '__UNDERLINE_CLOSE__';
        t = t.replace(/<u>/gi, underlineOpen).replace(/<\/u>/gi, underlineClose);

        // Tokenize by underline markers first
        const partsByUnderline = t.split(new RegExp(`(${underlineOpen}|${underlineClose})`, 'g'));
        let underlineActive = false;
        for (const part of partsByUnderline) {
            if (part === underlineOpen) { underlineActive = true; continue; }
            if (part === underlineClose) { underlineActive = false; continue; }
            if (!part) continue;

            // Within current underline state, further split by bold (**...**)
            const boldRegex = /\*\*([^*]+)\*\*/g;
            let cursor = 0;
            let m: RegExpExecArray | null;
            const pushText = (s: string, opts?: { bold?: boolean; italic?: boolean; underline?: boolean }) => {
                if (!s) return;
                
                // First handle links [text](url)
                const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                let lcursor = 0;
                let lm: RegExpExecArray | null;
                while ((lm = linkRegex.exec(s)) !== null) {
                    const beforeLink = s.slice(lcursor, lm.index);
                    if (beforeLink) {
                        // Process italic in the text before link
                        const italicRegex = /_([^_]+)_/g;
                        let icursor = 0; let im: RegExpExecArray | null;
                        while ((im = italicRegex.exec(beforeLink)) !== null) {
                            const beforeItalic = beforeLink.slice(icursor, im.index);
                            if (beforeItalic) {
                                const node: any = { text: beforeItalic, type: 'text' };
                                if (opts?.underline) node.underline = true;
                                if (opts?.bold) node.bold = true;
                                children.push(node);
                            }
                            const ital = im[1];
                            const node: any = { text: ital, type: 'text', italic: true };
                            if (opts?.underline) node.underline = true;
                            if (opts?.bold) node.bold = true;
                            children.push(node);
                            icursor = italicRegex.lastIndex;
                        }
                        const afterItalic = beforeLink.slice(icursor);
                        if (afterItalic) {
                            const node: any = { text: afterItalic, type: 'text' };
                            if (opts?.underline) node.underline = true;
                            if (opts?.bold) node.bold = true;
                            children.push(node);
                        }
                    }
                    
                    // Add the link
                    const linkText = lm[1];
                    const linkUrl = lm[2];
                    const linkNode: any = { 
                        text: linkText, 
                        type: 'text',
                        link: { url: linkUrl }
                    };
                    if (opts?.underline) linkNode.underline = true;
                    if (opts?.bold) linkNode.bold = true;
                    children.push(linkNode);
                    lcursor = linkRegex.lastIndex;
                }
                
                // Process remaining text after links
                const remaining = s.slice(lcursor);
                if (remaining) {
                    const italicRegex = /_([^_]+)_/g;
                    let icursor = 0; let im: RegExpExecArray | null;
                    while ((im = italicRegex.exec(remaining)) !== null) {
                        const before = remaining.slice(icursor, im.index);
                        if (before) {
                            const node: any = { text: before, type: 'text' };
                            if (opts?.underline) node.underline = true;
                            if (opts?.bold) node.bold = true;
                            children.push(node);
                        }
                        const ital = im[1];
                        const node: any = { text: ital, type: 'text', italic: true };
                        if (opts?.underline) node.underline = true;
                        if (opts?.bold) node.bold = true;
                        children.push(node);
                        icursor = italicRegex.lastIndex;
                    }
                    const after = remaining.slice(icursor);
                    if (after) {
                        const node: any = { text: after, type: 'text' };
                        if (opts?.underline) node.underline = true;
                        if (opts?.bold) node.bold = true;
                        children.push(node);
                    }
                }
            };
            while ((m = boldRegex.exec(part)) !== null) {
                const before = part.slice(cursor, m.index);
                pushText(before, { underline: underlineActive });
                const boldText = m[1];
                pushText(boldText, { underline: underlineActive, bold: true });
                cursor = boldRegex.lastIndex;
            }
            const rest = part.slice(cursor);
            pushText(rest, { underline: underlineActive });
        }

        // Replace single newlines with literal newlines in text nodes; renderer turns them into <br/>
        // Ensure no undefined properties in children
        return children.map(c => {
            if (!c) return c;
            const cleaned: any = { text: c.text, type: c.type };
            if (c.bold === true) cleaned.bold = true;
            if (c.italic === true) cleaned.italic = true;
            if (c.underline === true) cleaned.underline = true;
            if (c.strikethrough === true) cleaned.strikethrough = true;
            if (c.code === true) cleaned.code = true;
            if (c.link) cleaned.link = c.link;
            return cleaned;
        });
    };

    // Build blocks from segments; split text segments into paragraphs by double newlines
    const blocks: any[] = [];
    for (const seg of segments) {
        if (seg.type === 'image' && seg.url) {
            blocks.push({
                type: 'image',
                image: {
                    id: 0,
                    documentId: '',
                    name: seg.alt || 'image',
                    alternativeText: seg.alt || null,
                    caption: null,
                    width: 0,
                    height: 0,
                    url: ensureAbsoluteUrl(seg.url)
                }
            });
        } else if (seg.type === 'code') {
            // Preserve fenced code as its own block
            blocks.push({
                type: 'code',
                children: [ { text: seg.value, type: 'text' } ]
            });
        } else if (seg.type === 'text' && seg.value) {
            const paragraphs = seg.value.split(/\n\n+/);
            paragraphs.forEach(p => {
                const trimmed = p.trim();
                if (!trimmed) return;
                blocks.push({
                    type: 'paragraph',
                    children: parseInline(trimmed)
                });
            });
        }
    }

    return blocks;
};

// Convert Strapi rich text to HTML (enhanced version with images and links)
export const richTextToHtml = (richText: any[]): string => {
    if (!richText || !Array.isArray(richText)) return '';
    
    return richText
        .map(block => {
            if (block.type === 'paragraph') {
                const content = block.children
                    ?.map((child: any) => {
                        let text = child.text || '';
                        
                        // Handle links
                        if (child.link) {
                            const href = child.link.url;
                            const target = child.link.target || (href.startsWith('http') ? '_blank' : '');
                            const rel = child.link.rel || (href.startsWith('http') ? 'noopener noreferrer' : '');
                            text = `<a href="${href}" target="${target}" rel="${rel}" class="text-primary hover:text-accent underline">${text}</a>`;
                        }
                        
                        // Handle images
                        if (child.type === 'image' && child.image) {
                            const imageUrl = ensureAbsoluteUrl(child.image.url);
                            const altText = child.image.alternativeText || child.image.name || 'Image';
                            const caption = child.image.caption ? `<p class="text-sm text-gray-600 mt-2 text-center italic">${child.image.caption}</p>` : '';
                            text = `<div class="my-6"><div class=\"flex justify-center\"><div class=\"w-full max-w-[640px]\"><img src=\"${imageUrl}\" alt=\"${altText}\" class=\"w-full h-auto rounded-lg\" style=\"object-fit: contain;\" /></div></div>${caption}</div>`;
                        }
                        
                        // Handle text formatting
                        if (child.bold) text = `<strong>${text}</strong>`;
                        if (child.italic) text = `<em>${text}</em>`;
                        if (child.underline) text = `<u>${text}</u>`;
                        if (child.code) text = `<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">${text}</code>`;
                        if (child.strikethrough) text = `<del>${text}</del>`;
                        
                        return text;
                    })
                    .join('');
                // Convert newline characters to HTML line breaks
                const contentWithBreaks = content.replace(/\n/g, '<br/>' );
                return `<p class="mb-4">${contentWithBreaks}</p>`;
            } else if (block.type === 'heading') {
                const level = block.level || 2;
                const text = block.children?.map((child: any) => {
                    let textContent = child.text || '';
                    if (child.link) {
                        const href = child.link.url;
                        const target = child.link.target || (href.startsWith('http') ? '_blank' : '');
                        const rel = child.link.rel || (href.startsWith('http') ? 'noopener noreferrer' : '');
                        textContent = `<a href="${href}" target="${target}" rel="${rel}" class="text-primary hover:text-accent underline">${textContent}</a>`;
                    }
                    return textContent;
                }).join('');
                return `<h${level} class="font-bold mb-4 mt-6">${text}</h${level}>`;
            } else if (block.type === 'list') {
                const tag = block.format === 'ordered' ? 'ol' : 'ul';
                const items = block.children
                    ?.map((item: any) => {
                        const text = item.children?.map((child: any) => {
                            let textContent = child.text || '';
                            if (child.link) {
                                const href = child.link.url;
                                const target = child.link.target || (href.startsWith('http') ? '_blank' : '');
                                const rel = child.link.rel || (href.startsWith('http') ? 'noopener noreferrer' : '');
                                textContent = `<a href="${href}" target="${target}" rel="${rel}" class="text-primary hover:text-accent underline">${textContent}</a>`;
                            }
                            return textContent;
                        }).join('');
                        return `<li class="mb-2">${text}</li>`;
                    })
                    .join('');
                return `<${tag} class="mb-4 ml-6">${items}</${tag}>`;
            } else if (block.type === 'quote') {
                const text = block.children?.map((child: any) => {
                    let textContent = child.text || '';
                    if (child.link) {
                        const href = child.link.url;
                        const target = child.link.target || (href.startsWith('http') ? '_blank' : '');
                        const rel = child.link.rel || (href.startsWith('http') ? 'noopener noreferrer' : '');
                        textContent = `<a href="${href}" target="${target}" rel="${rel}" class="text-primary hover:text-accent underline">${textContent}</a>`;
                    }
                    return textContent;
                }).join('');
                return `<blockquote class="border-l-4 border-gray-300 pl-4 italic mb-4">${text}</blockquote>`;
            } else if (block.type === 'code') {
                const text = block.children?.map((child: any) => child.text || '').join('');
                return `<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code>${text}</code></pre>`;
            } else if (block.type === 'image') {
                // Handle standalone image blocks
                const image = block.image || block;
                if (image && image.url) {
                    const imageUrl = ensureAbsoluteUrl(image.url);
                    const altText = image.alternativeText || image.name || 'Image';
                    const caption = image.caption ? `<p class="text-sm text-gray-600 mt-2 text-center italic">${image.caption}</p>` : '';
                    return `<div class="my-6"><img src="${imageUrl}" alt="${altText}" class="w-full h-auto rounded-lg" style="object-fit: contain;" />${caption}</div>`;
                }
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
        ['telegram_channel_url', social.data.Telegram_kanal],
        ['instagram_url', social.data.instagram_havolasi],
        ['youtube_url', social.data.youtube_havolasi],
        ['twitter_url', social.data.twitter_havolasi],
        ['whatsapp_url', social.data.Whatsapp_havolasi],
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

// Convert blog content blocks to HTML (enhanced version with images and links)
export const blogContentToHtml = (content: any[]): string => {
    if (!content || !Array.isArray(content)) return '';
    
    return content
        .map(block => {
            if (block.type === 'paragraph') {
                const text = block.children
                    ?.map((child: any) => {
                        let textContent = child.text || '';
                        
                        // Handle links
                        if (child.link) {
                            const href = child.link.url;
                            const target = child.link.target || (href.startsWith('http') ? '_blank' : '');
                            const rel = child.link.rel || (href.startsWith('http') ? 'noopener noreferrer' : '');
                            textContent = `<a href="${href}" target="${target}" rel="${rel}" class="text-primary hover:text-accent underline">${textContent}</a>`;
                        }
                        
                        // Handle images
                        if (child.type === 'image' && child.image) {
                            const imageUrl = ensureAbsoluteUrl(child.image.url);
                            const altText = child.image.alternativeText || child.image.name || 'Image';
                            const caption = child.image.caption ? `<p class="text-sm text-gray-600 mt-2 text-center italic">${child.image.caption}</p>` : '';
                            textContent = `<div class="my-6"><img src="${imageUrl}" alt="${altText}" class="w-full h-auto rounded-lg" style="object-fit: contain;" />${caption}</div>`;
                        }
                        
                        // Handle text formatting
                        if (child.bold) textContent = `<strong>${textContent}</strong>`;
                        if (child.italic) textContent = `<em>${textContent}</em>`;
                        if (child.underline) textContent = `<u>${textContent}</u>`;
                        if (child.code) textContent = `<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">${textContent}</code>`;
                        if (child.strikethrough) textContent = `<del>${textContent}</del>`;
                        
                        // Convert newlines inside inline runs
                        return textContent.replace(/\n/g, '<br/>' );
                    })
                    .join('');
                return `<p class="mb-4">${text}</p>`;
            } else if (block.type === 'heading') {
                const level = (block as any).level || 2;
                const text = block.children?.map((child: any) => {
                    let textContent = child.text || '';
                    if (child.link) {
                        const href = child.link.url;
                        const target = child.link.target || (href.startsWith('http') ? '_blank' : '');
                        const rel = child.link.rel || (href.startsWith('http') ? 'noopener noreferrer' : '');
                        textContent = `<a href="${href}" target="${target}" rel="${rel}" class="text-primary hover:text-accent underline">${textContent}</a>`;
                    }
                    return textContent;
                }).join('');
                return `<h${level} class="font-bold mb-4 mt-6">${text}</h${level}>`;
            } else if (block.type === 'list') {
                const tag = (block as any).format === 'ordered' ? 'ol' : 'ul';
                const items = block.children
                    ?.map((item: any) => {
                        const text = item.children?.map((child: any) => {
                            let textContent = child.text || '';
                            if (child.link) {
                                const href = child.link.url;
                                const target = child.link.target || (href.startsWith('http') ? '_blank' : '');
                                const rel = child.link.rel || (href.startsWith('http') ? 'noopener noreferrer' : '');
                                textContent = `<a href="${href}" target="${target}" rel="${rel}" class="text-primary hover:text-accent underline">${textContent}</a>`;
                            }
                            return textContent;
                        }).join('');
                        return `<li class="mb-2">${text}</li>`;
                    })
                    .join('');
                return `<${tag} class="mb-4 ml-6">${items}</${tag}>`;
            } else if (block.type === 'quote') {
                const text = block.children?.map((child: any) => {
                    let textContent = child.text || '';
                    if (child.link) {
                        const href = child.link.url;
                        const target = child.link.target || (href.startsWith('http') ? '_blank' : '');
                        const rel = child.link.rel || (href.startsWith('http') ? 'noopener noreferrer' : '');
                        textContent = `<a href="${href}" target="${target}" rel="${rel}" class="text-primary hover:text-accent underline">${textContent}</a>`;
                    }
                    return textContent;
                }).join('');
                return `<blockquote class="border-l-4 border-gray-300 pl-4 italic mb-4">${text}</blockquote>`;
            } else if (block.type === 'code') {
                const text = block.children?.map((child: any) => child.text || '').join('');
                return `<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code>${text}</code></pre>`;
            } else if (block.type === 'image') {
                // Handle standalone image blocks
                const image = (block as any).image || block;
                if (image && image.url) {
                    const imageUrl = ensureAbsoluteUrl(image.url);
                    const altText = image.alternativeText || image.name || 'Image';
                    const caption = image.caption ? `<p class="text-sm text-gray-600 mt-2 text-center italic">${image.caption}</p>` : '';
                    return `<div class="my-6"><div class=\"flex justify-center\"><div class=\"w-full max-w-[640px]\"><img src=\"${imageUrl}\" alt=\"${altText}\" class=\"w-full h-auto rounded-lg\" style=\"object-fit: contain;\" /></div></div>${caption}</div>`;
                }
            }
            return '';
        })
        .join('')
        .trim();
};

// Convert Strapi rich text content to RichTextRenderer format
export const convertToRichTextRendererFormat = (content: any[]): any[] => {
    if (!content || !Array.isArray(content)) return [];
    
    return content.map(block => {
        // Handle different block types
        if (block.type === 'paragraph' || block.type === 'heading' || block.type === 'list' || block.type === 'quote' || block.type === 'code') {
            return {
                type: block.type,
                level: block.level,
                format: block.format,
                children: block.children?.map((child: any) => {
                    // Handle image children
                    if (child.type === 'image' && child.image) {
                        return {
                            type: 'image',
                            image: {
                                id: child.image.id,
                                documentId: child.image.documentId,
                                name: child.image.name,
                                alternativeText: child.image.alternativeText,
                                caption: child.image.caption,
                                width: child.image.width,
                                height: child.image.height,
                                url: ensureAbsoluteUrl(child.image.url),
                                formats: child.image.formats ? Object.keys(child.image.formats).reduce((acc: any, key: string) => {
                                    const format = child.image.formats[key];
                                    acc[key] = {
                                        url: ensureAbsoluteUrl(format.url),
                                        width: format.width,
                                        height: format.height
                                    };
                                    return acc;
                                }, {}) : undefined
                            }
                        };
                    }
                    
                    // Handle link children
                    if (child.link) {
                        return {
                            text: child.text,
                            type: child.type,
                            bold: child.bold,
                            italic: child.italic,
                            underline: child.underline,
                            strikethrough: child.strikethrough,
                            code: child.code,
                            link: {
                                url: child.link.url,
                                target: child.link.target,
                                rel: child.link.rel
                            }
                        };
                    }
                    
                    // Handle regular text children
                    return {
                        text: child.text,
                        type: child.type,
                        bold: child.bold,
                        italic: child.italic,
                        underline: child.underline,
                        strikethrough: child.strikethrough,
                        code: child.code
                    };
                })
            };
        }
        
        // Handle standalone image blocks
        if (block.type === 'image') {
            return {
                type: 'image',
                children: [{
                    type: 'image',
                    image: {
                        id: block.id || block.image?.id,
                        documentId: block.documentId || block.image?.documentId,
                        name: block.name || block.image?.name,
                        alternativeText: block.alternativeText || block.image?.alternativeText,
                        caption: block.caption || block.image?.caption,
                        width: block.width || block.image?.width,
                        height: block.height || block.image?.height,
                        url: ensureAbsoluteUrl(block.url || block.image?.url),
                        formats: (block.formats || block.image?.formats) ? Object.keys(block.formats || block.image?.formats).reduce((acc: any, key: string) => {
                            const format = (block.formats || block.image?.formats)[key];
                            acc[key] = {
                                url: ensureAbsoluteUrl(format.url),
                                width: format.width,
                                height: format.height
                            };
                            return acc;
                        }, {}) : undefined
                    }
                }]
            };
        }
        
        // Return block as-is for unknown types
        return block;
    });
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
    const contentBlocks: any[] = contentText ? parseBookipediaMarkdownToBlocks(contentText) : [];

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

// Convert terms rich text to HTML
export const termsTextToHtml = (text: any[]): string => {
    if (!text || !Array.isArray(text)) return '';
    
    return text
        .map(block => {
            if (block.type === 'paragraph') {
                const content = block.children
                    ?.map((child: any) => {
                        let textContent = child.text || '';
                        if (child.bold) textContent = `<strong>${textContent}</strong>`;
                        if (child.italic) textContent = `<em>${textContent}</em>`;
                        if (child.underline) textContent = `<u>${textContent}</u>`;
                        return textContent;
                    })
                    .join('');
                return content ? `<p>${content}</p>` : '';
            }
            return '';
        })
        .join('')
        .trim();
};

// Convert new Terms format to backward compatible format
export const adaptTermsData = (terms: ITermsResponse): ITermsData => {
    if (!terms || !terms.data) return null;
    
    return {
        ...terms.data,
        // Ensure Brendbook URL is absolute, or set to null if undefined
        Brendbook: terms.data.Brendbook ? {
            ...terms.data.Brendbook,
            url: ensureAbsoluteUrl(terms.data.Brendbook.url)
        } : null
    };
};

// Convert new Privacy format to backward compatible format
export const adaptPrivacyData = (privacy: IPrivacyResponse): IPrivacyData => {
    if (!privacy || !privacy.data) return null;
    
    return {
        ...privacy.data
    };
};

// Convert new Documents format to backward compatible format
export const adaptDocumentsData = (documents: IDocumentsResponse): IDocument[] => {
    if (!documents || !documents.data) return [];
    
    return documents.data.map(document => ({
        ...document,
        // Ensure image URLs are absolute
        Rasmi: document.Rasmi ? {
            ...document.Rasmi,
            url: ensureAbsoluteUrl(document.Rasmi.url),
            formats: document.Rasmi.formats ? {
                thumbnail: document.Rasmi.formats.thumbnail ? {
                    ...document.Rasmi.formats.thumbnail,
                    url: ensureAbsoluteUrl(document.Rasmi.formats.thumbnail.url)
                } : null,
                small: document.Rasmi.formats.small ? {
                    ...document.Rasmi.formats.small,
                    url: ensureAbsoluteUrl(document.Rasmi.formats.small.url)
                } : null,
                medium: document.Rasmi.formats.medium ? {
                    ...document.Rasmi.formats.medium,
                    url: ensureAbsoluteUrl(document.Rasmi.formats.medium.url)
                } : null,
                large: document.Rasmi.formats.large ? {
                    ...document.Rasmi.formats.large,
                    url: ensureAbsoluteUrl(document.Rasmi.formats.large.url)
                } : null,
            } : null
        } : null
    }));
}; 