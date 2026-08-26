# EduUZ — O'zbekiston Ta'lim Platformasi

O'zbekiston universitetlari, ta'lim yo'nalishlari va stipendiyalari haqida to'liq ma'lumot beruvchi zamonaviy veb-platforma.

---

## Loyiha haqida

EduUZ — bu O'zbekistondagi oliy ta'lim muassasalarini qidirish, solishtirish va ariza topshirish imkonini beruvchi interaktiv veb-ilova. Platforma sun'iy intellekt (Gemini AI) yordamida talabalarga yo'nalish tanlashda maslahat beradi.

---

## Asosiy imkoniyatlar

### 1. Universitetlar qidiruvi (`/universities`)
- 50+ davlat, xususiy va xalqaro universitetlar ma'lumotlari
- Kategoriya bo'yicha filtrlash (Davlat / Xususiy / Xalqaro)
- Shahar bo'yicha tanlash
- Mutaxassislik bo'yicha qidiruv
- Bekor qilish va qidiruv paneli
- Saralangan universitetlar — tasodifiy rangli glow blob animatsiyalari
- Har bir kartochkada: rasm, badge, tavsif, reyting, ko'rishlar soni

### 2. Ta'lim yo'nalishlari (`/majors`)
- 8+ yo'nalish: AI, Kibxavfsizlik, Biznes, Pediatriya, Arxitektura, Robototexnika, Game Dizayn, Data Science
- Har bir yo'nalish uchun: o'rtacha maosh, universitetlar soni, stipendiya
- AI maslahatchi — yo'nalish tanlashda yordam
- Yo'nalish testi — 4 savolli test orqali mos yo'nalishni aniqlash

### 3. Grantlar va stipendiyalar (`/scholarships`)
- Davlat grantlari va xalqaro stipendiyalar ro'yxati
- Filtr tizimi
- Ariza topshirish bo'yicha ko'rsatmalar

### 4. Qabul jarayoni (`/admissions`)
- Qabul bosqichlari: Ro'yxatdan o'tish → Imtihonlar → Hujjatlar → Qabul
- Kerakli hujjatlar ro'yxati
- Rasmiy portallar (UzBMS, My.gov.uz)
- Tez-tez beriladigan savollar (FAQ)

### 5. Statistika dashboardi (`/statistics`)
- Universitetlar bo'yicha talablar (bar chart)
- Kirish ballari (min/avg/max)
- Talabalar soni — animatsiya bilan yangilanuvchi raqamlar
- Top 3 tavsiya — AI reytingi asosida

### 6. AI Chat Widget
- Suhbat orqali savollarga javob olish
- Gemini AI va fallback knowledge base
- Onlayn javob berish

---

## Texnologiyalar

| Texnologiya | Vazifasi |
|-------------|----------|
| **React 19** | UI komponentlar |
| **Vite 8** | Dev server va build |
| **React Router 6** | Sahifalar navigatsiyasi |
| **Tailwind CSS 3** | Styling tizimi |
| **Google Gemini AI** | Sun'iy intellekt maslahatchi |
| **ESLint** | Kod sifatini nazorat qilish |

---

## O'rnatish

```bash
# 1. Respozitoriyani clone qilish
git clone https://github.com/username/eduUz.git

# 2. Papkaga kirish
cd eduUz

# 3. Qaramliklarni o'rnatish
npm install

# 4. Dev serverni ishga tushirish
npm run dev
```

---

## Buyruqlar

| Buyruq | Vazifasi |
|--------|----------|
| `npm run dev` | Development serverni ishga tushirish |
| `npm run build` | Production build yaratish |
| `npm run preview` | Build ni preview qilish |
| `npm run lint` | ESLint orqali kodni tekshirish |

---

## Loyiha tuzilishi

```
eduUz/
├── public/
│   └── api/
│       └── universities.json      # Universitetlar ma'lumotlari
├── src/
│   ├── ai/
│   │   ├── chatEngine.js           # AI chat mantiqi
│   │   ├── geminiService.js        # Gemini AI xizmati
│   │   └── knowledgeBase.js        # Bilimlar bazasi (fallback)
│   ├── components/
│   │   ├── ChatWidget.jsx          # AI chat widget
│   │   ├── Home.jsx                # Bosh sahifa
│   │   ├── Navbar.jsx              # Navigatsiya paneli
│   │   ├── SectionUniversity.jsx   # Universitetlar sahifasi
│   │   ├── SignInModal.jsx         # Kirish modali
│   │   ├── UniversityDetail.jsx    # Universitet tafsilotlari
│   │   └── pages/
│   │       ├── Admissions.jsx      # Qabul sahifasi
│   │       ├── Majors/
│   │       │   └── Majors.jsx      # Yo'nalishlar sahifasi
│   │       ├── Scholarships.jsx    # Grantlar sahifasi
│   │       └── Statistics.jsx      # Statistika dashboardi
│   ├── App.jsx                     # Asosiy路由 (Routes)
│   ├── index.css                   # Global stillar
│   └── main.jsx                    # Kirish nuqtasi
├── tailwind.config.js              # Tailwind konfiguratsiyasi
├── vite.config.js                  # Vite konfiguratsiyasi
└── package.json                    # Loyiha metadata
```

---

## Xususiyatlar

### Animatsiyalar
- `fade-in` — Paydo bo'lish
- `scale-in` — Masshtab o'zgarishi
- `slide-in-right` — O'ngdan sirg'alish
- `glow-pulse` — Nur pulsatsiyasi
- `gradient-shift` — Gradient rang o'zgarishi (violet → blue → red → green)

### Responsive dizayn
- Mobil (320px+)
- Planshet (768px+)
- Desktop (1024px+)
- Katta ekran (1284px+)

### AI integratsiyasi
- Google Gemini AI orqali javoblar
- Fallback — knowledge base dan javoblar
- Niyat aniqlash (solishtirish, taqqoslash, farq)
- Rekursiv javob berish

---

## API

Universitetlar ma'lumotlari `public/api/universities.json` faylida saqlanadi. Har bir universitet objekti:

```json
{
  "id": 1,
  "name": "INHA University in Tashkent",
  "city": "Toshkent",
  "category": "Xalqaro",
  "specialty": "IT va Texnologiya",
  "description": "Xalqaro universitet...",
  "image": "https://...",
  "badge": "Top",
  "badgeStyle": "bg-violet-500/20 text-violet-300 border border-violet-500/40",
  "rankLabel": "#1 Reyting",
  "isFeatured": true,
  "initial": "I"
}
```

---

## AI sozlash

Gemini AI ni ishlatish uchun `src/ai/geminiService.js` faylida API kalitni kiriting:

```javascript
const API_KEY = "SIZNING_API_KALITINGIZ";
```

Agar API kalit bo'lmasa, tizim avtomatik ravishda `knowledgeBase.js` dan foydalanadi.

---

## Litsenziya

© 2024 EduUZ. O'zbekiston kelajagini yuksalatiramiz.
