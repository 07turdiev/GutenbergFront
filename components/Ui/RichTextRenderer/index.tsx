import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ensureAbsoluteUrl } from '../../../config/api';

interface RichTextImage {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    url: string;
    formats?: {
        large?: {
            url: string;
            width: number;
            height: number;
        };
        medium?: {
            url: string;
            width: number;
            height: number;
        };
        small?: {
            url: string;
            width: number;
            height: number;
        };
        thumbnail?: {
            url: string;
            width: number;
            height: number;
        };
    };
}

interface RichTextLink {
    url: string;
    target?: string;
    rel?: string;
}

interface RichTextChild {
    text?: string;
    type?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    code?: boolean;
    link?: RichTextLink;
    image?: RichTextImage;
    children?: RichTextChild[];
}

interface RichTextBlock {
    type: string;
    level?: number;
    format?: string;
    children?: RichTextChild[];
}

interface RichTextRendererProps {
    content: RichTextBlock[];
    className?: string;
    imageClassName?: string;
    linkClassName?: string;
    headingClassName?: string;
    paragraphClassName?: string;
    listClassName?: string;
    quoteClassName?: string;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({
    content,
    className = '',
    imageClassName = '',
    linkClassName = '',
    headingClassName = '',
    paragraphClassName = '',
    listClassName = '',
    quoteClassName = ''
}) => {
    if (!content || !Array.isArray(content)) {
        return null;
    }

    const renderChild = (child: RichTextChild, index: number): React.ReactNode => {
        if (!child) return null;

        // Handle images
        if (child.type === 'image' && child.image) {
            return (
                <RichTextImage
                    key={index}
                    image={child.image}
                    className={imageClassName}
                />
            );
        }

        // Handle links
        if (child.link) {
            return (
                <RichTextLink
                    key={index}
                    link={child.link}
                    text={child.text || ''}
                    className={linkClassName}
                />
            );
        }

        // Handle text formatting
        let textContent: React.ReactNode = child.text || '';
        
        if (child.code) {
            textContent = <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{textContent}</code>;
        }
        
        if (child.bold) {
            textContent = <strong>{textContent}</strong>;
        }
        
        if (child.italic) {
            textContent = <em>{textContent}</em>;
        }
        
        if (child.underline) {
            textContent = <u>{textContent}</u>;
        }
        
        if (child.strikethrough) {
            textContent = <del>{textContent}</del>;
        }

        return textContent;
    };

    const renderBlock = (block: RichTextBlock, index: number): React.ReactNode => {
        if (!block) return null;

        switch (block.type) {
            case 'paragraph':
                const paragraphContent = block.children?.map((child, childIndex) => 
                    renderChild(child, childIndex)
                );
                return (
                    <p key={index} className={`mb-4 ${paragraphClassName}`}>
                        {paragraphContent}
                    </p>
                );

            case 'heading':
                const level = block.level || 2;
                const headingContent = block.children?.map((child, childIndex) => 
                    renderChild(child, childIndex)
                );
                const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
                return (
                    <HeadingTag key={index} className={`font-bold mb-4 mt-6 ${headingClassName}`}>
                        {headingContent}
                    </HeadingTag>
                );

            case 'list':
                const tag = block.format === 'ordered' ? 'ol' : 'ul';
                const listItems = block.children?.map((item, itemIndex) => {
                    const itemContent = (item as any).children?.map((child: RichTextChild, childIndex: number) => 
                        renderChild(child, childIndex)
                    );
                    return (
                        <li key={itemIndex} className="mb-2">
                            {itemContent}
                        </li>
                    );
                });
                const ListTag = tag as keyof JSX.IntrinsicElements;
                return (
                    <ListTag key={index} className={`mb-4 ml-6 ${listClassName}`}>
                        {listItems}
                    </ListTag>
                );

            case 'quote':
                const quoteContent = block.children?.map((child, childIndex) => 
                    renderChild(child, childIndex)
                );
                return (
                    <blockquote key={index} className={`border-l-4 border-gray-300 pl-4 italic mb-4 ${quoteClassName}`}>
                        {quoteContent}
                    </blockquote>
                );

            case 'code':
                const codeContent = block.children?.map((child, childIndex) => 
                    child.text || ''
                ).join('');
                return (
                    <pre key={index} className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                        <code>{codeContent}</code>
                    </pre>
                );

            default:
                // Fallback for unknown block types
                const defaultContent = block.children?.map((child, childIndex) => 
                    renderChild(child, childIndex)
                );
                return (
                    <div key={index} className="mb-4">
                        {defaultContent}
                    </div>
                );
        }
    };

    return (
        <div className={`rich-text-content ${className}`}>
            {content.map((block, index) => renderBlock(block, index))}
        </div>
    );
};

// Image component for rich text
const RichTextImage: React.FC<{
    image: RichTextImage;
    className?: string;
}> = ({ image, className = '' }) => {
    const imageUrl = ensureAbsoluteUrl(image.url);
    const altText = image.alternativeText || image.name || 'Image';
    
    // Use responsive image with Next.js Image component
    return (
        <div className={`my-6 ${className}`}>
            <div className="flex justify-center">
                <div className="w-full max-w-[640px]">
                    <Image
                        src={imageUrl}
                        alt={altText}
                        width={image.width || 800}
                        height={image.height || 600}
                        className="w-full h-auto rounded-lg"
                        style={{ objectFit: 'contain' }}
                        priority={false}
                    />
                </div>
            </div>
            {image.caption && (
                <p className="text-sm text-gray-600 mt-2 text-center italic">
                    {image.caption}
                </p>
            )}
        </div>
    );
};

// Link component for rich text
const RichTextLink: React.FC<{
    link: RichTextLink;
    text: string;
    className?: string;
}> = ({ link, text, className = '' }) => {
    const href = link.url;
    const isExternal = href.startsWith('http') || href.startsWith('https');
    const isInternal = href.startsWith('/') || href.startsWith('#');
    
    const linkProps = {
        className: `text-primary hover:text-accent transition-colors underline ${className}`,
        target: link.target || (isExternal ? '_blank' : undefined),
        rel: link.rel || (isExternal ? 'noopener noreferrer' : undefined)
    };

    if (isInternal) {
        return (
            <Link href={href}>
                <a {...linkProps}>
                    {text}
                </a>
            </Link>
        );
    }

    return (
        <a href={href} {...linkProps}>
            {text}
        </a>
    );
};

export default RichTextRenderer;
