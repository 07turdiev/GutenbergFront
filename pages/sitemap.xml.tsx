import { GetServerSideProps } from 'next'
import NovelService from '../services/novels'
import BlogService from '../services/blog'
import AuthorService from '../services/author'

const EXTERNAL_DATA_URL = 'https://gutenbergnu.uz'

interface Page {
  loc: string
  lastmod: string
  changefreq: string
  priority: number
  hreflangs?: { lang: string; href: string }[]
}

function generateSiteMap(pages: Page[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
     ${pages
       .map((page) => {
         const hreflangs = page.hreflangs
           ? page.hreflangs.map(h => `<xhtml:link rel="alternate" hreflang="${h.lang}" href="${h.href}" />`).join('\n           ')
           : ''
         
         return `
       <url>
           <loc>${page.loc}</loc>
           <lastmod>${page.lastmod}</lastmod>
           <changefreq>${page.changefreq}</changefreq>
           <priority>${page.priority}</priority>
           ${hreflangs}
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

function SiteMap() {
}

export const getServerSideProps: GetServerSideProps = async ({ res, locale }) => {
  const currentLocale = locale || 'uz'
  const currentDate = new Date().toISOString()
  
  const staticPages: Page[] = [
    {
      loc: `${EXTERNAL_DATA_URL}/`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0,
      hreflangs: [
        { lang: 'uz', href: `${EXTERNAL_DATA_URL}/` },
        { lang: 'ru', href: `${EXTERNAL_DATA_URL}/ru/` },
        { lang: 'en', href: `${EXTERNAL_DATA_URL}/en/` }
      ]
    },
    {
      loc: `${EXTERNAL_DATA_URL}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.9,
      hreflangs: [
        { lang: 'uz', href: `${EXTERNAL_DATA_URL}/about` },
        { lang: 'ru', href: `${EXTERNAL_DATA_URL}/ru/about` },
        { lang: 'en', href: `${EXTERNAL_DATA_URL}/en/about` }
      ]
    },
    {
      loc: `${EXTERNAL_DATA_URL}/books`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9,
      hreflangs: [
        { lang: 'uz', href: `${EXTERNAL_DATA_URL}/books` },
        { lang: 'ru', href: `${EXTERNAL_DATA_URL}/ru/books` },
        { lang: 'en', href: `${EXTERNAL_DATA_URL}/en/books` }
      ]
    },
    {
      loc: `${EXTERNAL_DATA_URL}/authors`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8,
      hreflangs: [
        { lang: 'uz', href: `${EXTERNAL_DATA_URL}/authors` },
        { lang: 'ru', href: `${EXTERNAL_DATA_URL}/ru/authors` },
        { lang: 'en', href: `${EXTERNAL_DATA_URL}/en/authors` }
      ]
    },
    {
      loc: `${EXTERNAL_DATA_URL}/bookipedia`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.8,
      hreflangs: [
        { lang: 'uz', href: `${EXTERNAL_DATA_URL}/bookipedia` },
        { lang: 'ru', href: `${EXTERNAL_DATA_URL}/ru/bookipedia` },
        { lang: 'en', href: `${EXTERNAL_DATA_URL}/en/bookipedia` }
      ]
    },
    {
      loc: `${EXTERNAL_DATA_URL}/categories`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7,
      hreflangs: [
        { lang: 'uz', href: `${EXTERNAL_DATA_URL}/categories` },
        { lang: 'ru', href: `${EXTERNAL_DATA_URL}/ru/categories` },
        { lang: 'en', href: `${EXTERNAL_DATA_URL}/en/categories` }
      ]
    },
    {
      loc: `${EXTERNAL_DATA_URL}/genres`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7,
      hreflangs: [
        { lang: 'uz', href: `${EXTERNAL_DATA_URL}/genres` },
        { lang: 'ru', href: `${EXTERNAL_DATA_URL}/ru/genres` },
        { lang: 'en', href: `${EXTERNAL_DATA_URL}/en/genres` }
      ]
    },
    {
      loc: `${EXTERNAL_DATA_URL}/team`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6,
      hreflangs: [
        { lang: 'uz', href: `${EXTERNAL_DATA_URL}/team` },
        { lang: 'ru', href: `${EXTERNAL_DATA_URL}/ru/team` },
        { lang: 'en', href: `${EXTERNAL_DATA_URL}/en/team` }
      ]
    },
    {
      loc: `${EXTERNAL_DATA_URL}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6,
      hreflangs: [
        { lang: 'uz', href: `${EXTERNAL_DATA_URL}/contact` },
        { lang: 'ru', href: `${EXTERNAL_DATA_URL}/ru/contact` },
        { lang: 'en', href: `${EXTERNAL_DATA_URL}/en/contact` }
      ]
    },
    {
      loc: `${EXTERNAL_DATA_URL}/documents`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.5,
      hreflangs: [
        { lang: 'uz', href: `${EXTERNAL_DATA_URL}/documents` },
        { lang: 'ru', href: `${EXTERNAL_DATA_URL}/ru/documents` },
        { lang: 'en', href: `${EXTERNAL_DATA_URL}/en/documents` }
      ]
    },
    {
      loc: `${EXTERNAL_DATA_URL}/privacy-policy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.4,
      hreflangs: [
        { lang: 'uz', href: `${EXTERNAL_DATA_URL}/privacy-policy` },
        { lang: 'ru', href: `${EXTERNAL_DATA_URL}/ru/privacy-policy` },
        { lang: 'en', href: `${EXTERNAL_DATA_URL}/en/privacy-policy` }
      ]
    },
    {
      loc: `${EXTERNAL_DATA_URL}/terms`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.4,
      hreflangs: [
        { lang: 'uz', href: `${EXTERNAL_DATA_URL}/terms` },
        { lang: 'ru', href: `${EXTERNAL_DATA_URL}/ru/terms` },
        { lang: 'en', href: `${EXTERNAL_DATA_URL}/en/terms` }
      ]
    },
  ]

  const allPages: Page[] = [...staticPages]

  try {
    const [novelsResponse, authorsResponse, blogResponse] = await Promise.all([
      NovelService.fetchNovels({ locale: currentLocale, 'pagination[pageSize]': 1000 }),
      AuthorService.fetchAuthors(currentLocale, { params: { 'pagination[pageSize]': 1000 } }),
      BlogService.fetchBlogPosts({ locale: currentLocale, pageSize: 1000 })
    ])

    const novels = novelsResponse?.data?.data || []
    const authors = authorsResponse?.data?.data || []
    const blogPosts = blogResponse?.data?.data || []

    novels.forEach((novel: any) => {
      allPages.push({
        loc: `${EXTERNAL_DATA_URL}/books/${novel.slug}`,
        lastmod: novel.updatedAt || currentDate,
        changefreq: 'monthly',
        priority: 0.6,
        hreflangs: [
          { lang: 'uz', href: `${EXTERNAL_DATA_URL}/books/${novel.slug}` },
          { lang: 'ru', href: `${EXTERNAL_DATA_URL}/ru/books/${novel.slug}` },
          { lang: 'en', href: `${EXTERNAL_DATA_URL}/en/books/${novel.slug}` }
        ]
      })
    })

    authors.forEach((author: any) => {
      allPages.push({
        loc: `${EXTERNAL_DATA_URL}/authors/${author.slug}`,
        lastmod: author.updatedAt || currentDate,
        changefreq: 'monthly',
        priority: 0.5,
        hreflangs: [
          { lang: 'uz', href: `${EXTERNAL_DATA_URL}/authors/${author.slug}` },
          { lang: 'ru', href: `${EXTERNAL_DATA_URL}/ru/authors/${author.slug}` },
          { lang: 'en', href: `${EXTERNAL_DATA_URL}/en/authors/${author.slug}` }
        ]
      })
    })

    blogPosts.forEach((post: any) => {
      allPages.push({
        loc: `${EXTERNAL_DATA_URL}/bookipedia/${post.slug}`,
        lastmod: post.updatedAt || currentDate,
        changefreq: 'monthly',
        priority: 0.5,
        hreflangs: [
          { lang: 'uz', href: `${EXTERNAL_DATA_URL}/bookipedia/${post.slug}` },
          { lang: 'ru', href: `${EXTERNAL_DATA_URL}/ru/bookipedia/${post.slug}` },
          { lang: 'en', href: `${EXTERNAL_DATA_URL}/en/bookipedia/${post.slug}` }
        ]
      })
    })
  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error)
  }

  const sitemap = generateSiteMap(allPages)

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap 