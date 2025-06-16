const nextTranslate = require('next-translate')
module.exports = {
    reactStrictMode: false,
    esmExternals: false,
    ...nextTranslate({
        images: {
            domains: ['ak.madaniyat.uz' ]
        }
    })
}