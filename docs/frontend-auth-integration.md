# انتگریت فرانت با UserModule (لاگین و حساب)

> مخاطب: تیم React برای OTP مشتری، JWT، پروفایل، آدرس تحویل و ورود ادمین.  
> Base URL توسعه: `http://localhost:5062` · Swagger: `/swagger`  
> قرارداد کلی API: [`frontend-integration.md`](frontend-integration.md) (§۲ اتصال، §۳ `OperationResult`)  
> همهٔ فیلدها **camelCase** هستند.

این سند فقط **احراز هویت + پورتال مشتری (`/api/user/me`)** است. سبد/سفارش در سند اصلی؛ کاتالوگ در [`frontend-catalog-integration.md`](frontend-catalog-integration.md).

---

## ۱. مدل ذهنی

| نقش | ورود | JWT Role | کاربرد فرانت |
|---|---|---|---|
| **مشتری** | OTP موبایل | `Customer` | خرید، پروفایل، آدرس، سفارش‌ها |
| **ادمین** | username/password | `Admin` | پنل CMS / سفارش‌های ادمین |

```
موبایل → POST /api/user/auth/otp/send → کد ۵ رقمی
       → POST /api/user/auth/otp/verify → accessToken + isProfileComplete
       → اگر پروفایل ناقص: POST /api/user/me/profile
       → آدرس تحویل: POST /api/user/me/addresses
       → آمادهٔ checkout
```

**ذخیرهٔ توکن:** `localStorage` یا cookie امن — هدر: `Authorization: Bearer <accessToken>`.  
عمر JWT حدود **۷ روز** (`Jwt:ExpiryMinutes = 10080`). Refresh token وجود ندارد؛ بعد از انقضا دوباره OTP.

---

## ۲. مسیرهای پیشنهادی فرانت

| صفحه | Route | JWT | API |
|---|---|---|---|
| ورود OTP | `/auth` | خیر | `otp/send` → `otp/verify` |
| تکمیل پروفایل | `/me/profile` (گارد) | Customer | `POST /api/user/me/profile` |
| ویرایش پروفایل | `/me/profile` | Customer | `GET /api/user/me` + `PUT /api/user/me/profile` |
| آدرس‌ها | `/me/addresses` | Customer | CRUD `/api/user/me/addresses` |
| حساب من (خلاصه) | `/me` | Customer | `GET /api/user/me` |
| ورود ادمین | `/admin/login` | خیر | `POST /api/user/auth/admin/login` |

### گاردهای پیشنهادی

1. **`RequireAuth`:** بدون توکن → `/auth?returnUrl=...`
2. **`RequireProfile`:** `isProfileComplete === false` → `/me/profile`
3. **`RequireAddress` (قبل از checkout):** حداقل یک آدرس تحویل
4. روی **HTTP 401** از هر API محافظت‌شده → پاک کردن توکن → `/auth`

---

## ۳. OTP مشتری

### ۳.۱ ارسال کد

```http
POST /api/user/auth/otp/send
Content-Type: application/json

{ "phoneNumber": "09121234567" }
```

| قانون | مقدار |
|---|---|
| فرمت | موبایل ایران `09xxxxxxxxx` (۱۱ رقم) |
| نرمال‌سازی بک‌اند | `+98…` و `98…` → `09…`؛ فاصله/خط تیره حذف |
| طول کد | **۵ رقم** |
| اعتبار کد | **۲ دقیقه** (`Otp:ExpiryMinutes`) |
| Cooldown ارسال مجدد | **۶۰ ثانیه** → HTTP/body Conflict |
| `debugCode` | فقط Development وقتی `Otp:ExposeCodeInResponse=true` |

پاسخ موفق (`result`):

```ts
type SendOtpResponse = {
  success: boolean;
  expiresAt: string;      // ISO UTC
  debugCode?: string | null; // فقط Dev — در UI نمایش دهید برای تست
};
```

خطاهای رایج:

| پیام / وضعیت | علت |
|---|---|
| فرمت شماره نامعتبر | شماره خالی یا غیر `09…` |
| `لطفاً ۶۰ ثانیه صبر کنید و دوباره تلاش کنید.` | Conflict — تایمر UI روی ۶۰ث |

### ۳.۲ تأیید و ورود

```http
POST /api/user/auth/otp/verify
Content-Type: application/json

{ "phoneNumber": "09121234567", "code": "12345" }
```

```ts
type VerifyOtpResponse = {
  userId: string;
  isNewUser: boolean;          // اولین بار این شماره
  isProfileComplete: boolean;  // آیا UserProfile دارد
  accessToken: string;         // JWT با role=Customer
};
```

بعد از verify:

1. `accessToken` را ذخیره کنید.
2. اگر `isProfileComplete === false` → redirect به تکمیل پروفایل (حتی اگر `isNewUser` نباشد — مثل seed `09121111111`).
3. در غیر این صورت → `returnUrl` یا `/me` / checkout.
4. اختیاری: بلافاصله `GET /api/user/me` برای hydrate کردن store.

خطا: `کد تأیید نامعتبر یا منقضی شده است.`

### ۳.۳ الگوی UI دو مرحله‌ای

```
[1] شماره موبایل + دکمه «ارسال کد»
      → countdown ۶۰ث برای «ارسال مجدد»
      → در Dev: نشان دادن debugCode (toast/banner)
[2] ورودی ۵ رقمی + «ورود»
      → اگر expiresAt گذشته: پیام انقضا + برگشت به مرحله ۱
```

شماره را بین دو مرحله نگه دارید؛ در verify همان `phoneNumber` نرمال‌شده را بفرستید.

---

## ۴. کاربران seed (Dev)

اگر جدول Users خالی باشد روی startup ساخته می‌شوند. OTP بفرستید → از `debugCode` استفاده کنید → verify:

| موبایل | بعد از verify |
|---|---|
| `09121111111` | `isProfileComplete: false` — فلوی تکمیل پروفایل |
| `09122222222` | پروفایل حقیقی کامل، **بدون** آدرس تحویل |
| `09123333333` | آماده سفارش حقیقی + آدرس پیش‌فرض |
| `09124444444` | آماده سفارش حقوقی + آدرس |
| `09125555555` | دو آدرس تحویل |
| `09126666666` | کاربر غیرفعال — OTP فعلاً توکن می‌دهد |
| `09129999999` | سید نشده → کاربر کاملاً جدید (`isNewUser: true`) |

کد ملی‌های معتبر seed (برای تست فرم): `0013542419`, `0499370899`, …

---

## ۵. ورود ادمین (جدا از OTP)

```http
POST /api/user/auth/admin/login
Content-Type: application/json

{ "username": "admin", "password": "Admin@12345" }
```

```ts
type AdminLoginResponse = {
  adminId: string;      // aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
  accessToken: string;  // JWT با role=Admin
};
```

مقادیر از `AdminAuth` در `appsettings.json`. توکن ادمین را از توکن مشتری جدا نگه دارید (کلید storage جدا یا اپ ادمین جدا).  
`/api/user/me` برای ادمین طراحی نشده — پورتال مشتری است.

---

## ۶. پورتال مشتری — `GET /api/user/me`

همهٔ endpointهای این بخش: **`[Authorize]`** + Bearer مشتری.

```http
GET /api/user/me
Authorization: Bearer <accessToken>
```

```ts
type Address = {
  province: string;
  city: string;
  street: string;
  postalCode: string; // ۱۰ رقم
};

type DeliveryAddress = {
  id: string;
  recipientName: string;
  recipientPhone: string;
  address: Address;
  isDefault: boolean;
};

type CustomerMe = {
  userId: string;
  phoneNumber: string;
  isPhoneVerified: boolean;
  isProfileComplete: boolean;
  fullName?: string | null;
  nationalId?: string | null;
  companyRegistrationId?: string | null;
  personType?: string | null; // "Individual" | "Company" — رشته در پاسخ
  profileAddress?: Address | null;
  deliveryAddresses: DeliveryAddress[];
};
```

اگر `userId` از JWT خوانده نشود → **HTTP 401** بدون envelope کامل.

---

## ۷. تکمیل و ویرایش پروفایل

### ۷.۱ تکمیل اولیه (یک‌بار)

```http
POST /api/user/me/profile
Authorization: Bearer ...
```

```json
{
  "fullName": "علی رضایی",
  "nationalId": "0013542419",
  "personType": 1,
  "companyRegistrationId": null,
  "address": null
}
```

| فیلد | قانون |
|---|---|
| `personType` | عدد enum: **`1=Individual`**, **`2=Company`** (در درخواست عدد، در پاسخ `GET /me` رشته) |
| حقیقی | `nationalId` الزامی — ۱۰ رقم + الگوریتم کنترل ایران |
| حقوقی | `companyRegistrationId` الزامی |
| `address` | اختیاری — آدرس پروفایل (جدا از آدرس‌های تحویل) |
| تکرار | اگر پروفایل از قبل باشد → **Conflict**؛ از `PUT` استفاده کنید |

نمونه حقوقی:

```json
{
  "fullName": "شرکت فولاد نمونه",
  "nationalId": "",
  "personType": 2,
  "companyRegistrationId": "10101234567",
  "address": {
    "province": "اصفهان",
    "city": "اصفهان",
    "street": "خیابان چهارباغ عباسی پلاک ۴۵",
    "postalCode": "8145678901"
  }
}
```

> برای حقیقی `nationalId` را خالی نفرستید؛ برای حقوقی فیلد اجباری `companyRegistrationId` است. بک‌اند بر اساس `personType` یکی را می‌سازد.

پاسخ: همان شکل `CustomerMe` با `isProfileComplete: true`.

### ۷.۲ ویرایش بعد از تکمیل

```http
PUT /api/user/me/profile
```

```json
{
  "fullName": "علی رضایی",
  "nationalId": "0013542419",
  "companyRegistrationId": null,
  "address": null
}
```

- `personType` در PUT نیست — نوع شخص عوض نمی‌شود.
- اگر پروفایل هنوز ساخته نشده → خطا؛ اول `POST`.

---

## ۸. آدرس‌های تحویل

برای ثبت سفارش به `deliveryAddressId` نیاز دارید.

| Method | Path |
|---|---|
| GET | `/api/user/me/addresses` |
| POST | `/api/user/me/addresses` |
| PUT | `/api/user/me/addresses/{addressId}` |
| DELETE | `/api/user/me/addresses/{addressId}` |

### ایجاد

```json
{
  "recipientName": "علی رضایی",
  "recipientPhone": "09121234567",
  "address": {
    "province": "تهران",
    "city": "تهران",
    "street": "خیابان آزادی پلاک ۱۲",
    "postalCode": "1234567890"
  },
  "isDefault": true
}
```

| قانون اعتبارسنجی | |
|---|---|
| `recipientPhone` | همان قوانین موبایل ایران |
| `street` | حداقل **۱۰ کاراکتر** |
| `postalCode` | **۱۰ رقم** |
| `province` / `city` | غیرخالی |

`POST` موفق معمولاً **201 Created** + `DeliveryAddress` در `result`.

---

## ۹. مدیریت توکن در فرانت (پیشنهادی)

```ts
const TOKEN_KEY = 'ha_customer_token';
const ADMIN_TOKEN_KEY = 'ha_admin_token';

export function getCustomerToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = getCustomerToken();
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(path, { ...init, headers });
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    // navigate('/auth')
    throw new Error('Unauthorized');
  }
  const body = await res.json();
  if (!body.isSuccess) {
    throw new Error(body.errors?.[0]?.message ?? 'خطا');
  }
  return body.result;
}
```

بعد از mount اپ (اگر توکن هست): `GET /api/user/me` برای sync کردن `isProfileComplete` و آدرس‌ها.

**خروج:** فقط پاک کردن توکن از کلاینت — endpoint logout سمت سرور نیست.

---

## ۱۰. اتصال به فلوی خرید (خلاصه)

1. سبد بدون لاگین با `sessionToken` کار می‌کند.
2. قبل از `POST /api/ordering/orders` باید:
   - JWT مشتری داشته باشید
   - `isProfileComplete === true`
   - حداقل یک `deliveryAddressId`
   - `agreementAccepted: true`
3. اگر کاربر وسط checkout لاگین کرد، همان `returnUrl=/checkout` را بعد از پروفایل/آدرس برگردانید.

جزئیات سفارش: [`frontend-integration.md`](frontend-integration.md) §۵ و §۱۱+.

---

## ۱۱. چک‌لیست پیاده‌سازی فرانت

### OTP
- [ ] فرم شماره + نرمال‌سازی نمایش `09…`
- [ ] cooldown ۶۰ث و نمایش `debugCode` در Dev
- [ ] verify ۵ رقمی؛ ذخیره `accessToken`
- [ ] شاخه‌بندی با `isProfileComplete` / `isNewUser`

### پروفایل
- [ ] گارد: بدون پروفایل کامل → فرم `POST /api/user/me/profile`
- [ ] سوئیچ حقیقی/حقوقی (`personType` 1|2)
- [ ] اعتبارسنجی کد ملی ۱۰ رقمی سمت UI (بک‌اند هم چک می‌کند)
- [ ] ویرایش با `PUT` بعد از تکمیل

### آدرس
- [ ] لیست + افزودن/ویرایش/حذف
- [ ] انتخاب پیش‌فرض برای checkout
- [ ] خیابان ≥ ۱۰ کاراکتر، کد پستی ۱۰ رقم

### امنیتی / UX
- [ ] هدر Bearer روی همهٔ `/api/user/me/*` و ordering authenticated
- [ ] 401 → logout کلاینتی
- [ ] توکن ادمین جدا از مشتری
- [ ] بدون CORS مستقیم — proxy Vite به `:5062`

---

## ۱۲. اشتباهات رایج

| اشتباه | درست |
|---|---|
| فرستادن `personType` به‌صورت `"Individual"` در POST | عدد `1` یا `2` |
| فرض اینکه پاسخ `personType` هم عدد است | در `GET /me` رشته است |
| استفاده از توکن Admin برای `/api/user/me` | فقط JWT با role Customer |
| نادیده گرفتن cooldown ۶۰ث | UI تایمر + پیام Conflict |
| تکیه به SMS در Development | از `debugCode` استفاده کنید |
| آدرس پروفایل = آدرس تحویل | جدا هستند؛ سفارش از `deliveryAddresses` |
| کد ملی جعلی مثل `1111111111` | الگوریتم کنترل رد می‌شود |
| endpoint logout | وجود ندارد — فقط پاک کردن توکن |

---

## ۱۳. نقشهٔ سریع endpointها

```
عمومی
├── POST /api/user/auth/otp/send
├── POST /api/user/auth/otp/verify
└── POST /api/user/auth/admin/login

پورتال مشتری (Bearer Customer)
├── GET    /api/me
├── POST   /api/user/me/profile          ← تکمیل اولیه
├── PUT    /api/user/me/profile          ← ویرایش
├── GET    /api/user/me/addresses
├── POST   /api/user/me/addresses
├── PUT    /api/user/me/addresses/{id}
└── DELETE /api/user/me/addresses/{id}
```

---

## ۱۴. تست دستی سریع

```http
POST /api/user/auth/otp/send
{ "phoneNumber": "09121111111" }
# از result.debugCode استفاده کنید

POST /api/user/auth/otp/verify
{ "phoneNumber": "09121111111", "code": "<debugCode>" }
# → accessToken، isProfileComplete: false

GET /api/user/me
Authorization: Bearer <token>

POST /api/user/me/profile
{ "fullName": "تست کاربر", "nationalId": "0013542419", "personType": 1 }

POST /api/user/me/addresses
{ "recipientName": "تست", "recipientPhone": "09121111111",
  "address": { "province": "تهران", "city": "تهران",
    "street": "خیابان آزادی پلاک ۱۲", "postalCode": "1234567890" },
  "isDefault": true }
```
