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

### **Nashriyotlar API'lari:**
```
// O'zbekcha
GET  /api/nashriyotlar?locale=uz                 → Barcha nashriyotlar (o'zbek tilida)
GET  /api/nashriyotlar/{slug}?locale=uz          → Bitta nashriyot (o'zbek tilida)
GET  /api/nashriyotlar/{slug}/kitoblar?locale=uz → Nashriyot kitoblari (o'zbek tilida)

// Inglizcha
GET  /api/nashriyotlar?locale=en                 → Barcha nashriyotlar (ingliz tilida)
GET  /api/nashriyotlar/{slug}?locale=en          → Bitta nashriyot (ingliz tilida)

// Ruscha
GET  /api/nashriyotlar?locale=ru                 → Barcha nashriyotlar (rus tilida)
GET  /api/nashriyotlar/{slug}?locale=ru          → Bitta nashriyot (rus tilida)
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

2. **Asosiy Content Type'lar yarating:**
   - mualliflar
   - marchalar
   - kitoblar (relation'lar bilan)

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

Bu o'zbekcha kitob do'koni variant bilan ishlash ancha qulay bo'ladi! 📚🇺🇿 