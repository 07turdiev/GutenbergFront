const nextTranslate = require('next-translate')
module.exports = {
    reactStrictMode: false,
    ...nextTranslate({
        images: {
            domains: ['localhost', 'admin.gutenbergnu.uz']
        }
    })
}
