import Head from 'next/head'
import React, { ReactNode } from "react";
import { useRouter } from "next/router";


interface Props {
	title: string | any;
	description: string | any;
	ogImg: string | any;
	children?: ReactNode;
}
const sitePath = 'https://ak.technocorp.uz/';

function HeadMeta({ title, description, ogImg, children }: Props) {

	const { asPath, locale } = useRouter();
	
	return (
		<Head>
			<title>{title}</title>
			<meta name="title" content={title} />
			<meta name="description" content={description} />
			<meta property="og:type" content="website" />
			            <meta property="og:site_name" content='GutenberNU' />
			<meta property="og:url" content={`${sitePath}${locale}${asPath}`} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={ogImg} key="ogimage" />
			<meta property="og:image:width" content="900" />
			<meta property="og:image:height" content="470" />

			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:url" content={`${sitePath}${locale}${asPath}`} />
			<meta property="twitter:title" content={title} />
			<meta property="twitter:description" content={description} />
			<meta property="twitter:image" content={ogImg} />

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
