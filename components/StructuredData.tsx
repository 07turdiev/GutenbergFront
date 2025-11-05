import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface StructuredDataProps {
  type: 'Website' | 'Organization' | 'Article' | 'Book' | 'Author' | 'BlogPosting';
  data?: any;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const router = useRouter();
  const baseUrl = 'https://gutenbergnu.uz';
  const currentUrl = `${baseUrl}${router.asPath}`;

  const getWebsiteData = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Gutenberg kutubxona",
    "description": "O'zbekistondagi eng yirik nashriyot uyi. Audio kitoblar, romanlar va hikoyalar bepul tinglash imkoniyati.",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": ["uz", "ru", "en"],
    "publisher": {
      "@type": "Organization",
      "name": "Gutenberg Nashriyot Uyi",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/favicon.png`
      }
    }
  });

  const getOrganizationData = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Gutenberg Nashriyot Uyi",
    "url": baseUrl,
    "logo": `${baseUrl}/favicon.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Uzbek", "Russian", "English"]
    },
    "sameAs": [
      "https://www.facebook.com/gutenbergnu",
      "https://www.instagram.com/gutenbergnu",
      "https://t.me/gutenbergnu"
    ]
  });

  const getData = () => {
    switch (type) {
      case 'Website':
        return getWebsiteData();
      case 'Organization':
        return getOrganizationData();
      case 'Article':
      case 'BlogPosting':
        return data;
      case 'Book':
        return data;
      case 'Author':
        return data;
      default:
        return getWebsiteData();
    }
  };

  const structuredData = getData();

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
};

export default StructuredData;
