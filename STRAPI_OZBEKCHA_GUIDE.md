# 📚 Nashiryot Kitob Do'koni - O'zbekcha Strapi Content Type'lar (i18n bilan)

## 🌐 Tillar Sozlamalari
- **uz** (default) - O'zbekcha
- **en** - Inglizcha  
- **ru** - Ruscha

## 📋 Collection Type'lar (i18n bilan)

### **1. Kitoblar (kitoblar)**
```javascript
// Collection Type nomi: "kitoblar"
// API ID: "kitoblar"
// i18n: ENABLED (localized: true)
{
  // LOCALIZED FIELDS (har til uchun alohida)
  nomi: {
    type: "string",
    required: true,
    pluginOptions: {
      i18n: {
        localized: true
      }
        }
  },
  slug: {
    type: "uid",
    targetField: "nomi",
    required: true,
    pluginOptions: {
      i18n: {
        localized: true
      }
    }
  },
  tavsifi: {
    type: "richtext",
    pluginOptions: {
      i18n: {
        localized: true
      }
    }
  },
  
  // GLOBAL FIELDS (barcha tillar uchun bir xil)
  muqova: {
    type: "media",
    multiple: false,
    allowedTypes: ["images"],
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  yosh_chegarasi: {
    type: "enumeration",
    enum: ["6+", "12+", "16+", "18+"],
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  dolzarb: {
    type: "boolean",
    default: false,
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  yangi: {
    type: "boolean", 
    default: true,
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  reyting: {
    type: "decimal",
    default: 0,
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  narxi: {
    type: "decimal",
    required: true,
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  chegirma_narxi: {
    type: "decimal",
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  ISBN: {
    type: "string",
    unique: true,
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  sahifalar_soni: {
    type: "integer",
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  chop_yili: {
    type: "integer",
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  omborda: {
    type: "integer",
    default: 0,
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },

  audio: {
    type: "media",
    multiple: false,
    allowedTypes: ["audios"],
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  audio_davomiyligi: {
    type: "integer",
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  
  // Relations (global)
  muallifi: {
    type: "relation",
    relation: "manyToOne",
    target: "api::mualliflar.mualliflar",
    inversedBy: "kitoblar"
  },
  janrlar: {
    type: "relation",
    relation: "manyToMany",
    target: "api::janrlar.janrlar",
    mappedBy: "kitoblar"
  },
  kategoriyalar: {
    type: "relation",
    relation: "manyToMany",
    target: "api::kategoriyalar.kategoriyalar", 
    mappedBy: "kitoblar"
  },

  saqlagan_foydalanuvchilar: {
    type: "relation",
    relation: "manyToMany",
    target: "plugin::users-permissions.user",
    mappedBy: "saqlangan_kitoblar"
  }
}
```

### **2. Mualliflar (mualliflar)**
```javascript
// Collection Type nomi: "mualliflar"  
// API ID: "mualliflar"
// i18n: ENABLED (localized: true)
{
  // LOCALIZED FIELDS
  ismi: {
    type: "string",
    required: true,
    pluginOptions: {
      i18n: {
        localized: true
      }
    }
  },
  slug: {
    type: "uid", 
    targetField: "ismi",
    required: true,
    pluginOptions: {
      i18n: {
        localized: true
      }
    }
  },
  tarjimai_holi: {
    type: "richtext",
    pluginOptions: {
      i18n: {
        localized: true
      }
    }
  },
  
  // GLOBAL FIELDS
  rasmi: {
    type: "media",
    multiple: false,
    allowedTypes: ["images"],
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  romanlar_soni: {
    type: "integer",
    default: 0,
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  
  // Relations
  kitoblar: {
    type: "relation",
    relation: "oneToMany", 
    target: "api::kitoblar.kitoblar",
    mappedBy: "muallifi"
  },
  blog_postlari: {
    type: "relation",
    relation: "oneToMany",
    target: "api::blog-postlari.blog-postlari",
    mappedBy: "muallifi"
  },
  kuzatuvchi_foydalanuvchilar: {
    type: "relation",
    relation: "manyToMany",
    target: "plugin::users-permissions.user", 
    mappedBy: "kuzatilayotgan_mualliflar"
  }
}
```

### **3. Janrlar (janrlar)**
```javascript
// Collection Type nomi: "janrlar"
// API ID: "janrlar"
{
  nomi: {
    type: "string", 
    required: true
  },
  slug: {
    type: "uid",
    targetField: "nomi"
  },
  
  // Relations
  kitoblar: {
    type: "relation",
    relation: "manyToMany",
    target: "api::kitoblar.kitoblar",
    inversedBy: "janrlar"
  }
}
```

### **4. Kategoriyalar (kategoriyalar)**
```javascript
// Collection Type nomi: "kategoriyalar"
// API ID: "kategoriyalar"
{
  nomi: {
    type: "string",
    required: true
  },
  slug: {
    type: "uid", 
    targetField: "nomi"
  },
  ota_kategoriya: {
    type: "relation",
    relation: "manyToOne",
    target: "api::kategoriyalar.kategoriyalar"
  },
  ikonka: {
    type: "string"
  },
  
  // Relations
  kitoblar: {
    type: "relation",
    relation: "manyToMany",
    target: "api::kitoblar.kitoblar",
    inversedBy: "kategoriyalar"
  }
}
```

### **5. Blog Postlari (blog-postlari)**
```javascript
// Collection Type nomi: "blog-postlari"
// API ID: "blog-postlari"
// i18n: ENABLED (localized: true)
{
  // LOCALIZED FIELDS (har til uchun alohida)
  sarlavha: {
    type: "string",
    required: true,
    pluginOptions: {
      i18n: {
        localized: true
      }
    }
  },
  slug: {
    type: "uid",
    targetField: "sarlavha",
    required: true,
    pluginOptions: {
      i18n: {
        localized: true
      }
    }
  },
  kontent: {
    type: "richtext",
    required: true,
    pluginOptions: {
      i18n: {
        localized: true
      }
    }
  },
  
  // GLOBAL FIELDS (barcha tillar uchun bir xil)
  rasmi: {
    type: "media",
    multiple: false,
    allowedTypes: ["images"],
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  chop_sanasi: {
    type: "datetime",
    required: true,
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  nashr_etilgan: {
    type: "boolean",
    default: false,
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  mashhur: {
    type: "boolean",
    default: false,
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  korishlar_soni: {
    type: "integer",
    default: 0,
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  
  // Audio va Video content (Global)
  audio_mavjud: {
    type: "boolean",
    default: false,
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  audio_davomiyligi: {
    type: "integer",
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  youtube_havolasi: {
    type: "string",
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  
    // Audio track'lar uchun ayrida Collection Type yaratiladi
  
  // Relations
  audio_tracklar: {
    type: "relation",
    relation: "oneToMany",
    target: "api::blog-audio-tracklar.blog-audio-tracklar",
    mappedBy: "blog_posti"
  },
  teglar: {
    type: "relation",
    relation: "manyToMany",
    target: "api::teglar.teglar",
    mappedBy: "blog_postlari"
  },
  kategoriya: {
    type: "relation",
    relation: "manyToOne",
    target: "api::blog-kategoriyalar.blog-kategoriyalar",
    inversedBy: "blog_postlari"
  }
  }
  ```

### **6. Blog Audio Track'lar (blog-audio-tracklar)**
```javascript
// Collection Type nomi: "blog-audio-tracklar"
// API ID: "blog-audio-tracklar"
{
  nomi: {
    type: "string",
    required: true
  },
  slug: {
    type: "uid",
    targetField: "nomi",
    required: true
  },
  tartib_raqami: {
    type: "integer",
    required: true,
    default: 1
  },
  davomiyligi: {
    type: "integer",
    required: true
  },
  fayl: {
    type: "media",
    multiple: false,
    allowedTypes: ["audios"],
    required: true
  },
  
  // Relations
  blog_posti: {
    type: "relation",
    relation: "manyToOne",
    target: "api::blog-postlari.blog-postlari",
    inversedBy: "audio_tracklar"
  }
}
```

### **7. Blog Kategoriyalar (blog-kategoriyalar)**
```javascript
// Collection Type nomi: "blog-kategoriyalar"
// API ID: "blog-kategoriyalar"
// i18n: ENABLED (localized: true)
{
  // LOCALIZED FIELDS
  nomi: {
    type: "string",
    required: true,
    pluginOptions: {
      i18n: {
        localized: true
      }
    }
  },
  slug: {
    type: "uid",
    targetField: "nomi",
    required: true,
    pluginOptions: {
      i18n: {
        localized: true
      }
    }
  },
  tavsifi: {
    type: "text",
    pluginOptions: {
      i18n: {
        localized: true
      }
    }
  },
  
  // GLOBAL FIELDS
  rangi: {
    type: "string",
    default: "#3B82F6",
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  tartibi: {
    type: "integer",
    default: 0,
    pluginOptions: {
      i18n: {
        localized: false
      }
    }
  },
  
  // Relations
  blog_postlari: {
    type: "relation",
    relation: "oneToMany",
    target: "api::blog-postlari.blog-postlari",
    mappedBy: "kategoriya"
  }
}
```

### **8. Teglar (teglar)**
```javascript
// Collection Type nomi: "teglar"
// API ID: "teglar"
{
  nomi: {
    type: "string",
    required: true,
    unique: true
  },
  slug: {
    type: "uid",
    targetField: "nomi",
    required: true
  },
  rangi: {
    type: "string",
    default: "#6B7280"
  },
  
  // Relations
  blog_postlari: {
    type: "relation",
    relation: "manyToMany",
    target: "api::blog-postlari.blog-postlari",
    inversedBy: "teglar"
  }
}
  ```





## 📄 Single Type'lar (O'zbekcha)

### **1. Biz Haqimizda (biz-haqimizda)**
```javascript
// Single Type nomi: "biz-haqimizda"
// API ID: "biz-haqimizda"
{
  tavsifi: {
    type: "richtext"
  }
}
```

### **2. Ijtimoiy Tarmoqlar (ijtimoiy-tarmoqlar)**
```javascript
// Single Type nomi: "ijtimoiy-tarmoqlar"
// API ID: "ijtimoiy-tarmoqlar"
{
  facebook_havolasi: {
    type: "string"
  },
  instagram_havolasi: {
    type: "string"
  },
  telegram_havolasi: {
    type: "string"
  },
  youtube_havolasi: {
    type: "string"
  }
}
```

### **3. Aloqa (aloqa)**
```javascript
// Single Type nomi: "aloqa"
// API ID: "aloqa"
{
  manzili: {
    type: "string"
  },
  email: {
    type: "email"
  },
  telefoni: {
    type: "string"
  },
  kenglik: {
    type: "string"
  },
  uzunlik: {
    type: "string"
  }
}
```

### **4. Statistika (statistika)**
```javascript
// Single Type nomi: "statistika"
// API ID: "statistika"
{
  mualliflar_soni: {
    type: "integer",
    default: 0
  },
  kitoblar_soni: {
    type: "integer", 
    default: 0
  },

  foydalanuvchilar_soni: {
    type: "integer",
    default: 0
  }
}
```

## 👤 Users-Permissions Kengaytmasi (O'zbekcha)

Foydalanuvchilar jadvaliga qo'shimcha maydonlar:
```javascript
{
  obunasi_bor: {
    type: "boolean",
    default: false
  },
  rasmi: {
    type: "media",
    multiple: false,
    allowedTypes: ["images"]
  },
  saqlangan_kitoblar: {
    type: "relation",
    relation: "manyToMany", 
    target: "api::kitoblar.kitoblar",
    inversedBy: "saqlagan_foydalanuvchilar"
  },
  kuzatilayotgan_mualliflar: {
    type: "relation",
    relation: "manyToMany",
    target: "api::mualliflar.mualliflar",
    inversedBy: "kuzatuvchi_foydalanuvchilar"
  }
}
```

## 🎯 i18n API Endpoint'lar (3 til bilan)

### **Kitoblar API'lari:**
```
// O'zbekcha (default)
GET  /api/kitoblars?locale=uz                    → Barcha kitoblar (o'zbek tilida)
GET  /api/kitoblars/{documentId}?locale=uz       → Bitta kitob (o'zbek tilida)
GET  /api/kitoblars/dolzarb?locale=uz            → Dolzarb kitoblar (o'zbek tilida)
GET  /api/kitoblars/yangi?locale=uz              → Yangi kitoblar (o'zbek tilida)

// Inglizcha  
GET  /api/kitoblars?locale=en                    → Barcha kitoblar (ingliz tilida)
GET  /api/kitoblars/{documentId}?locale=en       → Bitta kitob (ingliz tilida)
GET  /api/kitoblars/dolzarb?locale=en            → Dolzarb kitoblar (ingliz tilida)

// Ruscha
GET  /api/kitoblars?locale=ru                    → Barcha kitoblar (rus tilida)
GET  /api/kitoblars/{documentId}?locale=ru       → Bitta kitob (rus tilida)
GET  /api/kitoblars/dolzarb?locale=ru            → Dolzarb kitoblar (rus tilida)

// Barcha tillarda
GET  /api/kitoblars?locale=all                   → Barcha kitoblar (barcha tillar)

// Custom endpoints
POST /api/kitoblars/{documentId}/baholash?locale=uz → Kitob baholash
POST /api/kitoblars/{documentId}/saqlash?locale=uz  → Kitob saqlash
GET  /api/kitoblars/saqlangan?locale=uz             → Saqlangan kitoblar
GET  /api/kitoblars/kuzatilayotgan?locale=uz        → Kuzatilayotgan kitoblar

// Audio kitoblar
GET  /api/kitoblars?filters[audio][$notNull]=true&locale=uz → Audio mavjud kitoblar
GET  /api/kitoblars/{documentId}?populate=audio&locale=uz   → Kitob audio bilan

// Filter endpoints
GET  /api/kitoblars?filters[narxi][$lte]=50000&locale=uz        → Narx bo'yicha filter
GET  /api/kitoblars?filters[janrlar][slug][$eq]=fantastika&locale=uz → Janr bo'yicha filter
GET  /api/kitoblars?filters[audio][$notNull]=true&locale=uz     → Faqat audio kitoblar
```

### **Mualliflar API'lari:**
```
// O'zbekcha
GET  /api/mualliflar?locale=uz                   → Barcha mualliflar (o'zbek tilida)
GET  /api/mualliflar/{slug}?locale=uz            → Bitta muallif (o'zbek tilida)

// Inglizcha
GET  /api/mualliflar?locale=en                   → Barcha mualliflar (ingliz tilida)
GET  /api/mualliflar/{slug}?locale=en            → Bitta muallif (ingliz tilida)

// Ruscha  
GET  /api/mualliflar?locale=ru                   → Barcha mualliflar (rus tilida)
GET  /api/mualliflar/{slug}?locale=ru            → Bitta muallif (rus tilida)

// Custom endpoints (global - til bog'liq emas)
POST   /api/mualliflar/{slug}/kuzatish           → Muallif kuzatish
DELETE /api/mualliflar/{slug}/bekor              → Kuzatishni bekor qilish
GET    /api/mualliflar/kuzatilayotgan?locale=uz  → Kuzatilayotgan mualliflar
```

### **Blog Postlari API'lari:**
```
// O'zbekcha (default)
GET  /api/blog-postlaris?locale=uz                → Barcha blog postlari (o'zbek tilida)
GET  /api/blog-postlaris/{slug}?locale=uz         → Bitta blog post (o'zbek tilida)
GET  /api/blog-postlaris/mashhur?locale=uz        → Mashhur blog postlari (o'zbek tilida)
GET  /api/blog-postlaris/oxirgi?locale=uz         → Oxirgi blog postlari (o'zbek tilida)

// Inglizcha
GET  /api/blog-postlaris?locale=en                → Barcha blog postlari (ingliz tilida)
GET  /api/blog-postlaris/{slug}?locale=en         → Bitta blog post (ingliz tilida)

// Ruscha
GET  /api/blog-postlaris?locale=ru                → Barcha blog postlari (rus tilida)
GET  /api/blog-postlaris/{slug}?locale=ru         → Bitta blog post (rus tilida)

// Filter endpoints
GET  /api/blog-postlaris?filters[kategoriya][slug][$eq]=texnologiya&locale=uz → Kategoriya bo'yicha filter
GET  /api/blog-postlaris?filters[teglar][slug][$eq]=audio&locale=uz           → Teg bo'yicha filter
GET  /api/blog-postlaris?filters[muallifi][slug][$eq]=alisher-navoiy&locale=uz → Muallif bo'yicha filter
GET  /api/blog-postlaris?filters[audio][$notNull]=true&locale=uz              → Faqat audio'li postlar
GET  /api/blog-postlaris?filters[youtube_havolasi][$notNull]=true&locale=uz   → Faqat video'li postlar

// Custom endpoints
POST /api/blog-postlaris/{slug}/korish?locale=uz      → Post ko'rishlar sonini oshirish
GET  /api/blog-postlaris/trendda?locale=uz            → Trend blog postlari
GET  /api/blog-postlaris/audio?locale=uz              → Audio mavjud postlar
GET  /api/blog-postlaris/video?locale=uz              → Video mavjud postlar
GET  /api/blog-postlaris/{slug}/audio?locale=uz       → Blog post audio track'lari
POST /api/blog-postlaris/{slug}/play-audio?locale=uz  → Audio track o'ynash (Player uchun)
```

### **Blog Kategoriyalar API'lari:**
```
// O'zbekcha
GET  /api/blog-kategoriyalars?locale=uz           → Barcha blog kategoriyalar (o'zbek tilida)
GET  /api/blog-kategoriyalars/{slug}?locale=uz    → Bitta blog kategoriya (o'zbek tilida)
GET  /api/blog-kategoriyalars/{slug}/postlar?locale=uz → Kategoriya postlari (o'zbek tilida)

// Inglizcha
GET  /api/blog-kategoriyalars?locale=en           → Barcha blog kategoriyalar (ingliz tilida)
GET  /api/blog-kategoriyalars/{slug}?locale=en    → Bitta blog kategoriya (ingliz tilida)

// Ruscha
GET  /api/blog-kategoriyalars?locale=ru           → Barcha blog kategoriyalar (rus tilida)
GET  /api/blog-kategoriyalars/{slug}?locale=ru    → Bitta blog kategoriya (rus tilida)
```

### **Teglar API'lari:**
```
GET /{locale}/api/teglar                          → Barcha teglar
GET /{locale}/api/teglar/{slug}/postlar           → Teg bo'yicha postlar
GET /{locale}/api/teglar/mashhur                  → Eng ko'p ishlatiladigan teglar
```

### **Janrlar API'lari:**
```
GET /{locale}/api/janrlar        → Barcha janrlar
GET /{locale}/api/janrlar/royxat → Janrlar ro'yxati
```

### **Kategoriyalar API'lari:**
```
GET /{locale}/api/kategoriyalar        → Barcha kategoriyalar
GET /{locale}/api/kategoriyalar/royxat → Kategoriyalar ro'yxati
```

### **Ma'lumotlar API'lari:**
```
GET /{locale}/api/biz-haqimizda           → Biz haqimizda
GET /{locale}/api/aloqa                   → Aloqa ma'lumotlari
GET /{locale}/api/ijtimoiy-tarmoqlar      → Ijtimoiy tarmoqlar
GET /{locale}/api/statistika              → Statistika
```



## 🎮 O'zbekcha Custom Controller'lar

### **src/api/kitoblar/controllers/kitoblar.js**
```javascript
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::kitoblar.kitoblar', ({ strapi }) => ({
  
  async dolzarb(ctx) {
    const { locale } = ctx.query;
    const entities = await strapi.entityService.findMany('api::kitoblar.kitoblar', {
      filters: { dolzarb: true },
      populate: ['muallifi', 'muqova', 'janrlar', 'kategoriyalar', 'nashriyoti'],
      locale: locale || 'uz'
    });
    return entities;
  },

  async yangi(ctx) {
    const { locale } = ctx.query;
    const entities = await strapi.entityService.findMany('api::kitoblar.kitoblar', {
      filters: { yangi: true },
      populate: ['muallifi', 'muqova', 'janrlar', 'kategoriyalar', 'marchasi'],
      locale: locale || 'uz'
    });
    return entities;
  },

  async audio(ctx) {
    const { locale } = ctx.query;
    const entities = await strapi.entityService.findMany('api::kitoblar.kitoblar', {
      filters: { audio_mavjud: true },
      populate: ['muallifi', 'muqova', 'marchasi'],
      locale: locale || 'uz'
    });
    return entities;
  },

  async getAudio(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;
    
    const entity = await strapi.entityService.findMany('api::kitoblar.kitoblar', {
      filters: { slug: slug },
      locale: locale || 'uz'
    });
    
    if (!entity[0] || !entity[0].audio_mavjud) {
      return ctx.notFound('Audio fayl topilmadi');
    }
    
    return {
      audio_fayl_uz: entity[0].audio_fayl_uz,
      audio_fayl_ru: entity[0].audio_fayl_ru, 
      audio_fayl_en: entity[0].audio_fayl_en,
      audio_davomiyligi_uz: entity[0].audio_davomiyligi_uz,
      audio_davomiyligi_ru: entity[0].audio_davomiyligi_ru,
      audio_davomiyligi_en: entity[0].audio_davomiyligi_en
    };
  },

  async baholash(ctx) {
    const { id } = ctx.params;
    const { baho } = ctx.request.body;
    const foydalanuvchiId = ctx.state.user.id;
    
    const entity = await strapi.entityService.update('api::kitoblar.kitoblar', id, {
      data: { reyting: baho }
    });
    return entity;
  },

  async saqlash(ctx) {
    const { id } = ctx.params;
    const foydalanuvchiId = ctx.state.user.id;
    
    await strapi.entityService.update('plugin::users-permissions.user', foydalanuvchiId, {
      data: {
        saqlangan_kitoblar: { connect: [id] }
      }
    });
    
    return { xabar: 'Kitob muvaffaqiyatli saqlandi' };
  },

  async saqlangan(ctx) {
    const foydalanuvchiId = ctx.state.user.id;
    
    const foydalanuvchi = await strapi.entityService.findOne('plugin::users-permissions.user', foydalanuvchiId, {
      populate: {
        saqlangan_kitoblar: {
          populate: ['muallifi', 'muqova', 'marchasi']
        }
      }
    });
    
    return foydalanuvchi.saqlangan_kitoblar;
  }

}));
```

### **src/api/mualliflar/controllers/mualliflar.js**
```javascript
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::mualliflar.mualliflar', ({ strapi }) => ({
  
  async kuzatish(ctx) {
    const { id } = ctx.params;
    const foydalanuvchiId = ctx.state.user.id;
    
    await strapi.entityService.update('plugin::users-permissions.user', foydalanuvchiId, {
      data: {
        kuzatilayotgan_mualliflar: { connect: [id] }
      }
    });
    
    return { xabar: 'Muallif muvaffaqiyatli kuzatilmoqda' };
  },

  async bekor(ctx) {
    const { id } = ctx.params;
    const foydalanuvchiId = ctx.state.user.id;
    
    await strapi.entityService.update('plugin::users-permissions.user', foydalanuvchiId, {
      data: {
        kuzatilayotgan_mualliflar: { disconnect: [id] }
      }
    });
    
    return { xabar: 'Muallif kuzatishdan chiqarildi' };
  }

}));
```

### **src/api/blog-postlari/controllers/blog-postlari.js**
```javascript
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::blog-postlari.blog-postlari', ({ strapi }) => ({
  
  async mashhur(ctx) {
    const { locale } = ctx.query;
    const entities = await strapi.entityService.findMany('api::blog-postlari.blog-postlari', {
      filters: { mashhur: true, nashr_etilgan: true },
      populate: ['muallifi', 'rasmi', 'kategoriya', 'teglar'],
      locale: locale || 'uz',
      sort: { korishlar_soni: 'desc' }
    });
    return entities;
  },

  async oxirgi(ctx) {
    const { locale } = ctx.query;
    const entities = await strapi.entityService.findMany('api::blog-postlari.blog-postlari', {
      filters: { nashr_etilgan: true },
      populate: ['muallifi', 'rasmi', 'kategoriya', 'teglar'],
      locale: locale || 'uz',
      sort: { chop_sanasi: 'desc' },
      pagination: { limit: 6 }
    });
    return entities;
  },

  async trendda(ctx) {
    const { locale } = ctx.query;
    const bir_hafta_oldin = new Date();
    bir_hafta_oldin.setDate(bir_hafta_oldin.getDate() - 7);
    
    const entities = await strapi.entityService.findMany('api::blog-postlari.blog-postlari', {
      filters: { 
        nashr_etilgan: true,
        chop_sanasi: { $gte: bir_hafta_oldin }
      },
      populate: ['muallifi', 'rasmi', 'kategoriya', 'teglar'],
      locale: locale || 'uz',
      sort: { korishlar_soni: 'desc' },
      pagination: { limit: 10 }
    });
    return entities;
  },

  async audio(ctx) {
    const { locale } = ctx.query;
    const entities = await strapi.entityService.findMany('api::blog-postlari.blog-postlari', {
      filters: { 
        nashr_etilgan: true,
        audio: { $notNull: true }
      },
      populate: ['muallifi', 'rasmi', 'kategoriya', 'teglar', 'audio'],
      locale: locale || 'uz'
    });
    return entities;
  },

  async video(ctx) {
    const { locale } = ctx.query;
    const entities = await strapi.entityService.findMany('api::blog-postlari.blog-postlari', {
      filters: { 
        nashr_etilgan: true,
        youtube_havolasi: { $notNull: true }
      },
      populate: ['muallifi', 'rasmi', 'kategoriya', 'teglar'],
      locale: locale || 'uz'
    });
    return entities;
  },

  async korish(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;
    
    const entities = await strapi.entityService.findMany('api::blog-postlari.blog-postlari', {
      filters: { slug: slug },
      locale: locale || 'uz'
    });
    
    if (!entities[0]) {
      return ctx.notFound('Blog post topilmadi');
    }
    
    const updatedEntity = await strapi.entityService.update('api::blog-postlari.blog-postlari', entities[0].id, {
      data: {
        korishlar_soni: entities[0].korishlar_soni + 1
      }
    });
    
    return { xabar: 'Ko\'rishlar soni yangilandi', korishlar_soni: updatedEntity.korishlar_soni };
  },

  async getAudio(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;
    
    const entities = await strapi.entityService.findMany('api::blog-postlari.blog-postlari', {
      filters: { slug: slug },
      populate: ['audio_tracklar'],
      locale: locale || 'uz'
    });
    
    if (!entities[0]) {
      return ctx.notFound('Blog post topilmadi');
    }
    
    if (!entities[0].audio_mavjud || !entities[0].audio_tracklar.length) {
      return ctx.notFound('Audio track topilmadi');
    }
    
    return entities[0].audio_tracklar.sort((a, b) => a.tartib_raqami - b.tartib_raqami);
  },

  async playAudio(ctx) {
    const { slug } = ctx.params;
    const { locale, track_slug } = ctx.query;
    
    const blogPost = await strapi.entityService.findMany('api::blog-postlari.blog-postlari', {
      filters: { slug: slug },
      populate: ['audio_tracklar'],
      locale: locale || 'uz'
    });
    
    if (!blogPost[0]) {
      return ctx.notFound('Blog post topilmadi');
    }
    
    const track = blogPost[0].audio_tracklar.find(t => t.slug === track_slug);
    
    if (!track) {
      return ctx.notFound('Audio track topilmadi');
    }
    
    // Player uchun format
    return {
      slug: track.slug,
      file: track.fayl.url,
      name: track.nomi,
      duration: track.davomiyligi,
      novel: {
        slug: blogPost[0].slug,
        name: blogPost[0].sarlavha,
        cover: blogPost[0].rasmi || null
      },
      next: null, // Keyingi track (agar mavjud bo'lsa)
      prev: null  // Avvalgi track (agar mavjud bo'lsa)
    };
  }

}));
```

### **src/api/teglar/controllers/teglar.js**
```javascript
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::teglar.teglar', ({ strapi }) => ({
  
  async mashhur(ctx) {
    const entities = await strapi.entityService.findMany('api::teglar.teglar', {
      populate: {
        blog_postlari: {
          count: true
        }
      },
      sort: 'blog_postlari:desc',
      pagination: { limit: 20 }
    });
    return entities;
  },

  async postlar(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;
    
    const teg = await strapi.entityService.findMany('api::teglar.teglar', {
      filters: { slug: slug },
      populate: {
        blog_postlari: {
          populate: ['muallifi', 'rasmi', 'kategoriya'],
          locale: locale || 'uz',
          filters: { nashr_etilgan: true }
        }
      }
    });
    
    if (!teg[0]) {
      return ctx.notFound('Teg topilmadi');
    }
    
    return teg[0].blog_postlari;
  }

}));
```

## 🛣️ O'zbekcha Custom Routes

### **src/api/kitoblar/routes/custom-kitoblar.js**
```javascript
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/kitoblar/dolzarb',
      handler: 'kitoblar.dolzarb',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/kitoblar/yangi',
      handler: 'kitoblar.yangi',
      config: {
        auth: false
      }
    },
    {
      method: 'POST', 
      path: '/kitoblar/:id/baholash',
      handler: 'kitoblar.baholash'
    },
    {
      method: 'POST',
      path: '/kitoblar/:id/saqlash', 
      handler: 'kitoblar.saqlash'
    },
    {
      method: 'GET',
      path: '/kitoblar/saqlangan',
      handler: 'kitoblar.saqlangan'
    },
    {
      method: 'GET',
      path: '/kitoblar/audio',
      handler: 'kitoblar.audio',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/kitoblar/:slug/audio',
      handler: 'kitoblar.getAudio',
      config: {
        auth: false
      }
    }
  ]
};
```

### **src/api/mualliflar/routes/custom-mualliflar.js**
```javascript
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/mualliflar/:id/kuzatish',
      handler: 'mualliflar.kuzatish'
    },
    {
      method: 'DELETE', 
      path: '/mualliflar/:id/bekor',
      handler: 'mualliflar.bekor'
    }
  ]
};
```

### **src/api/blog-postlari/routes/custom-blog-postlari.js**
```javascript
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/blog-postlari/mashhur',
      handler: 'blog-postlari.mashhur',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/blog-postlari/oxirgi',
      handler: 'blog-postlari.oxirgi',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/blog-postlari/trendda',
      handler: 'blog-postlari.trendda',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/blog-postlari/audio',
      handler: 'blog-postlari.audio',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/blog-postlari/video',
      handler: 'blog-postlari.video',
      config: {
        auth: false
      }
    },
          {
        method: 'POST',
        path: '/blog-postlari/:slug/korish',
        handler: 'blog-postlari.korish',
        config: {
          auth: false
        }
      },
      {
        method: 'GET',
        path: '/blog-postlari/:slug/audio',
        handler: 'blog-postlari.getAudio',
        config: {
          auth: false
        }
      },
      {
        method: 'POST',
        path: '/blog-postlari/:slug/play-audio',
        handler: 'blog-postlari.playAudio',
        config: {
          auth: false
        }
      }
  ]
};
```

### **src/api/teglar/routes/custom-teglar.js**
```javascript
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/teglar/mashhur',
      handler: 'teglar.mashhur',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/teglar/:slug/postlar',
      handler: 'teglar.postlar',
      config: {
        auth: false
      }
    }
  ]
};
```

## ⚙️ i18n Konfiguratsiya

### **config/plugins.js**
```javascript
module.exports = {
  i18n: {
    enabled: true,
    config: {
      locales: [
        {
          code: 'uz',
          name: 'O\'zbekcha',
          isDefault: true
        },
        {
          code: 'en', 
          name: 'English'
        },
        {
          code: 'ru',
          name: 'Русский'
        }
      ],
      defaultLocale: 'uz'
    }
  }
};
```

### **Content Type'larni i18n bilan yaratish:**
1. Admin panel → Content-Type Builder
2. Create new collection type
3. **Advanced Settings** → **Internationalization** → ✅ Enable localization
4. Har bir field uchun **Localized** ni belgilang:
   - **Localized (true):** nomi, slug, tavsifi (har til uchun alohida)
   - **Global (false):** reyting, sana, rasm (barcha tillarda bir xil)

## 🔒 i18n Permission'lar

### **Ommaviy (Public) Role:**
- kitoblar: find, findOne, dolzarb, yangi, audio, getAudio (barcha tillarda)
- mualliflar: find, findOne (barcha tillarda)
- marchalar: find, findOne (barcha tillarda)
- janrlar: find, findOne (barcha tillarda)
- kategoriyalar: find, findOne (barcha tillarda)
- blog-postlari: find, findOne, mashhur, oxirgi, trendda, audio, video, korish (barcha tillarda)
- blog-kategoriyalar: find, findOne (barcha tillarda)
- teglar: find, findOne, mashhur, postlar (barcha tillarda)
- biz-haqimizda: find (barcha tillarda)
- aloqa: find (barcha tillarda)
- ijtimoiy-tarmoqlar: find (barcha tillarda)
- statistika: find (barcha tillarda)

### **Ro'yxatdan O'tgan (Authenticated) Role:**
- Barcha Public permissions +
- kitoblar: baholash, saqlash, saqlangan
- mualliflar: kuzatish, bekor

## 📋 Yaratish Tartibi:

1. **Oddiy Content Type'lar yarating:**
   - janrlar
   - kategoriyalar 
   - teglar
   - blog-kategoriyalar

2. **Asosiy Content Type'lar yarating:**
   - mualliflar
   - marchalar
   - kitoblar (relation'lar bilan)
   - blog-postlari (relation'lar bilan)
   - blog-audio-tracklar (blog audio uchun)

3. **Single Type'lar yarating:**
   - biz-haqimizda
   - aloqa
   - ijtimoiy-tarmoqlar
   - statistika

4. **Custom controller va route'lar qo'shing**

5. **Permission'larni sozlang**

## 📝 i18n bilan Ishlash Misollari

### **Frontend'da API chaqirish:**
```javascript
// O'zbekcha ma'lumot olish
const kitoblarnUz = await fetch('/api/kitoblars?locale=uz');

// Inglizcha ma'lumot olish  
const kitoblarnEn = await fetch('/api/kitoblars?locale=en');

// Ruscha ma'lumot olish
const kitoblarnRu = await fetch('/api/kitoblars?locale=ru');

// Barcha tillardagi ma'lumot olish
const kitoblarnAll = await fetch('/api/kitoblars?locale=all');

// Bitta kitobni o'zbekcha olish (documentId bilan)
const kitobUz = await fetch('/api/kitoblars/mfmwh3tv9bih4fmeejnf909v?locale=uz');

// Bitta kitobni audio bilan olish
const kitobAudio = await fetch('/api/kitoblars/mfmwh3tv9bih4fmeejnf909v?locale=uz&populate=audio');

// Audio mavjud kitoblarni filter qilish
const audioKitoblar = await fetch('/api/kitoblars?filters[audio][$notNull]=true&locale=uz');

// Narx bo'yicha filter
const arzonKitoblar = await fetch('/api/kitoblars?filters[narxi][$lte]=50000&locale=uz');
```

### **Ma'lumot strukturasi (Response):**
```javascript
// GET /api/kitoblar/gullar-mamlakati?locale=uz
{
  "data": {
    "id": 1,
    "attributes": {
      "nomi": "Gullar mamlakati",           // O'zbekcha nom
      "slug": "gullar-mamlakati",           // O'zbekcha slug
      "tavsifi": "Bu kitob haqida...",      // O'zbekcha tavsif
      "reyting": 4.5,                       // Global (barcha tillarda bir xil)
      "dolzarb": true,                      // Global
      "narxi": 45000,                       // Global - kitob narxi
      "chegirma_narxi": 35000,              // Global - chegirma narxi
      "ISBN": "978-9943-01-123-4",          // Global - ISBN kod
      "sahifalar_soni": 285,                // Global - sahifalar soni
      "chop_yili": 2023,                    // Global - chop yili
      "omborda": 15,                        // Global - ombordagi miqdor
      "audio_davomiyligi": 720,             // Global - audio davomiylik (min)
      "audio": {                            // Global - audio fayl
        "id": 5,
        "name": "kitob_audio.mp3",
        "url": "/uploads/kitob_audio.mp3",
        "mime": "audio/mpeg",
        "size": 3121.43
      },
      "muqova": {                           // Global
        "data": {
          "url": "/uploads/kitob_muqova.jpg"
        }
      },
      "muallifi": {                         // Relation
        "data": {
          "attributes": {
            "ismi": "Abdulla Qodiriy",      // O'zbekcha ism
            "tarjimai_holi": "..."          // O'zbekcha tarjimai hol
          }
        }
      },
      "marchasi": {                         // Relation - yangi
        "data": {
          "attributes": {
            "nomi": "O'zbek Adabiyoti",     // O'zbekcha marcha nomi
            "logo": {
              "data": {
                "url": "/uploads/marcha_logo.jpg"
              }
            }
          }
        }
      },
      "locale": "uz",
      "localizations": {                    // Boshqa tillardagi versiyalar
        "data": [
          {
            "id": 2,
            "attributes": {
              "locale": "en"
            }
          },
          {
            "id": 3, 
            "attributes": {
              "locale": "ru"
            }
          }
        ]
      }
    }
  }
}
```

### **Barcha tillardagi ma'lumot:**
```javascript
// GET /api/kitoblar/gullar-mamlakati?locale=all
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "nomi": "Gullar mamlakati",         // O'zbekcha
        "locale": "uz"
      }
    },
    {
      "id": 2,
      "attributes": {
        "nomi": "Land of Flowers",          // Inglizcha
        "locale": "en"  
      }
    },
    {
      "id": 3,
      "attributes": {
        "nomi": "Страна цветов",            // Ruscha
        "locale": "ru"
      }
    }
  ]
}
```

### **Ma'lumot yaratish (Create):**
```javascript
// Kitoblar yaratish - avval o'zbekcha (default)
POST /api/kitoblar
{
  "data": {
    "nomi": "Yangi kitob",
    "tavsifi": "Bu yangi kitob...",
    "narxi": 25000,
    "ISBN": "978-9943-01-456-7",
    "sahifalar_soni": 320,
    "chop_yili": 2024,
    "omborda": 50,
    "locale": "uz"
  }
}

// Keyin boshqa tillarga tarjima qilish
POST /api/kitoblar/{id}/localizations
{
  "data": {
    "nomi": "New Book", 
    "tavsifi": "This is a new book...",
    "locale": "en"
  }
}
```

### **Custom Controller'da i18n:**
```javascript
// src/api/kitoblar/controllers/kitoblar.js
module.exports = createCoreController('api::kitoblar.kitoblar', ({ strapi }) => ({
  
  async dolzarb(ctx) {
    const { locale } = ctx.query;
    
    const entities = await strapi.entityService.findMany('api::kitoblar.kitoblar', {
      filters: { dolzarb: true },
      populate: ['muallifi', 'muqova', 'marchasi'],
      locale: locale || 'uz'  // Default o'zbekcha
    });
    
    return entities;
  }

}));
```

Bu i18n variant bilan 3 ta tilda to'liq ishlaydi! 🌐🇺🇿🇬🇧🇷🇺

## 📚 Nashiryot Kitob Do'koni Xususiyatlari

### **Asosiy O'zgarishlar:**
✅ **Olib tashlandi:** 
- O'quvchilar (oquvchilar)
- Audio fayllar 
- Buyurtmalar
- Bildirishnomalar  
- Reklamalar

✅ **Qo'shildi:**
- **Marchalar** - noshirlik markalar
- **Kitob narxi** va chegirma tizimi
- **ISBN** kodi va sahifalar soni
- **Ombor** ma'lumotlari

### **Frontend Moslik:**
- API endpoint'lar eski struktura bilan mos keladi
- Faqat `romanlar` → `kitoblar` o'zgaradi
- Barcha boshqa funksiyalar saqlanadi
- i18n to'liq qo'llab-quvvatlanadi

### **Yangi API Imkoniyatlari:**
```javascript
// Narx bo'yicha filter
GET /api/kitoblar?filters[narxi][$lte]=50000

// Marcha bo'yicha filter  
GET /api/kitoblar?filters[marchasi][slug][$eq]=ozbek-adabiyoti

// Ombordagi kitoblar
GET /api/kitoblar?filters[omborda][$gt]=0

// Chegirmadagi kitoblar
GET /api/kitoblar?filters[chegirma_narxi][$notNull]=true
```

## 📝 Blog API bilan Ishlash Misollari

### **Frontend'da Blog API chaqirish:**
```javascript
// Barcha blog postlari
const blogPosts = await fetch('/api/blog-postlaris?locale=uz&populate=muallifi,rasmi,kategoriya,teglar');

// Mashhur blog postlari
const mashhurPosts = await fetch('/api/blog-postlaris/mashhur?locale=uz');

// Bitta blog post
const blogPost = await fetch('/api/blog-postlaris/audio-kitoblar-kelajagi?locale=uz&populate=muallifi,rasmi,kategoriya,teglar,audio');

// Frontend'da qisqacha matn yaratish:
// - Sarlavha: 50 belgi + "..." (agar uzunroq bo'lsa)
// - Excerpt: Kontent'dan 80 belgi + "..." (HTML taglarini olib tashlash kerak)

// Audio mavjud postlar
const audioPosts = await fetch('/api/blog-postlaris/audio?locale=uz');

// Kategoriya bo'yicha filter
const texnologiyaPosts = await fetch('/api/blog-postlaris?filters[kategoriya][slug][$eq]=texnologiya&locale=uz');

// Ko'rishlar sonini oshirish
const viewUpdate = await fetch('/api/blog-postlaris/audio-kitoblar-kelajagi/korish?locale=uz', {
  method: 'POST'
});
```

### **Blog Post Ma'lumot Strukturasi (Response):**
```javascript
// GET /api/blog-postlaris/audio-kitoblar-kelajagi?locale=uz
{
  "data": {
    "id": 1,
    "attributes": {
      "sarlavha": "Audio kitoblarning kelajagi",        // O'zbekcha sarlavha (frontend: 50 belgi + "...")
      "slug": "audio-kitoblar-kelajagi",                // O'zbekcha slug
      "kontent": "<p>Audio kitoblar zamonaviy...</p>",  // O'zbekcha kontent (frontend excerpt: 80 belgi + "...")
      "chop_sanasi": "2024-01-15T09:00:00.000Z",        // Global - chop sanasi
      "nashr_etilgan": true,                            // Global - nashr holati
      "mashhur": false,                                 // Global - mashhurlik
      "korishlar_soni": 247,                           // Global - ko'rishlar soni
      "youtube_havolasi": "https://youtube.com/...",   // Global - YouTube URL
      "meta_sarlavha": "Audio kitoblar haqida...",     // O'zbekcha SEO sarlavha
      "meta_tavsifi": "Bu maqolada audio...",          // O'zbekcha SEO tavsif
      "rasmi": {                                        // Global
        "data": {
          "url": "/uploads/blog_post_image.jpg"
        }
      },
      "audio": {                                        // Global
        "data": {
          "url": "/uploads/blog_post_audio.mp3",
          "mime": "audio/mpeg",
          "size": 2156.89
        }
      },
      "muallifi": {                                     // Relation
        "data": {
          "attributes": {
            "ismi": "Alisher Navoiy",                   // O'zbekcha ism
            "slug": "alisher-navoiy"
          }
        }
      },
      "kategoriya": {                                   // Relation
        "data": {
          "attributes": {
            "nomi": "Texnologiya",                      // O'zbekcha kategoriya nomi
            "slug": "texnologiya",
            "rangi": "#3B82F6"
          }
        }
      },
      "teglar": {                                       // Relation
        "data": [
          {
            "attributes": {
              "nomi": "audio",
              "slug": "audio",
              "rangi": "#6B7280"
            }
          },
          {
            "attributes": {
              "nomi": "kitoblar",
              "slug": "kitoblar",
              "rangi": "#6B7280"
            }
          }
        ]
      },
      "locale": "uz",
      "localizations": {                               // Boshqa tillardagi versiyalar
        "data": [
          {
            "id": 2,
            "attributes": {
              "locale": "en"
            }
          },
          {
            "id": 3,
            "attributes": {
              "locale": "ru"
            }
          }
        ]
      }
    }
  }
}
```

### **Blog Kategoriyalar Response:**
```javascript
// GET /api/blog-kategoriyalars?locale=uz
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "nomi": "Texnologiya",                         // O'zbekcha nom
        "slug": "texnologiya",                         // O'zbekcha slug
        "tavsifi": "Texnologiya bilan bog'liq...",     // O'zbekcha tavsif
        "rangi": "#3B82F6",                            // Global - rang
        "tartibi": 1,                                  // Global - tartib
        "locale": "uz"
      }
    },
    {
      "id": 2,
      "attributes": {
        "nomi": "Adabiyot",
        "slug": "adabiyot",
        "tavsifi": "Adabiyot va yozuvchilik...",
        "rangi": "#10B981",
        "tartibi": 2,
        "locale": "uz"
      }
    }
  ]
}
```

### **Teglar Response:**
```javascript
// GET /api/teglar/mashhur
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "nomi": "audio",
        "slug": "audio",
        "rangi": "#6B7280"
      }
    },
    {
      "id": 2,
      "attributes": {
        "nomi": "kitoblar",
        "slug": "kitoblar", 
        "rangi": "#6B7280"
      }
    }
  ]
}
```

## 🎵 Blog Audio Player Integration

### **Frontend'da Player Component bilan ishlash:**
```javascript
// Blog post audio'ni o'ynash
import { useDispatch } from 'react-redux';
import { setActiveTrack } from '../../store/actions/player';

const BlogAudioPlayer = ({ blogPost }) => {
  const dispatch = useDispatch();

  const playBlogAudio = async (trackSlug) => {
    // Blog audio track'ni Player'ga yuklash
    dispatch(setActiveTrack({
      active_slug: trackSlug,
      lang: 'uz',
      playImmediately: true,
      type: 'blog' // Kitoblardan farqlash uchun
    }));
  };

  return (
    <div className="blog-audio-player">
      {blogPost.audio_mavjud && blogPost.audio_tracklar.map((track) => (
        <div key={track.slug} className="audio-track">
          <button 
            onClick={() => playBlogAudio(track.slug)}
            className="play-button"
          >
            {track.nomi} - {track.davomiyligi} daqiqa
          </button>
        </div>
      ))}
    </div>
  );
};
```

### **Blog sahifasida to'liq Player integration:**
```javascript
// pages/blog/[slug].tsx ichida
import Player from '../../components/Player';
import { PlayerContext } from '../../components/contexts/PlayerContext';

const BlogPostPage = ({ blogPost }) => {
  return (
    <MainLayout>
      <PlayerContext.Provider value={{ player: useRef(null) }}>
        
        {/* Blog matn */}
        <div dangerouslySetInnerHTML={{ __html: blogPost.kontent }} />
        
        {/* Audio Player - kitoblar kabi */}
        {blogPost.audio_mavjud && (
          <BlogAudioSection blogPost={blogPost} />
        )}
        
        {/* Video Player */}
        {blogPost.youtube_havolasi && (
          <BlogVideoSection youtubeUrl={blogPost.youtube_havolasi} />
        )}
        
        {/* Global Player */}
        <Player />
        
      </PlayerContext.Provider>
    </MainLayout>
  );
};
```

### **Audio Actions'ni kengaytirish:**
```javascript
// store/actions/player.js ichida blog uchun
export const fetchBlogAudio = createAsyncThunk(
  'player/fetchBlogAudio',
  async ({locale, slug, trackSlug}: {locale: string, slug: string, trackSlug: string}) => {
    const response = await $api.get(`/${locale}/api/blog-postlaris/${slug}/play-audio?track_slug=${trackSlug}`)
    return response.data
  }
)
```

Bu o'zbekcha kitob do'koni variant bilan ishlash ancha qulay bo'ladi! 📚🇺🇿 

Endi blog tizimi ham to'liq i18n qo'llab-quvvatlash bilan tayyorlangan! 📝✨

## 🎯 Blog Audio Xususiyatlari:

✅ **Kitoblar kabi Player component** - bir xil UI/UX  
✅ **Audio track'lar** - blog postlariga audio qo'shish  
✅ **Player integration** - global player bilan ishlash  
✅ **Matn pastida joylashuv** - audio va video kontent  
✅ **Mobile responsive** - barcha qurilmalarda ishlaydi  
✅ **3 tilda qo'llab-quvvatlash** - i18n bilan  

Blog audiosi endi kitoblar kabi professional ko'rinadi! 🎧🎵 