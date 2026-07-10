## 📚 مستندات کامل پروژه فرانت‌اند آهن‌مارکت

این مجموعه مستندات برای راه‌اندازی، توسعه و نگهداری پروژه فرانت‌اند آهن‌مارکت تهیه شده است. تمام فایل‌ها به صورت `Markdown` هستند و برای استفاده در Cursor، GitHub یا هر محیط دیگری آماده می‌باشند.

---

### 📁 لیست فایل‌های مستندات

| نام فایل | توضیح |
|----------|--------|
| `README.md` | معرفی کلی پروژه، تکنولوژی‌ها و راه‌اندازی |
| `PROJECT_STRUCTURE.md` | ساختار پوشه‌ها و معماری |
| `COMPONENT_CATALOG.md` | لیست کامل کامپوننت‌ها با Props و توضیحات |
| `ROUTING_GUIDE.md` | راهنمای مسیرها و ناوبری |
| `STATE_MANAGEMENT.md` | مدیریت وضعیت (سبد خرید، احراز هویت) |
| `DATA_MOCKS.md` | ساختار داده‌های نمونه |
| `STYLE_GUIDE.md` | اصول استایل‌دهی با Tailwind |
| `API_INTEGRATION.md` | نحوه اتصال به بک‌اند |
| `TODO.md` | لیست کارهای باقی‌مانده و اولویت‌ها |
| `MIGRATION_NEXTJS.md` | برنامه مهاجرت به Next.js |

---

### 🚀 فایل `README.md`

```markdown
# 🏗️ آهن‌مارکت - فروشگاه آنلاین آهن‌آلات

پلتفرم خرید و فروش آنلاین آهن‌آلات و محصولات فلزی با قابلیت مشاهده قیمت لحظه‌ای، ثبت سفارش و پیگیری.

## 🛠️ تکنولوژی‌ها

- **React 19** + **Vite** - کتابخانه و ابزار build
- **Tailwind CSS 3** - استایل‌دهی utility-first
- **React Router v7** - مسیریابی
- **FontAwesome** - آیکون‌ها
- **Swiper** - اسلایدر
- **vite-plugin-pwa** - قابلیت نصب به عنوان PWA

## 📦 نصب و راه‌اندازی

```bash
# کلون کردن پروژه
git clone <repository-url>
cd iron-market

# نصب وابستگی‌ها
npm install

# اجرا در محیط توسعه
npm run dev

# ساخت نسخه تولید
npm run build

# پیش‌نمایش نسخه تولید
npm run preview
```

## 📁 ساختار کلی

```
src/
├── components/     # کامپوننت‌های قابل استفاده مجدد
├── pages/          # صفحات اصلی (هر فایل یک صفحه)
├── layouts/        # چیدمان‌های اصلی (Header, Footer)
├── context/        # Context API (سبد خرید)
├── mock/           # داده‌های نمونه برای توسعه
├── hooks/          # Hookهای سفارشی (فعلاً خالی)
└── services/       # سرویس‌های ارتباط با API (فعلاً خالی)
```

## 🔗 مسیرهای اصلی

| مسیر | صفحه | توضیح |
|------|------|--------|
| `/` | HomePage | صفحه اصلی با اسلایدر، دسته‌بندی و قیمت‌ها |
| `/products` | ProductsPage | لیست محصولات |
| `/products/:id` | ProductDetailPage | جزئیات محصول |
| `/articles` | ArticlesPage | لیست مقالات |
| `/articles/:id` | ArticleDetailPage | متن کامل مقاله |
| `/cart` | CartPage | سبد خرید |
| `/checkout` | CheckoutPage | تسویه حساب |
| `/login` | LoginPage | ورود |
| `/register` | RegisterPage | ثبت‌نام |
| `/profile` | ProfilePage | پروفایل کاربر |
| `/about` | AboutPage | درباره ما |
| `/contact` | ContactPage | تماس با ما |

## 👥 تیم توسعه

- **طراح و توسعه‌دهنده اصلی**: [نام شما]
- **برنامه‌نویس بک‌اند**: [در حال تکمیل]

## 📄 مجوز

تمام حقوق محفوظ است.
```

---

### 🗂️ فایل `PROJECT_STRUCTURE.md`

```markdown
# 📂 ساختار پروژه آهن‌مارکت

## پوشه‌ها و نقش آنها

```
iron-market/
├── public/
│   ├── icons/                 # آیکون‌های PWA
│   ├── favicon.ico            # آیکون مرورگر
│   └── robots.txt             # راهنمای خزنده‌های گوگل
│
├── src/
│   ├── components/
│   │   ├── Header.jsx         # ارکستراتور اصلی هدر
│   │   ├── TopBar.jsx         # ردیف اول هدر دسکتاپ (لوگو، سرچ، دکمه‌ها)
│   │   ├── NavMenu.jsx        # ردیف دوم هدر دسکتاپ (منوهای dropdown)
│   │   ├── PriceDropdown.jsx  # دراپ‌داون قیمت روز محصولات (دو ستونی)
│   │   ├── WeightCalcDropdown.jsx # دراپ‌داون جدول وزن
│   │   ├── MobileHeader.jsx   # هدر موبایل (همبرگر، لوگو، آیکون کاربر)
│   │   ├── MobileMenu.jsx     # منوی کشویی موبایل با آکاردئون
│   │   ├── MobileFooter.jsx   # نوار پایین موبایل (۵ دکمه)
│   │   ├── Footer.jsx         # فوتر دسکتاپ (۴ ستونه)
│   │   ├── HeroSlider.jsx     # اسلایدر صفحه اصلی
│   │   ├── CategoryGrid.jsx   # دسته‌بندی محصولات
│   │   ├── PriceTable.jsx     # جدول قیمت آهن‌آلات
│   │   ├── UserJourney.jsx    # مراحل خرید
│   │   ├── TeamSection.jsx    # اعضای تیم
│   │   ├── ArticleCards.jsx   # مقالات صفحه اصلی
│   │   ├── ExpandableText.jsx # متن جمع‌شونده درباره شرکت
│   │   └── ConsultationModal.jsx # مودال درخواست مشاوره
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── ArticlesPage.jsx
│   │   ├── ArticleDetailPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   └── ProfilePage.jsx
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx     # قالب اصلی با هدر، فوتر و فوتر موبایل
│   │
│   ├── context/
│   │   └── CartContext.jsx    # مدیریت سبد خرید با localStorage
│   │
│   ├── mock/
│   │   ├── categoriesData.js  # داده‌های دسته‌بندی تودرتو
│   │   └── weightCalcData.js  # آیتم‌های محاسبه وزن
│   │
│   ├── hooks/                 # (فعلاً خالی - برای توسعه آینده)
│   ├── services/              # (فعلاً خالی - برای اتصال به API)
│   │
│   ├── App.jsx                # کامپوننت اصلی و مسیریابی
│   ├── main.jsx               # نقطه ورود برنامه
│   └── index.css              # استایل‌های سراسری و Tailwind
│
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🔄 جریان داده‌ها

1. **صفحات** از `mock` داده‌ها را دریافت کرده و به **کامپوننت‌ها** پاس می‌دهند.
2. **کامپوننت‌ها** فقط داده‌های دریافتی را نمایش می‌دهند و رویدادها را به بالا ارسال می‌کنند.
3. **`CartContext`** وضعیت سبد خرید را مدیریت کرده و در `localStorage` ذخیره می‌کند.
4. **`MainLayout`** مسئول نمایش `Header`، `Footer` و `MobileFooter` است.
```

---

### 🧩 فایل `COMPONENT_CATALOG.md`

```markdown
# 📦 کاتالوگ کامپوننت‌ها

## کامپوننت‌های عمومی

### `Header.jsx`
**مسیر:** `src/components/Header.jsx`  
**توضیح:** ارکستراتور اصلی هدر که بین دسکتاپ و موبایل تصمیم‌گیری می‌کند.  
**Props:** ندارد  
**وضعیت:** با `useState` برای `isModalOpen` و `isMobileMenuOpen`

---

### `TopBar.jsx`
**مسیر:** `src/components/TopBar.jsx`  
**توضیح:** ردیف اول هدر در دسکتاپ. شامل لوگو، سرچ، دکمه‌های ورود و مشاوره.  
**Props:**
| Prop | نوع | توضیح |
|------|------|--------|
| `onConsultationClick` | `function` | تابع باز کردن مودال مشاوره |
**وضعیت:** بدون وضعیت (Stateless)

---

### `NavMenu.jsx`
**مسیر:** `src/components/NavMenu.jsx`  
**توضیح:** ردیف دوم هدر در دسکتاپ. شامل منوهای `PriceDropdown`، `WeightCalcDropdown` و `About`.  
**Props:** ندارد  
**وضعیت:** بدون وضعیت (Stateless)

---

### `PriceDropdown.jsx`
**مسیر:** `src/components/PriceDropdown.jsx`  
**توضیح:** دراپ‌داون قیمت روز محصولات با دو ستون و نمایش درخت کامل.  
**Props:** ندارد  
**داده:** از `categoriesData` استفاده می‌کند.  
**وضعیت:** `useState` برای `activeCategory`

---

### `MobileHeader.jsx`
**مسیر:** `src/components/MobileHeader.jsx`  
**توضیح:** هدر موبایل شامل دکمه همبرگر، لوگو و آیکون کاربر.  
**Props:**
| Prop | نوع | توضیح |
|------|------|--------|
| `onMenuClick` | `function` | تابع باز کردن منوی موبایل |
**وضعیت:** `useState` برای `isLoggedIn` (از `localStorage`)

---

### `MobileMenu.jsx`
**مسیر:** `src/components/MobileMenu.jsx`  
**توضیح:** منوی کشویی موبایل با آکاردئون و قابلیت باز/بسته شدن سطوح مختلف.  
**Props:**
| Prop | نوع | توضیح |
|------|------|--------|
| `isOpen` | `boolean` | وضعیت باز بودن منو |
| `onClose` | `function` | تابع بستن منو |
**وضعیت:** `useState` برای `openMainCategoryId`، `isWeightCalcOpen`، `isAboutOpen`

---

### `MobileFooter.jsx`
**مسیر:** `src/components/MobileFooter.jsx`  
**توضیح:** نوار پایین موبایل با ۵ دکمه: خانه، اپلیکیشن، تماس، درباره ما، سبد خرید.  
**Props:** ندارد  
**وضعیت:** بدون وضعیت (Stateless)

---

### `Footer.jsx`
**مسیر:** `src/components/Footer.jsx`  
**توضیح:** فوتر دسکتاپ با ۴ ستون (لوگو، دسترسی سریع، محصولات، نمادها و شبکه‌های اجتماعی).  
**Props:** ندارد  
**وضعیت:** بدون وضعیت (Stateless)

---

### `ConsultationModal.jsx`
**مسیر:** `src/components/ConsultationModal.jsx`  
**توضیح:** مودال درخواست مشاوره با فرم (نام، تلفن، توضیحات).  
**Props:**
| Prop | نوع | توضیح |
|------|------|--------|
| `isOpen` | `boolean` | وضعیت باز بودن مودال |
| `onClose` | `function` | تابع بستن مودال |
**وضعیت:** `useState` برای `formData`

---

## کامپوننت‌های صفحه اصلی (HomePage)

### `HeroSlider.jsx`
**توضیح:** اسلایدر با ۳ بنر و قابلیت autoplay.  
**داده:** ۳ آیتم mock با `title`، `subtitle` و `image`.

### `CategoryGrid.jsx`
**توضیح:** نمایش ۸ دسته‌بندی به صورت گرید.  
**داده:** `categories` با `id`, `name`, `icon`, `count`.

### `PriceTable.jsx`
**توضیح:** جدول قیمت آهن‌آلات (دسکتاپ: جدول، موبایل: کارت).  
**داده:** `mockPrices` با `id`, `product`, `size`, `grade`, `loadingPlace`, `type`, `price`, `trend`.

### `UserJourney.jsx`
**توضیح:** نمایش ۶ مرحله خرید به صورت کارت‌های افقی.  
**داده:** `steps` با `id`, `title`, `description`, `icon`.

### `TeamSection.jsx`
**توضیح:** نمایش ۴ کارت از اعضای تیم.  
**داده:** `teamMembers` با `name`, `role`, `image`.

### `ArticleCards.jsx`
**توضیح:** نمایش ۳ مقاله در صفحه اصلی با دکمه «مشاهده همه».  
**داده:** `articles` با `id`, `title`, `summary`, `image`, `date`.

### `ExpandableText.jsx`
**توضیح:** متن جمع‌شونده درباره شرکت با دکمه «بیشتر/بستن».  
**وضعیت:** `useState` برای `isExpanded`
```

---

### 🧭 فایل `ROUTING_GUIDE.md`

```markdown
# 🧭 راهنمای مسیریابی (Routing)

## ساختار مسیرها

```jsx
<Route path="/" element={<MainLayout />}>
  <Route index element={<HomePage />} />
  <Route path="login" element={<LoginPage />} />
  <Route path="register" element={<RegisterPage />} />
  <Route path="products" element={<ProductsPage />} />
  <Route path="products/:id" element={<ProductDetailPage />} />
  <Route path="articles" element={<ArticlesPage />} />
  <Route path="articles/:id" element={<ArticleDetailPage />} />
  <Route path="about" element={<AboutPage />} />
  <Route path="contact" element={<ContactPage />} />
  <Route path="cart" element={<CartPage />} />
  <Route path="checkout" element={<CheckoutPage />} />
  <Route path="profile" element={<ProfilePage />} />
</Route>
```

## مسیرهای پویا (Dynamic Routes)

| مسیر | پارامتر | صفحه | توضیح |
|------|---------|------|--------|
| `/products/:id` | `id` | ProductDetailPage | نمایش جزئیات محصول با شناسه `id` |
| `/articles/:id` | `id` | ArticleDetailPage | نمایش متن کامل مقاله با شناسه `id` |

## مسیرهای ویژه

| مسیر | توضیح |
|------|--------|
| `/` | صفحه اصلی (پیش‌فرض) |
| `*` | (فعلاً تعریف نشده - باید صفحه 404 بسازیم) |

## لینک‌های اصلی در ناوبری

### دسکتاپ
- **قیمت روز محصولات** → دراپ‌داون با زیرمجموعه‌ها (`/product-category/{slug}`)
- **مقالات** → `/articles`
- **جدول و محاسبه وزن** → دراپ‌داون با آیتم‌ها (`/weight-calc/{slug}`)
- **درباره ما** → دراپ‌داون: درباره ما (`/about`)، تماس با ما (`/contact`)
- **شماره تماس** → `tel:02112345678`

### موبایل (منوی همبرگری)
- **قیمت روز محصولات** → آکاردئون با زیرمجموعه‌ها
- **مقالات** → `/articles`
- **جدول و محاسبه وزن** → آکاردئون با آیتم‌ها
- **درباره ما** → آکاردئون: درباره ما (`/about`)، تماس با ما (`/contact`)

### فوتر موبایل (نوار پایین)
- **خانه** → `/`
- **اپلیکیشن** → `/app` (فعلاً خالی)
- **تماس** → `tel:02112345678`
- **درباره ما** → `/about`
- **سبد خرید** → `/cart`
```

---

### 📊 فایل `STATE_MANAGEMENT.md`

```markdown
# 📊 مدیریت وضعیت (State Management)

## ۱. سبد خرید (CartContext)

**مسیر:** `src/context/CartContext.jsx`

### Provider
```jsx
<CartProvider>
  <App />
</CartProvider>
```

### Hook سفارشی
```jsx
const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();
```

### توابع و کاربرد

| تابع | پارامترها | توضیح |
|------|-----------|--------|
| `addToCart` | `(product, quantity = 1)` | افزودن محصول به سبد خرید. اگر محصول موجود باشد، تعداد افزایش می‌یابد. |
| `removeFromCart` | `(productId)` | حذف کامل محصول از سبد خرید. |
| `updateQuantity` | `(productId, newQuantity)` | تغییر تعداد محصول. اگر `newQuantity` صفر یا کمتر باشد، محصول حذف می‌شود. |
| `getTotalPrice` | `()` | محاسبه جمع کل قیمت (با تبدیل ارقام فارسی به انگلیسی). |
| `getTotalItems` | `()` | محاسبه تعداد کل اقلام در سبد خرید. |
| `clearCart` | `()` | خالی کردن کامل سبد خرید. |

### ذخیره‌سازی در localStorage
- کلید: `'cart'`
- مقدار: آرایه‌ای از اشیاء محصول با فیلد `quantity`

### ساختار هر آیتم در سبد خرید
```javascript
{
  id: 1,
  name: 'تیرآهن ۱۴',
  price: '۲۳,۵۰۰,۰۰۰',
  image: 'https://...',
  size: '۱۴',
  grade: 'ST37',
  loadingPlace: 'اهواز',
  type: 'کارخانه',
  brand: 'ذوب آهن',
  description: '...',
  quantity: 2  // اضافه شده توسط Context
}
```

---

## ۲. احراز هویت (Auth)

در حال حاضر پیاده‌سازی ساده با `localStorage` انجام شده است.

### ذخیره‌سازی
- کلید: `'user'`
- مقدار: JSON شامل اطلاعات کاربر (مثلاً `{ name: 'کاربر تست' }`)

### بررسی وضعیت ورود
```javascript
const isLoggedIn = !!localStorage.getItem('user');
```

### شبیه‌سازی ورود (در LoginPage)
```javascript
localStorage.setItem('user', JSON.stringify({ name: 'کاربر تست' }));
```

### شبیه‌سازی خروج
```javascript
localStorage.removeItem('user');
```

### در آینده
پس از اتصال به API، این بخش با `AuthContext` واقعی و توکن‌های JWT جایگزین خواهد شد.
```

---

### 📦 فایل `DATA_MOCKS.md`

```markdown
# 📦 داده‌های نمونه (Mock Data)

## ۱. دسته‌بندی قیمت روز محصولات

**مسیر:** `src/mock/categoriesData.js`

### ساختار کلی
```javascript
export const categoriesData = [
  {
    id: 1,
    name: 'میلگرد',
    slug: 'rebar',
    children: [
      { name: 'میلگرد آجدار', slug: 'rebar-ridged', children: [] },
      { name: 'میلگرد آلومینیوم', slug: 'aluminum-rebar', children: [] },
      {
        name: 'سایز میلگرد',
        slug: 'rebar-size',
        children: [
          { name: 'میلگرد 8', slug: 'rebar-8mm', children: [] },
          { name: 'میلگرد 12', slug: 'rebar-12mm', children: [] }
        ]
      }
    ]
  },
  // ... سایر دسته‌ها
];
```

### توضیح فیلدها
| فیلد | نوع | توضیح |
|------|------|--------|
| `id` | `number` | شناسه یکتا |
| `name` | `string` | عنوان نمایشی |
| `slug` | `string` | شناسه متنی برای لینک‌ها |
| `children` | `array` | زیرمجموعه‌ها (می‌تواند خالی باشد) |

### کاربرد
- **دسکتاپ**: در `PriceDropdown` برای نمایش درخت کامل دسته‌بندی
- **موبایل**: در `MobileMenu` برای نمایش آکاردئونی

---

## ۲. آیتم‌های محاسبه وزن

**مسیر:** `src/mock/weightCalcData.js`

```javascript
export const weightCalcData = [
  { name: 'میلگرد', slug: 'rebar' },
  { name: 'پروفیل', slug: 'profile' },
  { name: 'لوله', slug: 'pipe' },
  { name: 'ورق', slug: 'sheet' },
  { name: 'تیرآهن', slug: 'beam' },
  { name: 'نبشی', slug: 'angle' },
  { name: 'ناودانی', slug: 'channel' },
];
```

---

## ۳. داده‌های صفحات دیگر

### محصولات (ProductsPage)
- در `ProductsPage.jsx` به عنوان `mockProducts` تعریف شده است.
- شامل: `id`, `name`, `size`, `price`, `brand`, `image`

### جدول قیمت (PriceTable)
- در `PriceTable.jsx` به عنوان `mockPrices` تعریف شده است.
- شامل: `id`, `product`, `size`, `grade`, `loadingPlace`, `type`, `price`, `trend`

### مقالات (Articles)
- در `ArticlesPage.jsx` و `ArticleDetailPage.jsx` تعریف شده است.
- شامل: `id`, `title`, `summary`, `image`, `date`, `author`, `content`, `comments`

### اعضای تیم (TeamSection)
- در `TeamSection.jsx` تعریف شده است.
- شامل: `id`, `name`, `role`, `image`

### مراحل خرید (UserJourney)
- در `UserJourney.jsx` تعریف شده است.
- شامل: `id`, `title`, `description`, `icon`
```

---

### 🎨 فایل `STYLE_GUIDE.md`

```markdown
# 🎨 راهنمای استایل‌دهی (Style Guide)

## ۱. اصول کلی

- استفاده از **Tailwind CSS** برای تمام استایل‌ها
- اولویت با کلاس‌های utility
- پرهیز از CSS سفارشی مگر در موارد ضروری

## ۲. رنگ‌های اصلی

| کاربرد | کلاس Tailwind | رنگ Hex |
|--------|---------------|---------|
| اصلی برند | `blue-600` | #2563eb |
| هاور اصلی | `blue-700` | #1d4ed8 |
| پس‌زمینه صفحات | `bg-gray-100` | #f3f4f6 |
| کارت‌ها و باکس‌ها | `bg-white` | #ffffff |
| متن اصلی | `text-gray-800` | #1f2937 |
| متن فرعی | `text-gray-600` | #4b5563 |
| متن کم‌رنگ | `text-gray-500` | #6b7280 |
| مرزها | `border-gray-200` | #e5e7eb |

## ۳. فاصله‌ها (Spacing)

- **فضای داخلی (Padding)**: `p-4` (1rem) برای اکثر بخش‌ها
- **فضای خارجی (Margin)**: `mb-4`, `gap-4` برای فاصله بین المان‌ها
- **فضای منفی**: `-mt-6` برای آیکون وسط فوتر موبایل

## ۴. تایپوگرافی

### فونت‌ها
- سیستم‌فونت پیش‌فرض: `font-sans` (بدون فونت خاص)
- **در آینده**: اضافه کردن فونت Vazir یا IranSans

### اندازه‌های متن
| کاربرد | کلاس | اندازه |
|--------|------|--------|
| عنوان اصلی صفحه | `text-2xl md:text-3xl` | 1.5rem - 1.875rem |
| عنوان بخش | `text-xl` | 1.25rem |
| متن معمولی | `text-base` | 1rem |
| متن کوچک | `text-sm` | 0.875rem |

## ۵. ریسپانسیو (Responsive)

| اندازه صفحه | کلاس پیشوند | توضیح |
|-------------|-------------|--------|
| موبایل | (پیشوند ندارد) | کمتر از 768px |
| تبلت | `md:` | 768px تا 1024px |
| دسکتاپ | `lg:` | بیشتر از 1024px |

### مثال‌ها
```jsx
// نمایش در موبایل مخفی، در دسکتاپ نمایش داده شود
<div className="hidden md:block">...</div>

// ۲ ستون در موبایل، ۴ ستون در دسکتاپ
<div className="grid grid-cols-2 md:grid-cols-4">...</div>
```

## ۶. راست‌چینی (RTL)

کل پروژه با `direction: rtl` در `index.css` راست‌چین شده است.

### نکات مهم
- برای فاصله‌گذاری از `ml-*` و `mr-*` (به جای `left` و `right`) استفاده شود.
- برای چسباندن به سمت راست از کلاس‌های `right-*` و `text-right` استفاده شود.
- آیکون‌های فلش (`faChevronLeft` / `faChevronRight`) باید با توجه به راست‌چینی انتخاب شوند.

## ۷. انیمیشن‌ها

| کاربرد | کلاس‌ها | توضیح |
|--------|---------|--------|
| تغییر opacity | `transition-opacity duration-300` | برای پس‌زمینه مات |
| تغییر transform | `transition-transform duration-300` | برای منوی کشویی |
| هاور کارت‌ها | `hover:shadow-lg transition-shadow` | برای کارت‌های محصولات |

## ۸. المان‌های پرتکرار

### دکمه‌ها
```jsx
// دکمه اصلی (Primary)
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
  متن دکمه
</button>

// دکمه با حاشیه (Outline)
<button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
  متن دکمه
</button>
```

### کارت‌ها
```jsx
<div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
  {/* محتوا */}
</div>
```

### ورودی‌ها (Inputs)
```jsx
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
/>
```
```

---

### 🔌 فایل `API_INTEGRATION.md`

```markdown
# 🔌 راهنمای اتصال به بک‌اند (API Integration)

## ۱. معماری فعلی (Mock)

همه داده‌ها در حال حاضر از فایل‌های `mock` تأمین می‌شوند. این داده‌ها در کامپوننت‌ها یا صفحات به صورت مستقیم تعریف شده‌اند.

## ۲. برنامه اتصال به API

### مرحله اول: نصب Axios
```bash
npm install axios
```

### مرحله دوم: ایجاد سرویس API

**مسیر پیشنهادی:** `src/services/api.js`

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.ironmarket.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor برای افزودن توکن احراز هویت
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### مرحله سوم: ایجاد سرویس‌های اختصاصی

**مسیر پیشنهادی:** `src/services/productService.js`

```javascript
import api from './api';

export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/categories'),
  search: (query) => api.get('/products/search', { params: { q: query } }),
};
```

## ۳. لیست اندپوینت‌های مورد نیاز از بک‌اند

| متد | مسیر | توضیح | وضعیت |
|------|------|--------|--------|
| GET | `/api/categories` | دریافت دسته‌بندی‌ها (برای PriceDropdown) | 🟡 Mock |
| GET | `/api/products` | دریافت لیست محصولات | 🟡 Mock |
| GET | `/api/products/:id` | دریافت جزئیات محصول | 🟡 Mock |
| GET | `/api/prices` | دریافت قیمت لحظه‌ای | 🟡 Mock |
| GET | `/api/articles` | دریافت لیست مقالات | 🟡 Mock |
| GET | `/api/articles/:id` | دریافت متن مقاله | 🟡 Mock |
| POST | `/api/auth/login` | ورود کاربر | 🟡 Mock |
| POST | `/api/auth/register` | ثبت‌نام کاربر | 🟡 Mock |
| GET | `/api/user/profile` | دریافت اطلاعات پروفایل | 🟡 Mock |
| POST | `/api/orders` | ثبت سفارش جدید | 🟡 Mock |
| POST | `/api/consultation` | ثبت درخواست مشاوره | 🟡 Mock |
| GET | `/api/weight-calc/:slug` | دریافت اطلاعات وزن | 🟡 Mock |

## ۴. مدیریت خطاها (Error Handling)

```javascript
try {
  const response = await api.get('/products');
  // پردازش داده‌ها
} catch (error) {
  if (error.response) {
    // خطا از سمت سرور
    console.error('Server Error:', error.response.data);
  } else if (error.request) {
    // درخواست ارسال نشده
    console.error('Network Error:', error.request);
  } else {
    // خطای دیگر
    console.error('Error:', error.message);
  }
}
```

## ۵. متغیرهای محیطی (Environment Variables)

فایل `.env` در ریشه پروژه:

```env
VITE_API_BASE_URL=https://api.ironmarket.com
VITE_API_KEY=your-api-key
```

## ۶. اتصال به SignalR (برای قیمت‌های لحظه‌ای)

برای دریافت قیمت‌های لحظه‌ای، از SignalR استفاده می‌شود:

```javascript
import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${API_BASE_URL}/pricesHub`)
  .build();

connection.on('PriceUpdated', (data) => {
  // به‌روزرسانی قیمت‌ها
});

await connection.start();
```

## ۷. گام‌های مهاجرت از Mock به API

1. ایجاد `services` و `api.js`
2. جایگزینی داده‌های `mock` با فراخوانی‌های `api` در صفحات
3. تست هر صفحه به صورت مجزا
4. اضافه کردن `loading` و `error` stateها
5. حذف تدریجی فایل‌های `mock`
```

---

### ✅ فایل `TODO.md`

```markdown
# ✅ لیست کارهای باقی‌مانده (TODO)

## اولویت بالا (High Priority)

- [ ] **اتصال به API** - جایگزینی داده‌های mock با درخواست‌های واقعی
- [ ] **تکمیل احراز هویت** - پیاده‌سازی `AuthContext` با JWT و محافظت از مسیرها
- [ ] **رفع خطای NaN در قیمت‌ها** - اطمینان از تبدیل صحیح ارقام فارسی

## اولویت متوسط (Medium Priority)

- [ ] **صفحات خالی** - ساخت `/app` و `/weight-calc/:slug`
- [ ] **جستجو** - پیاده‌سازی عملکرد واقعی در هدر
- [ ] **مودال مشاوره** - اتصال به API برای ثبت درخواست
- [ ] **صفحه 404** - ایجاد صفحه Not Found

## اولویت پایین (Low Priority)

- [ ] **فونت فارسی** - اضافه کردن Vazir یا IranSans
- [ ] **تصاویر واقعی** - جایگزینی placeholderها با تصاویر واقعی
- [ ] **PWA کامل** - آیکون‌های واقعی و تنظیم کش آفلاین
- [ ] **بهبود انیمیشن‌ها** - افزودن انیمیشن‌های ورود و خروج
- [ ] **تست‌ها** - نوشتن تست‌های واحد و یکپارچه‌سازی

## ویژگی‌های آینده (Future)

- [ ] **بخش ادمین** - مدیریت کاربران، محصولات و سفارشات
- [ ] **پرداخت آنلاین** - اتصال به درگاه پرداخت
- [ ] **کامنت‌های واقعی** - اتصال به API برای مقالات
- [ ] **سیگنال‌ها (SignalR)** - قیمت‌های لحظه‌ای

---

## وضعیت فعلی

| بخش | وضعیت | توضیح |
|------|--------|--------|
| هدر دسکتاپ | ✅ کامل | دو ردیفه با dropdown و شماره تماس |
| هدر موبایل | ✅ کامل | همبرگر، لوگو، آیکون کاربر |
| منوی موبایل | ✅ کامل | آکاردئون با سطوح تو در تو |
| فوتر دسکتاپ | ✅ کامل | ۴ ستونه |
| فوتر موبایل | ✅ کامل | ۵ دکمه |
| صفحه اصلی | ✅ کامل | اسلایدر، دسته‌بندی، جدول قیمت، ... |
| صفحات محصولات | ✅ کامل | لیست و جزئیات |
| صفحات مقالات | ✅ کامل | لیست و جزئیات با کامنت |
| سبد خرید | ✅ کامل | Context + localStorage |
| تسویه حساب | ✅ کامل | فرم اطلاعات ارسال |
| احراز هویت | 🟡 موقت | فقط localStorage |
| PWA | 🟡 ناقص | فقط manifest اولیه |
| API | 🔴 ندارد | همه داده‌ها mock |
```

---

### 🚀 فایل `MIGRATION_NEXTJS.md`

```markdown
# 🚀 برنامه مهاجرت به Next.js

## چرا Next.js؟

- **سئو بهتر** - رندر سمت سرور (SSR) و تولید صفحات استاتیک (SSG)
- **عملکرد بالاتر** - بهینه‌سازی خودکار تصاویر، فونت‌ها و bundle
- **تجربه توسعه بهتر** - مسیریابی مبتنی بر فایل، API Routes

## گام‌های مهاجرت

### فاز ۱: آماده‌سازی
| گام | توضیح | وضعیت |
|------|--------|--------|
| ۱.۱ | Commit نهایی در گیت و برچسب‌گذاری | ⬜ |
| ۱.۲ | گرفتن خروجی از داده‌های mock | ⬜ |
| ۱.۳ | مستندسازی وابستگی‌ها | ⬜ |

### فاز ۲: راه‌اندازی Next.js
| گام | توضیح | وضعیت |
|------|--------|--------|
| ۲.۱ | `npx create-next-app@latest iron-market-next --app` | ⬜ |
| ۲.۲ | نصب Tailwind CSS | ⬜ |
| ۲.۳ | کپی `public` و `components` ساده | ⬜ |
| ۲.۴ | تست اجرای اولیه | ⬜ |

### فاز ۳: انتقال Layout اصلی
| گام | توضیح | وضعیت |
|------|--------|--------|
| ۳.۱ | انتقال `Header` به `app/layout.js` | ⬜ |
| ۳.۲ | انتقال `Footer` به `app/layout.js` | ⬜ |
| ۳.۳ | تنظیم `MobileFooter` به صورت شرطی | ⬜ |

### فاز ۴: انتقال صفحات
| گام | توضیح | وضعیت |
|------|--------|--------|
| ۴.۱ | صفحات استاتیک (درباره ما، تماس با ما) | ⬜ |
| ۴.۲ | صفحات لیست (محصولات، مقالات) | ⬜ |
| ۴.۳ | صفحات پویا (جزئیات محصول و مقاله) با `generateStaticParams` | ⬜ |
| ۴.۴ | صفحات کاربری (ورود، ثبت‌نام، پروفایل، تسویه) با `'use client'` | ⬜ |
| ۴.۵ | سبد خرید (CartContext) با `'use client'` | ⬜ |

### فاز ۵: بهینه‌سازی سئو
| گام | توضیح | وضعیت |
|------|--------|--------|
| ۵.۱ | تنظیم `metadata` در `layout.js` | ⬜ |
| ۵.۲ | پیاده‌سازی `generateMetadata` برای صفحات پویا | ⬜ |
| ۵.۳ | ساخت `sitemap.js` | ⬜ |
| ۵.۴ | افزودن `robots.txt` | ⬜ |

### فاز ۶: بهبود عملکرد
| گام | توضیح | وضعیت |
|------|--------|--------|
| ۶.۱ | جایگزینی `<img>` با `next/image` | ⬜ |
| ۶.۲ | تنظیم `priority` برای LCP | ⬜ |
| ۶.۳ | استفاده از `next/font` برای فونت‌ها | ⬜ |

### فاز ۷: استقرار
| گام | توضیح | وضعیت |
|------|--------|--------|
| ۷.۱ | اتصال مخزن گیت به Vercel | ⬜ |
| ۷.۲ | تنظیم متغیرهای محیطی | ⬜ |
| ۷.۳ | تست دامنه و SSL | ⬜ |

## نکات کلیدی

1. **App Router**: از جدیدترین معماری Next.js استفاده می‌شود.
2. **`'use client'`**: برای کامپوننت‌های تعاملی که از `useState`, `useEffect`, `useContext` استفاده می‌کنند.
3. **SSG vs SSR**: صفحات استاتیک (درباره ما، تماس با ما) به صورت SSG، صفحات پویا (جزئیات محصول) با SSG و ISR، قیمت‌ها با SSR.
4. **API Routes**: برای پراکسی کردن درخواست‌ها به بک‌اند ASP.NET Core.
```

---

## 📌 نتیجه‌گیری

این ۱۰ فایل مستندات کامل پروژه آهن‌مارکت را پوشش می‌دهند. با استفاده از این مستندات، هر توسعه‌دهنده‌ای (یا هوش مصنوعی مثل Cursor) می‌تواند به سرعت با پروژه آشنا شده و آن را ادامه دهد.