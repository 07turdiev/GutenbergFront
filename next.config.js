const nextTranslate = require('next-translate')
module.exports = {
    reactStrictMode: false,
    ...nextTranslate({
        images: {
            domains: ['localhost', 'localhost:1337']
        }
    })
}