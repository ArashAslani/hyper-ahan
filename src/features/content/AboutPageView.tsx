export function AboutPageView() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-2xl font-bold md:text-3xl">
        درباره هایپر آهن
      </h1>
      <div className="space-y-6 rounded-xl bg-white p-6 leading-relaxed text-gray-700 shadow-md md:p-8">
        <section>
          <h2 className="mb-3 text-xl font-bold text-blue-600">معرفی شرکت</h2>
          <p>
            هایپر آهن با بیش از یک دهه تجربه در زمینه تأمین و فروش انواع مقاطع
            فولادی، ورق‌های سیاه و روغنی، لوله، پروفیل و میلگرد، همواره کوشیده
            است تا با بهره‌گیری از کارشناسان مجرب و ارتباط مستقیم با کارخانجات
            داخلی و خارجی، بهترین قیمت‌ها و کیفیت را به مشتریان خود ارائه دهد.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-bold text-blue-600">
            چشم‌انداز و مأموریت
          </h2>
          <p>
            ما در هایپر آهن به دنبال ایجاد بستری شفاف، سریع و قابل اعتماد برای
            خرید و فروش آهن‌آلات هستیم. با حذف واسطه‌ها و ارائه قیمت‌های لحظه‌ای،
            فرآیند خرید را برای مشتریان خرد و عمده ساده کرده‌ایم. هدف ما تبدیل
            شدن به بزرگترین مرجع آنلاین خرید آهن در ایران است.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-bold text-blue-600">ارزش‌های ما</h2>
          <ul className="list-inside list-disc space-y-1 pr-4">
            <li>شفافیت در قیمت‌گذاری و مشخصات فنی</li>
            <li>پشتیبانی قبل و بعد از فروش</li>
            <li>ارائه محصولات با آنالیز و گواهی معتبر</li>
            <li>مشاوره رایگان برای انتخاب بهترین محصول</li>
            <li>تضمین کیفیت و اصالت کالا</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-bold text-blue-600">تماس با ما</h2>
          <p>
            نشانی: تهران، خیابان ولیعصر، پلاک ۱۲۳، طبقه ۵ <br />
            تلفن: ۰۳۱-۹۱۶۹۰۴۳۳ (۱۰ خط) <br />
            ایمیل: info@ironmarket.com <br />
            ساعات پاسخگویی: شنبه تا پنجشنبه ۹ صبح تا ۵ عصر
          </p>
        </section>
      </div>
    </div>
  );
}
