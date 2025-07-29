import Head from 'next/head'
import React, { ReactNode } from "react";
import { useRouter } from "next/router";


interface Props {
	title: string | any;
	description: string | any;
	ogImg: string | any;
	themeColor?: string;
	keywords?: string;
	canonical?: string;
	children?: ReactNode;
}
const sitePath = 'https://gutenbergnu.uz/';

function HeadMeta({ title, description, ogImg, themeColor, keywords, canonical, children }: Props) {

	const { asPath, locale } = useRouter();
	const fullUrl = `${sitePath}${locale}${asPath}`;
	
	return (
		<Head>
			<title>{title}</title>
			<meta name="title" content={title} />
			<meta name="description" content={description} />
			{keywords && <meta name="keywords" content={keywords} />}
			
			{/* Canonical URL */}
			<link rel="canonical" href={canonical || fullUrl} />
			
			{/* Language alternates */}
			<link rel="alternate" hrefLang="uz" href={`${sitePath}uz${asPath}`} />
			<link rel="alternate" hrefLang="ru" href={`${sitePath}ru${asPath}`} />
			<link rel="alternate" hrefLang="en" href={`${sitePath}en${asPath}`} />
			<link rel="alternate" hrefLang="x-default" href={`${sitePath}uz${asPath}`} />
			
			{/* Dynamic theme color - overrides the default one in _document.tsx */}
			{themeColor && <meta name="theme-color" content={themeColor} />}
			
			{/* Open Graph */}
			<meta property="og:type" content="website" />
			<meta property="og:site_name" content='GutenberNU' />
			<meta property="og:url" content={fullUrl} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={ogImg} key="ogimage" />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:locale" content={locale} />

			{/* Twitter Card */}
			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:url" content={fullUrl} />
			<meta property="twitter:title" content={title} />
			<meta property="twitter:description" content={description} />
			<meta property="twitter:image" content={ogImg} />
			<meta property="twitter:site" content="@gutenbergnu" />

			{/* Additional SEO meta tags */}
			<meta name="robots" content="index, follow" />
			<meta name="author" content="GutenberNU" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			
			{/* Structured Data */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "WebSite",
						"name": "GutenberNU",
						"description": description,
						"url": sitePath,
						"potentialAction": {
							"@type": "SearchAction",
							"target": `${sitePath}search?q={search_term_string}`,
							"query-input": "required name=search_term_string"
						}
					})
				}}
			/>

			{children}
		</Head>
	)
}

HeadMeta.defaultProps = {
	title: 'GutenberNU',
	description: 'GutenberNU — это современная аудио-библиотека в интернете, которая открывает вам доступ к каталогу бестселлеров и классической литературы, включая новинки разных аудио жанров',
	ogImg: `${sitePath}og-default-img.jpg`
}

export default HeadMeta
