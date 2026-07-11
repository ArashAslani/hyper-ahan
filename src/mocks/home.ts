import type {
  Article,
  ArticleSummary,
  Banner,
  HomeCategory,
  JourneyStep,
  PriceRow,
  ProfileOrder,
  ProfileUser,
  TeamMember,
} from "@/types";

export const bannersMock: Banner[] = [
  {
    id: 1,
    title: "قیمت روز آهن‌آلات",
    subtitle: "سفارش سریع، تماس کارشناس",
    image: "https://placehold.co/1200x400/1A1A2E/white?text=هایپر+آهن",
  },
  {
    id: 2,
    title: "میلگرد و تیرآهن",
    subtitle: "از کارخانه تا محل پروژه",
    image: "https://placehold.co/1200x400/2D2D2D/white?text=مقاطع+فولادی",
  },
  {
    id: 3,
    title: "مشاوره رایگان خرید",
    subtitle: "تماس: ۰۳۱-۹۱۶۹۰۴۳۳",
    image: "https://placehold.co/1200x400/E67E22/white?text=مشاوره",
  },
];

export const homeCategoriesMock: HomeCategory[] = [
  { id: 1, name: "تیرآهن", icon: "🏗️", slug: "beam", count: 45 },
  { id: 2, name: "نبشی", icon: "📐", slug: "angle", count: 32 },
  { id: 3, name: "ورق سیاه", icon: "📄", slug: "sheet", count: 28 },
  { id: 4, name: "میلگرد", icon: "⚙️", slug: "rebar", count: 56 },
  { id: 5, name: "لوله", icon: "🔧", slug: "pipe", count: 41 },
  { id: 6, name: "پروفیل", icon: "📦", slug: "profile", count: 37 },
  { id: 7, name: "سپری", icon: "🛡️", slug: "tee", count: 19 },
  { id: 8, name: "قوطی", icon: "🧰", slug: "box", count: 24 },
];

export const pricesMock: PriceRow[] = [
  {
    id: 1,
    product: "تیرآهن ۱۴",
    size: "۱۴",
    grade: "ST37",
    loadingPlace: "اهواز",
    type: "کارخانه",
    price: "۲۳,۵۰۰,۰۰۰",
    trend: "up",
  },
  {
    id: 2,
    product: "نبشی ۵",
    size: "۵",
    grade: "ST44",
    loadingPlace: "تهران",
    type: "بازرگان",
    price: "۱۸,۲۰۰,۰۰۰",
    trend: "down",
  },
  {
    id: 3,
    product: "میلگرد ۱۲",
    size: "۱۲",
    grade: "A3",
    loadingPlace: "اصفهان",
    type: "کارخانه",
    price: "۲۱,۸۰۰,۰۰۰",
    trend: "up",
  },
  {
    id: 4,
    product: "ورق سیاه ۲ میل",
    size: "۲",
    grade: "ST12",
    loadingPlace: "تبریز",
    type: "بازرگان",
    price: "۲۹,۴۰۰,۰۰۰",
    trend: "down",
  },
  {
    id: 5,
    product: "لوله داربست",
    size: "۴۸",
    grade: "ST52",
    loadingPlace: "کرج",
    type: "کارخانه",
    price: "۳۲,۱۰۰,۰۰۰",
    trend: "up",
  },
];

export const journeyStepsMock: JourneyStep[] = [
  {
    id: 1,
    title: "ثبت نام / ورود",
    description: "ابتدا در سایت ثبت نام کنید یا وارد حساب خود شوید.",
    icon: "📝",
  },
  {
    id: 2,
    title: "جستجوی محصول",
    description: "محصول مورد نظر خود را جستجو یا از دسته‌بندی انتخاب کنید.",
    icon: "🔍",
  },
  {
    id: 3,
    title: "مشاوره قیمت",
    description: "با کارشناسان ما تماس بگیرید یا قیمت لحظه‌ای را ببینید.",
    icon: "💬",
  },
  {
    id: 4,
    title: "ثبت سفارش",
    description: "سفارش خود را ثبت و مدارک را بارگذاری کنید.",
    icon: "📦",
  },
  {
    id: 5,
    title: "پرداخت بیعانه",
    description: "بیعانه را پرداخت کنید تا سفارش قطعی شود.",
    icon: "💰",
  },
  {
    id: 6,
    title: "تحویل کالا",
    description: "کالا در محل بارگیری یا ارسال به شما تحویل داده می‌شود.",
    icon: "🚚",
  },
];

export const teamMembersMock: TeamMember[] = [
  {
    id: 1,
    name: "رضا کریمی",
    role: "مدیر فروش",
    image: "https://placehold.co/400x400/e2e8f0/1e293b?text=رضا",
  },
  {
    id: 2,
    name: "سارا محمدی",
    role: "کارشناس بازرگانی",
    image: "https://placehold.co/400x400/e2e8f0/1e293b?text=سارا",
  },
  {
    id: 3,
    name: "علی حسینی",
    role: "مدیر فنی",
    image: "https://placehold.co/400x400/e2e8f0/1e293b?text=علی",
  },
  {
    id: 4,
    name: "مریم احمدی",
    role: "پشتیبانی و مشاوره",
    image: "https://placehold.co/400x400/e2e8f0/1e293b?text=مریم",
  },
];

export const aboutCompanyText = `شرکت هایپر آهن با بیش از یک دهه تجربه در زمینه تامین و فروش انواع مقاطع فولادی، ورق‌های سیاه و روغنی، لوله، پروفیل و میلگرد، همواره کوشیده است تا با بهره‌گیری از کارشناسان مجرب و ارتباط مستقیم با کارخانجات داخلی و خارجی، بهترین قیمت‌ها و کیفیت را به مشتریان خود ارائه دهد. ما با ایجاد بستری آنلاین و شفاف، فرآیند خرید آهن‌آلات را از استعلام قیمت تا تحویل کالا، ساده و سریع کرده‌ایم. هدف ما ایجاد اعتماد و همراهی با مشتریان در پروژه‌های ساختمانی و صنعتی است. در آینده نزدیک، امکان خرید خرد و عمده، پرداخت آنلاین بیعانه و تسویه نهایی، و همچنین ارائه گواهی آنالیز و تضمین اصالت کالا فراهم خواهد شد. تیم ما آماده ارائه مشاوره رایگان قبل از خرید و پشتیبانی پس از فروش است.`;

export const articlesMock: Article[] = [
  {
    id: 1,
    title: "راهنمای انتخاب تیرآهن مناسب",
    summary: "انواع تیرآهن و کاربردهای آن در ساختمان‌سازی را بشناسید.",
    image: "https://placehold.co/600x400/2563eb/white?text=تیرآهن",
    date: "۱۴۰۳/۰۱/۱۵",
    author: "رضا کریمی",
    content: `تیرآهن یکی از پرکاربردترین مقاطع فولادی در ساختمان‌سازی است. انتخاب تیرآهن مناسب بستگی به عوامل مختلفی مانند باربری، دهانه، نوع سازه و استانداردهای ساخت دارد.

**انواع تیرآهن از نظر شکل ظاهری:**
- تیرآهن بال پهن (IPB): مناسب برای ستون‌ها
- تیرآهن معمولی (IPE): مناسب برای تیرها و خرپاها
- تیرآهن بال متغیر (INP): کاربرد در سازه‌های سبک

**نکات مهم در خرید تیرآهن:**
1. آنالیز و گرید (ST37, ST44, ST52)
2. وزن و ابعاد دقیق
3. گواهی کارخانه
4. محل بارگیری و هزینه حمل

در این مقاله سعی داریم به صورت کامل شما را با معیارهای انتخاب تیرآهن مناسب آشنا کنیم.`,
    comments: [
      {
        id: 1,
        user: "علی محمدی",
        text: "مقاله بسیار مفیدی بود، ممنون.",
        date: "۱۴۰۳/۰۱/۱۶",
      },
      {
        id: 2,
        user: "سارا احمدی",
        text: "لطفاً در مورد تیرآهن دوبل هم مطلب بگذارید.",
        date: "۱۴۰۳/۰۱/۱۷",
      },
    ],
  },
  {
    id: 2,
    title: "نوسانات قیمت آهن در بازار امروز",
    summary: "تحلیل عوامل موثر بر قیمت مقاطع فولادی در هفته جاری.",
    image: "https://placehold.co/600x400/16a34a/white?text=قیمت+آهن",
    date: "۱۴۰۳/۰۱/۱۰",
    author: "سارا محمدی",
    content: `بازار فولاد در هفته گذشته با نوسانات زیادی همراه بود. قیمت میلگرد در اهواز با کاهش ۳ درصدی مواجه شد، در حالی که ورق سیاه در تهران افزایش ۲ درصدی داشت.

**عوامل موثر بر قیمت آهن‌آلات:**
- نرخ ارز و قیمت دلار
- قیمت مواد اولیه (سنگ آهن، قراضه)
- تقاضای داخلی و خارجی
- هزینه حمل و نقل و سوخت

**پیش‌بینی کوتاه مدت:**
با توجه به روند فعلی، انتظار می‌رود قیمت‌ها تا پایان ماه جاری ثبات نسبی داشته باشند.`,
    comments: [],
  },
  {
    id: 3,
    title: "مقایسه ورق سیاه و ورق روغنی",
    summary: "تفاوت‌ها، کاربردها و موارد استفاده هر کدام را بخوانید.",
    image: "https://placehold.co/600x400/dc2626/white?text=ورق",
    date: "۱۴۰۳/۰۱/۰۵",
    author: "علی حسینی",
    content: `ورق سیاه و ورق روغنی دو نوع ورق فولادی پرکاربرد هستند. تفاوت اصلی در فرآیند تولید و پرداخت سطحی آن‌هاست.

**ورق سیاه:**
- سطح زبر و تیره
- مقاومت بالا در برابر ضربه
- مناسب برای سازه‌های فلزی، مخازن، ماشین‌آلات

**ورق روغنی:**
- سطح صاف و براق
- ضخامت کمتر و دقیق‌تر
- مناسب برای بدنه خودرو، لوازم خانگی، صنایع ظریف

انتخاب بین این دو بستگی به نیاز نهایی پروژه شما دارد.`,
    comments: [
      {
        id: 1,
        user: "محمد رضایی",
        text: "خیلی عالی توضیح دادید.",
        date: "۱۴۰۳/۰۱/۰۶",
      },
    ],
  },
  {
    id: 4,
    title: "بازار فولاد در بهار ۱۴۰۳",
    summary: "پیش‌بینی قیمت آهن‌آلات در ماه‌های آینده.",
    image: "https://placehold.co/600x400/f59e0b/white?text=بازار+فولاد",
    date: "۱۴۰۳/۰۱/۰۱",
    author: "مریم احمدی",
    content: `بهار ۱۴۰۳ با چالش‌ها و فرصت‌های جدیدی برای بازار فولاد همراه است. افزایش نرخ دلار و تحریم‌ها از یک سو و افزایش تقاضای داخلی از سوی دیگر، بازار را تحت تاثیر قرار داده است.

**توصیه به خریداران:**
- در نوسانات کوتاه مدت عجله نکنید
- قیمت چند کارخانه را مقایسه کنید
- از مشاوره کارشناسان استفاده کنید

ما در آهن‌مارکت به صورت روزانه قیمت‌ها را به‌روزرسانی می‌کنیم.`,
    comments: [],
  },
];

export function toArticleSummaries(articles: Article[]): ArticleSummary[] {
  return articles.map(({ id, title, summary, image, date }) => ({
    id,
    title,
    summary,
    image,
    date,
  }));
}

export const profileUserMock: ProfileUser = {
  name: "رضا کریمی",
  email: "reza.karimi@example.com",
  phone: "۰۹۱۲۱۲۳۴۵۶۷",
  memberSince: "۱۴۰۲/۰۵/۰۱",
};

export const profileOrdersMock: ProfileOrder[] = [
  {
    id: 1001,
    orderNumber: "HA-20260710-1001",
    date: "۱۴۰۳/۰۱/۱۵",
    total: "۲۳,۵۰۰,۰۰۰",
    status: "Completed",
    items: 2,
  },
  {
    id: 1002,
    orderNumber: "HA-20260710-1002",
    date: "۱۴۰۳/۰۱/۲۰",
    total: "۴۲,۸۰۰,۰۰۰",
    status: "Confirmed",
    items: 3,
  },
  {
    id: 1003,
    orderNumber: "HA-20260710-1003",
    date: "۱۴۰۳/۰۲/۰۵",
    total: "۱۸,۲۰۰,۰۰۰",
    status: "Submitted",
    items: 1,
  },
];
