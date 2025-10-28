import React from 'react';
import RichTextRenderer from '../Ui/RichTextRenderer';
import { convertToRichTextRendererFormat } from '../../utils/strapiAdapter';

interface StrapiRichTextProps {
    content: any[];
    className?: string;
    imageClassName?: string;
    linkClassName?: string;
    headingClassName?: string;
    paragraphClassName?: string;
    listClassName?: string;
    quoteClassName?: string;
    variant?: 'default' | 'compact' | 'detailed';
}

/**
 * StrapiRichText - A wrapper component for rendering Strapi rich text content
 * 
 * This component provides a consistent way to render rich text content from Strapi
 * across your entire application. It handles images, links, and other rich text elements.
 * 
 * @param content - The rich text content array from Strapi
 * @param className - Additional CSS classes for the container
 * @param imageClassName - CSS classes for images
 * @param linkClassName - CSS classes for links
 * @param headingClassName - CSS classes for headings
 * @param paragraphClassName - CSS classes for paragraphs
 * @param listClassName - CSS classes for lists
 * @param quoteClassName - CSS classes for quotes
 * @param variant - Predefined styling variants
 * 
 * Usage examples:
 * 
 * // Basic usage
 * <StrapiRichText content={post.kontent} />
 * 
 * // With custom styling
 * <StrapiRichText 
 *   content={post.kontent}
 *   className="prose prose-lg"
 *   imageClassName="my-8 rounded-xl"
 *   linkClassName="text-blue-600 hover:text-blue-800"
 * />
 * 
 * // Using predefined variants
 * <StrapiRichText 
 *   content={post.kontent}
 *   variant="detailed"
 * />
 */
const StrapiRichText: React.FC<StrapiRichTextProps> = ({
    content,
    className = '',
    imageClassName = '',
    linkClassName = '',
    headingClassName = '',
    paragraphClassName = '',
    listClassName = '',
    quoteClassName = '',
    variant = 'default'
}) => {
    // Predefined styling variants
    const variants = {
        default: {
            className: 'prose prose-base max-w-none',
            imageClassName: 'my-6',
            linkClassName: 'text-primary hover:text-accent underline',
            headingClassName: 'font-bold mb-4 mt-6',
            paragraphClassName: 'mb-4',
            listClassName: 'mb-4 ml-6',
            quoteClassName: 'border-l-4 border-gray-300 pl-4 italic mb-4'
        },
        compact: {
            className: 'prose prose-sm max-w-none',
            imageClassName: 'my-4',
            linkClassName: 'text-primary hover:text-accent underline',
            headingClassName: 'font-semibold mb-2 mt-4',
            paragraphClassName: 'mb-2',
            listClassName: 'mb-2 ml-4',
            quoteClassName: 'border-l-2 border-gray-300 pl-3 italic mb-2'
        },
        detailed: {
            className: 'prose prose-lg max-w-none',
            imageClassName: 'my-8',
            linkClassName: 'text-primary hover:text-accent underline',
            headingClassName: 'font-bold mb-6 mt-8',
            paragraphClassName: 'mb-6',
            listClassName: 'mb-6 ml-8',
            quoteClassName: 'border-l-4 border-gray-300 pl-6 italic mb-6'
        }
    };

    // Use variant styles if no custom classes provided
    const styles = variant !== 'default' ? variants[variant] : {};

    return (
        <RichTextRenderer
            content={convertToRichTextRendererFormat(content)}
            className={`${styles.className || ''} ${className}`.trim()}
            imageClassName={`${styles.imageClassName || ''} ${imageClassName}`.trim()}
            linkClassName={`${styles.linkClassName || ''} ${linkClassName}`.trim()}
            headingClassName={`${styles.headingClassName || ''} ${headingClassName}`.trim()}
            paragraphClassName={`${styles.paragraphClassName || ''} ${paragraphClassName}`.trim()}
            listClassName={`${styles.listClassName || ''} ${listClassName}`.trim()}
            quoteClassName={`${styles.quoteClassName || ''} ${quoteClassName}`.trim()}
        />
    );
};

export default StrapiRichText;
