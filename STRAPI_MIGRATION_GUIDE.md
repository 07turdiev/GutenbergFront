# Audiokitob Loyihasini Strapi CMS ga To'liq Migratsiya Qo'llanmasi

## Loyiha Haqida Qisqacha
Bu audiokitob platformasi bo'lib, foydalanuvchilar audio kitoblarni tinglashi, mualliflarni kuzatishi, kitoblarni saqlashi va baholashi mumkin. Asosiy backend `ak.madaniyat.uz` domenida joylashgan va Next.js frontend bilan ishlaydi.

## Mavjud API Endpoint'lar Ro'yxati

### 1. AUTHENTICATION API'LAR
```
POST /api/users/send-code/          # SMS kod yuborish
POST /api/users/sms-confirmation/   # SMS kodni tasdiqlash  
POST /api/users/registration/       # Foydalanuvchi ro'yxatdan o'tishi
POST /api/users/login/              # Login
GET  /api/users/whoAmI/             # Joriy foydalanuvchi ma'lumotlari
GET  /api/users/logout/             # Logout
GET  /api/users/refresh-token/      # Token'ni yangilash
PATCH /api/users/retrieve/          # Profil o'zgartirish
PATCH /api/users/change_password/   # Parol o'zgartirish
```

### 2. NOVELS (ROMANLAR) API'LAR
```
GET  /{locale}/api/novels/                    # Barcha romanlar ro'yxati
GET  /{locale}/api/novels/{slug}              # Bitta roman ma'lumotlari
GET  /{locale}/api/novels/actual              # Dolzarb romanlar
GET  /{locale}/api/authors/{slug}/novels      # Muallif romanlari
GET  /{locale}/api/readers/{slug}/novels      # O'quvchi romanlari
GET  /{locale}/api/novels/{slug}/audio-list   # Roman audio ro'yxati
POST /{locale}/api/novels/{slug}/rate         # Roman baholash
POST /{locale}/api/novels/{slug}/save         # Romanni saqlash
GET  /{locale}/api/novels/saved               # Saqlangan romanlar
GET  /{locale}/api/novels/followed/           # Kuzatilayotgan romanlar
```

### 3. AUTHORS (MUALLIFLAR) API'LAR
```
GET    /{locale}/api/authors/            # Barcha mualliflar
GET    /{locale}/api/authors/list        # Mualliflar ro'yxati
GET    /{locale}/api/authors/{slug}      # Bitta muallif ma'lumotlari
POST   /{locale}/api/authors/{slug}/follow    # Muallifni kuzatish
DELETE /{locale}/api/authors/{slug}/unfollow  # Muallifni kuzatishni to'xtatish
GET    /{locale}/api/authors/followed    # Kuzatilayotgan mualliflar
```

### 4. AUDIO API'LAR
```
GET  /{locale}/api/audio/{slug}                # Bitta audio ma'lumotlari
POST /{locale}/api/audio/{slug}/bookmark       # Audio'ga belgi qo'yish
```

### 5. READERS (O'QUVCHILAR) API'LAR
```
GET /{locale}/api/readers/        # Barcha o'quvchilar
GET /{locale}/api/readers/{slug}  # Bitta o'quvchi ma'lumotlari
```

### 6. GENRES (JANRLAR) API'LAR
```
GET /{locale}/api/genres/      # Barcha janrlar
GET /{locale}/api/genres/list  # Janrlar ro'yxati
```

### 7. CATEGORIES (KATEGORIYALAR) API'LAR
```
GET /{locale}/api/categories/      # Barcha kategoriyalar
GET /{locale}/api/categories/list  # Kategoriyalar ro'yxati
```

### 8. ABOUT (BIZ HAQIMIZDA) API'LAR
```
GET /{locale}/api/about/             # Biz haqimizda ma'lumot
GET /{locale}/api/about/contacts     # Aloqa ma'lumotlari
GET /{locale}/api/about/social-links # Ijtimoiy tarmoq havolalari
GET /{locale}/api/about/statistics   # Statistik ma'lumotlar
```

### 9. ORDERS (BUYURTMALAR) API'LAR
```
GET  /{locale}/api/orders/        # Buyurtmalar ro'yxati
POST /{locale}/api/orders/create/ # Yangi buyurtma yaratish
```

### 10. ADVERTISING (REKLAMALAR) API'LAR
```
GET /{locale}/api/ads/{type}  # Reklama ma'lumotlari
```

### 11. NOTIFICATIONS (BILDIRISHNOMALAR) API'LAR
```
GET    /{locale}/api/notifications/                    # Bildirishnomalar
DELETE /{locale}/api/notifications/{id}/mark-as-read   # Bildirishnomani o'qilgan deb belgilash
```

## Ma'lumot Modellari (TypeScript Interface'lar)

### 1. INovel (Roman)
```typescript
interface INovel {
    slug: string;
    name: string;
    cover: {
        src: string;
        width: number;
        height: number;
        base64: string;
    };
    description: string;
    genre: string[];
    categories: string[];
    age_rate: string;
    actual: boolean;
    author: IAuthor;
    reader: string[];
    duration: string;
    audio_list: IAudioListItem[];
    rating: number;
    duration_uz: number | null;
    duration_ru: number | null;
    language: string;
    new: boolean;
    saved: boolean;
    published_at: string;
}
```

### 2. IAuthor (Muallif)
```typescript
interface IAuthor {
    name: string;
    slug: string;
    biography: string;
    novels_count: number;
    followed: boolean;
    photo: {
        src: string;
        width: number;
        height: number;
        base64: string;
    };
}
```

### 3. IUser (Foydalanuvchi)
```typescript
interface IUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    has_subscription: boolean;
    img: string;
}
```

### 4. IAudio (Audio)
```typescript
interface IAudio {
    slug: string;
    name_uz: string;
    name_ru: string;
    file: string;
    file_ru: null | string;
    file_uz: null | string;
    duration_ru: number;
    duration_uz: number;
    order: number;
}
```

### 5. IReader (O'quvchi)
```typescript
interface IReader {
    slug: string;
    name: string;
    photo: {
        src: string;
        width: number;
        height: number;
    };
    novels_count: number;
}
```

### 6. ICategory (Kategoriya)
```typescript
interface ICategory {
    slug: string;
    parent: string;
    name: string;
    icon: string;
}
```

### 7. IGenre (Janr)
```typescript
interface IGenre {
    slug: string;
    name: string;
}
```

### 8. IAdvertising (Reklama)
```typescript
interface IAdvertising {
    id: string;
    from_day: string;
    to_day: string;
    img: {
        src: string;
        width: number;
        height: number;
    };
    text: string;
    link: string;
    color: string;
    is_active: boolean;
}
```

### 9. IOrder (Buyurtma)
```typescript
interface IOrder {
    name: string;
    slug: string;
    author: string;
    reader: string;
    year: string;
    status: string;
    respond: string;
}
```

### 10. INotification (Bildirishnoma)
```typescript
interface INotification {
    id: string;
    viewed: boolean;
    message: string;
    link: string;
    novel: string;
    author: {
        name: string;
        slug: string;
    }
}
```

### 11. IAbout, ISocial, IContacts, IStatistics
```typescript
interface IAbout {
    description: string;
}

interface ISocial {
    facebook_url: string;
    instagram_url: string;
    telegram_url: string;
    youtube_url: string;
}

interface IContacts {
    address: string;
    email: string;
    phone: string;
    lng: string;
    ltd: string;
}

interface IStatistics {
    authors: number;
    novels: number;
    users: number;
    readers: number;
}
```

## Strapi da Yaratish Kerak Bo'lgan Content Type'lar

### COLLECTION TYPES:

#### 1. Authors (mualliflar)
```json
{
  "kind": "collectionType",
  "collectionName": "authors",
  "info": {
    "singularName": "author",
    "pluralName": "authors",
    "displayName": "Authors"
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "name",
      "required": true
    },
    "biography": {
      "type": "richtext"
    },
    "photo": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "novels_count": {
      "type": "integer",
      "default": 0
    },
    "novels": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::novel.novel",
      "mappedBy": "author"
    },
    "followed_by": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "plugin::users-permissions.user",
      "mappedBy": "followed_authors"
    }
  }
}
```

#### 2. Novels (romanlar)
```json
{
  "kind": "collectionType",
  "collectionName": "novels",
  "info": {
    "singularName": "novel",
    "pluralName": "novels",
    "displayName": "Novels"
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "name",
      "required": true
    },
    "description": {
      "type": "richtext"
    },
    "cover": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "age_rate": {
      "type": "enumeration",
      "enum": ["6+", "12+", "16+", "18+"]
    },
    "actual": {
      "type": "boolean",
      "default": false
    },
    "new": {
      "type": "boolean",
      "default": true
    },
    "rating": {
      "type": "decimal",
      "default": 0
    },
    "duration_uz": {
      "type": "integer"
    },
    "duration_ru": {
      "type": "integer"
    },
    "language": {
      "type": "enumeration",
      "enum": ["uz", "ru", "both"]
    },
    "author": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::author.author",
      "inversedBy": "novels"
    },
    "readers": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::reader.reader",
      "mappedBy": "novels"
    },
    "genres": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::genre.genre",
      "mappedBy": "novels"
    },
    "categories": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::category.category",
      "mappedBy": "novels"
    },
    "audio_files": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::audio-file.audio-file",
      "mappedBy": "novel"
    },
    "saved_by": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "plugin::users-permissions.user",
      "mappedBy": "saved_novels"
    }
  }
}
```

#### 3. Audio Files (audio-fayllar)
```json
{
  "kind": "collectionType",
  "collectionName": "audio_files",
  "info": {
    "singularName": "audio-file",
    "pluralName": "audio-files",
    "displayName": "Audio Files"
  },
  "attributes": {
    "name_uz": {
      "type": "string"
    },
    "name_ru": {
      "type": "string"
    },
    "slug": {
      "type": "uid",
      "targetField": "name_uz"
    },
    "file_uz": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["audios"]
    },
    "file_ru": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["audios"]
    },
    "duration_uz": {
      "type": "integer"
    },
    "duration_ru": {
      "type": "integer"
    },
    "order": {
      "type": "integer",
      "required": true
    },
    "novel": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::novel.novel",
      "inversedBy": "audio_files"
    }
  }
}
```

#### 4. Readers (o'quvchilar)
```json
{
  "kind": "collectionType",
  "collectionName": "readers",
  "info": {
    "singularName": "reader",
    "pluralName": "readers",
    "displayName": "Readers"
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "name"
    },
    "photo": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "novels_count": {
      "type": "integer",
      "default": 0
    },
    "novels": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::novel.novel",
      "inversedBy": "readers"
    }
  }
}
```

#### 5. Genres (janrlar)
```json
{
  "kind": "collectionType",
  "collectionName": "genres",
  "info": {
    "singularName": "genre",
    "pluralName": "genres",
    "displayName": "Genres"
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "name"
    },
    "novels": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::novel.novel",
      "inversedBy": "genres"
    }
  }
}
```

#### 6. Categories (kategoriyalar)
```json
{
  "kind": "collectionType",
  "collectionName": "categories",
  "info": {
    "singularName": "category",
    "pluralName": "categories",
    "displayName": "Categories"
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "name"
    },
    "parent": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::category.category"
    },
    "icon": {
      "type": "string"
    },
    "novels": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::novel.novel",
      "inversedBy": "categories"
    }
  }
}
```

#### 7. Orders (buyurtmalar)
```json
{
  "kind": "collectionType",
  "collectionName": "orders",
  "info": {
    "singularName": "order",
    "pluralName": "orders",
    "displayName": "Orders"
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "name"
    },
    "author": {
      "type": "string"
    },
    "reader": {
      "type": "string"
    },
    "year": {
      "type": "string"
    },
    "status": {
      "type": "enumeration",
      "enum": ["pending", "approved", "rejected"],
      "default": "pending"
    },
    "respond": {
      "type": "richtext"
    },
    "user": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    }
  }
}
```

#### 8. Notifications (bildirishnomalar)
```json
{
  "kind": "collectionType",
  "collectionName": "notifications",
  "info": {
    "singularName": "notification",
    "pluralName": "notifications",
    "displayName": "Notifications"
  },
  "attributes": {
    "message": {
      "type": "string",
      "required": true
    },
    "viewed": {
      "type": "boolean",
      "default": false
    },
    "link": {
      "type": "string"
    },
    "user": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "novel": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::novel.novel"
    },
    "author": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::author.author"
    }
  }
}
```

#### 9. Advertisements (reklamalar)
```json
{
  "kind": "collectionType",
  "collectionName": "advertisements",
  "info": {
    "singularName": "advertisement",
    "pluralName": "advertisements",
    "displayName": "Advertisements"
  },
  "attributes": {
    "text": {
      "type": "string"
    },
    "img": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "link": {
      "type": "string"
    },
    "color": {
      "type": "string"
    },
    "is_active": {
      "type": "boolean",
      "default": true
    },
    "from_day": {
      "type": "date"
    },
    "to_day": {
      "type": "date"
    },
    "type": {
      "type": "enumeration",
      "enum": ["banner", "popup", "sidebar"]
    }
  }
}
```

### SINGLE TYPES:

#### 1. About (biz-haqimizda)
```json
{
  "kind": "singleType",
  "collectionName": "about",
  "info": {
    "singularName": "about",
    "pluralName": "abouts",
    "displayName": "About"
  },
  "attributes": {
    "description": {
      "type": "richtext"
    }
  }
}
```

#### 2. Social Links (ijtimoiy-tarmoqlar)
```json
{
  "kind": "singleType",
  "collectionName": "social_links",
  "info": {
    "singularName": "social-link",
    "pluralName": "social-links",
    "displayName": "Social Links"
  },
  "attributes": {
    "facebook_url": {
      "type": "string"
    },
    "instagram_url": {
      "type": "string"
    },
    "telegram_url": {
      "type": "string"
    },
    "youtube_url": {
      "type": "string"
    }
  }
}
```

#### 3. Contacts (aloqa)
```json
{
  "kind": "singleType",
  "collectionName": "contacts",
  "info": {
    "singularName": "contact",
    "pluralName": "contacts",
    "displayName": "Contacts"
  },
  "attributes": {
    "address": {
      "type": "string"
    },
    "email": {
      "type": "email"
    },
    "phone": {
      "type": "string"
    },
    "lng": {
      "type": "string"
    },
    "ltd": {
      "type": "string"
    }
  }
}
```

#### 4. Statistics (statistika)
```json
{
  "kind": "singleType",
  "collectionName": "statistics",
  "info": {
    "singularName": "statistic",
    "pluralName": "statistics",
    "displayName": "Statistics"
  },
  "attributes": {
    "authors": {
      "type": "integer",
      "default": 0
    },
    "novels": {
      "type": "integer",
      "default": 0
    },
    "users": {
      "type": "integer",
      "default": 0
    },
    "readers": {
      "type": "integer",
      "default": 0
    }
  }
}
```

## Users-Permissions Plugin Kengaytmasi

Users jadvaliga qo'shimcha maydonlar:
```json
{
  "has_subscription": {
    "type": "boolean",
    "default": false
  },
  "img": {
    "type": "media",
    "multiple": false,
    "allowedTypes": ["images"]
  },
  "saved_novels": {
    "type": "relation",
    "relation": "manyToMany",
    "target": "api::novel.novel",
    "inversedBy": "saved_by"
  },
  "followed_authors": {
    "type": "relation",
    "relation": "manyToMany",
    "target": "api::author.author",
    "inversedBy": "followed_by"
  }
}
```

## Custom API Endpoints (Controllers)

### Novels Controller'da qo'shimcha metodlar:
```javascript
// api/novel/controllers/novel.js
module.exports = {
  async actual(ctx) {
    // Dolzarb romanlarni qaytarish
  },
  
  async rate(ctx) {
    // Romanni baholash
  },
  
  async save(ctx) {
    // Romanni saqlash
  },
  
  async saved(ctx) {
    // Saqlangan romanlarni qaytarish
  },
  
  async followed(ctx) {
    // Kuzatilayotgan romanlarni qaytarish
  }
};
```

### Authors Controller'da qo'shimcha metodlar:
```javascript
// api/author/controllers/author.js
module.exports = {
  async follow(ctx) {
    // Muallifni kuzatish
  },
  
  async unfollow(ctx) {
    // Muallifni kuzatishni to'xtatish
  },
  
  async followed(ctx) {
    // Kuzatilayotgan mualliflarni qaytarish
  }
};
```

## Routes Konfiguratsiyasi

### Custom routes qo'shish:
```javascript
// api/novel/routes/novel.js
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/novels/actual',
      handler: 'novel.actual'
    },
    {
      method: 'POST',
      path: '/novels/:id/rate',
      handler: 'novel.rate'
    },
    {
      method: 'POST',
      path: '/novels/:id/save',
      handler: 'novel.save'
    },
    {
      method: 'GET',
      path: '/novels/saved',
      handler: 'novel.saved'
    },
    {
      method: 'GET',
      path: '/novels/followed',
      handler: 'novel.followed'
    }
  ]
};
```

## Internationalization (i18n) Konfiguratsiyasi

```javascript
// config/plugins.js
module.exports = {
  i18n: {
    enabled: true,
    config: {
      locales: ['uz', 'ru'],
      defaultLocale: 'uz'
    }
  }
};
```

## Media Upload Konfiguratsiyasi

Audio fayllar uchun:
```javascript
// config/plugins.js
module.exports = {
  upload: {
    config: {
      sizeLimit: 250 * 1024 * 1024, // 250MB
      provider: 'aws-s3', // yoki local
      providerOptions: {
        // AWS S3 konfiguratsiyasi
      }
    }
  }
};
```

## Permissions Konfiguratsiyasi

### Public Role:
- novels: find, findOne
- authors: find, findOne
- genres: find, findOne
- categories: find, findOne
- readers: find, findOne
- about: find
- contacts: find
- social-links: find
- statistics: find

### Authenticated Role:
- Barcha Public permissions
- novels: rate, save, followed
- authors: follow, unfollow, followed
- orders: create, find (faqat o'ziniki)
- notifications: find, mark-as-read

## Dasturning Asosiy Funksiyalari

1. **Multimediya Platform**: Audio kitoblar tinglash
2. **User Management**: Ro'yxatdan o'tish, login, profil boshqaruv
3. **Content Management**: Romanlar, mualliflar, o'quvchilar
4. **Social Features**: Follow, save, rate
5. **Localization**: O'zbek va rus tillari
6. **Subscription System**: Premium obuna
7. **Notification System**: Foydalanuvchi xabarlari
8. **Order System**: Yangi kitob so'rash

## Keyingi Qadamlar AI Uchun:

1. Strapi loyihasini yarating: `npx create-strapi-app@latest audiobook-cms --quickstart`
2. Yuqoridagi barcha Content Type'larni ularning JSON konfiguratsiyalari bilan yarating
3. Custom controller'lar va route'larni qo'shing
4. Users-permissions plugin'ini kengaytiring
5. i18n va media upload'ni sozlang
6. API permissions'ni to'g'ri sozlang
7. Test data bilan to'ldiring

Barcha ma'lumotlar to'liq va aniq berilgan. AI bu ko'rsatma asosida to'liq ishlaydigan Strapi backend yarata oladi. 