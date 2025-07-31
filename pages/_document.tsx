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
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
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
          
          {/* Favicon */}
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
          
          {/* Sitka font import */}
          <link
            href="https://fonts.googleapis.com/css2?family=Sitka+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap"
            rel="stylesheet"
          />
          
          {/* Google Analytics */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'GA_MEASUREMENT_ID', {
                  page_title: 'Gutenberg',
                  page_location: window.location.href,
                });
              `,
            }}
          />
          
          {/* Google Search Console */}
          <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
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