import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Mobile Browser Address Bar Theming */}
          <meta name="theme-color" content="#cd1b17" />
          <meta name="msapplication-TileColor" content="#cd1b17" />
          
          {/* iOS Safari Specific */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Gutenberg" />
          
          {/* Additional mobile optimizations */}
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="format-detection" content="telephone=no" />
          
          {/* Windows Phone */}
          <meta name="msapplication-navbutton-color" content="#cd1b17" />
          
          {/* PWA Manifest */}
          <link rel="manifest" href="/manifest.json" />
          
          {/* Apple Touch Icons - Multiple sizes for better iOS support */}
          <link rel="apple-touch-icon" href="/favicon.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/favicon.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/favicon.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/favicon.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/favicon.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/favicon.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/favicon.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/favicon.png" />
          <link rel="apple-touch-icon" sizes="57x57" href="/favicon.png" />
          <link rel="apple-touch-icon" sizes="32x32" href="/favicon.png" />
          
          {/* Favicon */}
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
          
          {/* Google Fonts: Poppins */}
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
          
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-BJM1HZGTYN" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-BJM1HZGTYN');
              `,
            }}
          />
          
          {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
            <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
          )}
          
          {process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && (
            <meta name="msvalidate.01" content={process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION} />
          )}
          
          {process.env.NEXT_PUBLIC_YANDEX_VERIFICATION && (
            <meta name="yandex-verification" content={process.env.NEXT_PUBLIC_YANDEX_VERIFICATION} />
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument 