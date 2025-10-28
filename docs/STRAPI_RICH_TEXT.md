# Strapi Rich Text Rendering System

Bu dokumentatsiya Strapi CMS dan kelgan rich text contentni saytning barcha qismlarida ishlatish uchun yaratilgan keng qamrovli yechimni tushuntiradi.

## Tizim Tarkibi

### 1. RichTextRenderer Komponenti
Asosiy rich text renderer komponenti (`components/Ui/RichTextRenderer/index.tsx`)

**Xususiyatlari:**
- Rasmlarni avtomatik ravishda render qiladi
- Ichki va tashqi havolalarni boshqaradi
- Matn formatlashini qo'llab-quvvatlaydi (bold, italic, underline, code)
- Responsive dizayn
- Tailwind CSS bilan integratsiya

### 2. StrapiRichText Wrapper Komponenti
Soddalashtirilgan wrapper komponent (`components/StrapiRichText/index.tsx`)

**Xususiyatlari:**
- Predefined styling variants (default, compact, detailed)
- Custom CSS classlar bilan moslashuvchanlik
- TypeScript to'liq qo'llab-quvvatlash
- Keng qamrovli dokumentatsiya

### 3. Strapi Adapter Funksiyalari
Utility funksiyalar (`utils/strapiAdapter.ts`)

**Yangilangan funksiyalar:**
- `blogContentToHtml()` - HTML ga konvertatsiya (rasmlar va havolalar bilan)
- `richTextToHtml()` - Rich text HTML ga konvertatsiya
- `convertToRichTextRendererFormat()` - RichTextRenderer formatiga konvertatsiya

## Foydalanish

### Asosiy Foydalanish

```tsx
import StrapiRichText from '../../components/StrapiRichText';

// Oddiy foydalanish
<StrapiRichText content={post.kontent} />

// Custom styling bilan
<StrapiRichText 
  content={post.kontent}
  className="prose prose-lg"
  imageClassName="my-8 rounded-xl"
  linkClassName="text-blue-600 hover:text-blue-800"
/>

// Predefined variant bilan
<StrapiRichText 
  content={post.kontent}
  variant="detailed"
/>
```

### Variantlar

1. **default** - Standart styling
2. **compact** - Kichikroq spacing va font size
3. **detailed** - Katta spacing va font size

### Advanced Foydalanish

```tsx
import RichTextRenderer from '../../components/Ui/RichTextRenderer';
import { convertToRichTextRendererFormat } from '../../utils/strapiAdapter';

<RichTextRenderer
  content={convertToRichTextRendererFormat(post.kontent)}
  className="custom-container"
  imageClassName="custom-image"
  linkClassName="custom-link"
  headingClassName="custom-heading"
  paragraphClassName="custom-paragraph"
  listClassName="custom-list"
  quoteClassName="custom-quote"
/>
```

## Qo'llab-quvvatlanadigan Content Turlari

### 1. Matn Formatlash
- **Bold** (`<strong>`)
- **Italic** (`<em>`)
- **Underline** (`<u>`)
- **Strikethrough** (`<del>`)
- **Code** (`<code>`)

### 2. Strukturaviy Elementlar
- **Paragraphs** (`<p>`)
- **Headings** (H1-H6)
- **Lists** (Ordered va Unordered)
- **Quotes** (`<blockquote>`)
- **Code blocks** (`<pre><code>`)

### 3. Media Elementlar
- **Rasmlar** - Avtomatik responsive, alt text, caption qo'llab-quvvatlash
- **Havolalar** - Ichki va tashqi havolalar, target va rel attributelar

### 4. Havolalar
- **Ichki havolalar** - Next.js Link komponenti orqali
- **Tashqi havolalar** - `target="_blank"` va `rel="noopener noreferrer"` bilan
- **Anchor havolalar** - Sayt ichidagi anchor linklar

## Strapi CMS da Sozlash

### Rich Text Field Konfiguratsiyasi

Strapi admin panelida rich text fieldni quyidagicha sozlang:

1. **Allowed blocks:**
   - Paragraph
   - Heading (H1-H6)
   - List (Ordered, Unordered)
   - Quote
   - Code
   - Image

2. **Allowed marks:**
   - Bold
   - Italic
   - Underline
   - Strikethrough
   - Code
   - Link

3. **Media settings:**
   - Enable image uploads
   - Set image formats (thumbnail, small, medium, large)
   - Enable alt text and caption fields

### API Response Format

Rich text content quyidagi formatda keladi:

```json
{
  "kontent": [
    {
      "type": "paragraph",
      "children": [
        {
          "text": "Bu oddiy matn ",
          "type": "text"
        },
        {
          "text": "bold matn",
          "type": "text",
          "bold": true
        },
        {
          "text": " va ",
          "type": "text"
        },
        {
          "text": "havola",
          "type": "text",
          "link": {
            "url": "https://example.com",
            "target": "_blank"
          }
        }
      ]
    },
    {
      "type": "image",
      "children": [
        {
          "type": "image",
          "image": {
            "id": 1,
            "url": "/uploads/image.jpg",
            "alternativeText": "Rasm tavsifi",
            "caption": "Rasm caption",
            "width": 800,
            "height": 600
          }
        }
      ]
    }
  ]
}
```

## Performance Optimizatsiyasi

### Image Optimization
- Next.js Image komponenti ishlatiladi
- Avtomatik lazy loading
- Responsive image formats
- WebP format qo'llab-quvvatlash

### Code Splitting
- RichTextRenderer komponenti lazy load qilinadi
- Faqat kerakli funksiyalar import qilinadi

## Xavfsizlik

### XSS Protection
- HTML sanitization
- Safe attribute handling
- Content Security Policy qo'llab-quvvatlash

### Link Security
- External linklar uchun `rel="noopener noreferrer"`
- Target="_blank" xavfsizligi
- URL validation

## Troubleshooting

### Umumiy Muammolar

1. **Rasmlar ko'rinmaydi**
   - Strapi API URL ni tekshiring
   - Image URL lar absolute ekanligini tekshiring
   - CORS sozlamalarini tekshiring

2. **Havolalar ishlamaydi**
   - Link URL formatini tekshiring
   - Next.js routing sozlamalarini tekshiring

3. **Styling muammolari**
   - Tailwind CSS konfiguratsiyasini tekshiring
   - Custom CSS classlarni tekshiring

### Debug Qilish

```tsx
// Content strukturasini ko'rish uchun
console.log('Rich text content:', JSON.stringify(post.kontent, null, 2));

// Converted formatni ko'rish uchun
console.log('Converted content:', convertToRichTextRendererFormat(post.kontent));
```

## Kelajakdagi Rivojlantirish

### Rejalashtirilgan Xususiyatlar
- Video embed qo'llab-quvvatlash
- Table rendering
- Custom block types
- Advanced media gallery
- Social media embed

### Performance Yaxshilashlar
- Server-side rendering optimizatsiyasi
- Image preloading
- Content caching
- Bundle size optimization

## Misollar

### Blog Post Sahifasi
```tsx
// pages/bookipedia/[slug].tsx
<StrapiRichText
  content={post.kontent}
  className="prose-base sm:prose-lg md:prose-xl lg:prose-2xl max-w-none mb-10 text-[#383838] text-justify leading-relaxed"
  variant="detailed"
/>
```

### Compact Content
```tsx
// pages/books/[slug]/index.tsx
<StrapiRichText
  content={novel.tavsifi}
  variant="compact"
  className="text-gray-700"
/>
```

### Custom Styling
```tsx
// components/Article/index.tsx
<StrapiRichText
  content={article.content}
  className="article-content"
  imageClassName="article-image"
  linkClassName="article-link"
  headingClassName="article-heading"
/>
```

Bu tizim saytning barcha qismlarida rich text contentni bir xil tarzda va xavfsiz tarzda render qilish imkonini beradi.
