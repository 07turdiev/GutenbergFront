const nextTranslate = require('next-translate')
module.exports = {
    reactStrictMode: false,
    ...nextTranslate({
        images: {
            domains: ['localhost', 'admin.gutenbergnu.uz', 'gutenbergnu.uz']
        },
        // SEO optimizatsiyasi
        async headers() {
            return [
                {
                    source: '/(.*)',
                    headers: [
                        {
                            key: 'X-Robots-Tag',
                            value: 'index, follow'
                        },
                        {
                            key: 'X-Content-Type-Options',
                            value: 'nosniff'
                        },
                        {
                            key: 'X-Frame-Options',
                            value: 'DENY'
                        },
                        {
                            key: 'X-XSS-Protection',
                            value: '1; mode=block'
                        }
                    ]
                }
            ]
        },
        // Compression
        compress: true,
        // Performance optimizatsiyasi
        experimental: {
            optimizeCss: true,
            optimizePackageImports: ['react', 'react-dom']
        }
    })
}
