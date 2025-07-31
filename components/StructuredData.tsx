import React from 'react';

interface StructuredDataProps {
  type: 'website' | 'book' | 'author' | 'article' | 'organization';
  data: any;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const getStructuredData = () => {
    switch (type) {
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Gutenberg",
          "description": "O'zbekistondagi eng yirik audio kutubxona",
          "url": "https://gutenbergnu.uz",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://gutenbergnu.uz/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Gutenberg",
            "url": "https://gutenbergnu.uz"
          }
        };
      
      case 'book':
        return {
          "@context": "https://schema.org",
          "@type": "Audiobook",
          "name": data.title,
          "author": {
            "@type": "Person",
            "name": data.author
          },
          "description": data.description,
          "url": `https://gutenbergnu.uz/books/${data.slug}`,
          "image": data.image,
          "publisher": {
            "@type": "Organization",
            "name": "Gutenberg"
          },
          "inLanguage": "uz",
          "genre": data.category
        };
      
      case 'author':
        return {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": data.name,
          "description": data.bio,
          "url": `https://gutenbergnu.uz/authors/${data.slug}`,
          "image": data.image,
          "jobTitle": "Yozuvchi",
          "worksFor": {
            "@type": "Organization",
            "name": "Gutenberg"
          }
        };
      
      case 'article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "image": data.image,
          "author": {
            "@type": "Organization",
            "name": "Gutenberg"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Gutenberg",
            "logo": {
              "@type": "ImageObject",
              "url": "https://gutenbergnu.uz/logo.png"
            }
          },
          "datePublished": data.publishedAt,
          "dateModified": data.updatedAt,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://gutenbergnu.uz/blog/${data.slug}`
          }
        };
      
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Gutenberg",
          "description": "O'zbekistondagi eng yirik audio kutubxona",
          "url": "https://gutenbergnu.uz",
          "logo": "https://gutenbergnu.uz/logo.png",
          "sameAs": [
            "https://t.me/gutenbergnu",
            "https://instagram.com/gutenbergnu"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["Uzbek", "Russian", "English"]
          }
        };
      
      default:
        return {};
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData())
      }}
    />
  );
};

export default StructuredData; 