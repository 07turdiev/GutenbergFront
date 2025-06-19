import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Mobile Browser Address Bar Theming */}
          <meta name="theme-color" content="#a62929" />
          
          {/* iOS Safari Specific */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          
          {/* Additional mobile optimizations */}
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <meta name="mobile-web-app-capable" content="yes" />
          
          {/* Windows Phone */}
          <meta name="msapplication-navbutton-color" content="#a62929" />
          
          {/* PWA Manifest */}
          <link rel="manifest" href="/manifest.json" />
          
          {/* Apple Touch Icon */}
          <link rel="apple-touch-icon" href="/favicon.png" />
          
          {/* Sitka font import */}
          <link
            href="https://fonts.googleapis.com/css2?family=Sitka+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap"
            rel="stylesheet"
          />
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