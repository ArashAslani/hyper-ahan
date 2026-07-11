export function AboutPageView() {
  return (
    <div className="px-4 py-6">
      <h1 className="mb-4 text-xl font-bold text-text">درباره هایپر آهن</h1>
      <div className="space-y-5 rounded-[var(--radius-lg)] bg-surface p-4 leading-relaxed text-text-muted shadow-[var(--shadow-soft)]">
        <section>
          <h2 className="mb-2 text-base font-bold text-primary">معرفی شرکت</h2>
          <p className="text-sm">
            هایپر آهن با بیش از یک دهه تجربه در تأمین مقاطع فولادی، خرید را برای
            پیمانکاران و مصرف‌کنندگان نهایی ساده کرده است.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-bold text-primary">مأموریت</h2>
          <p className="text-sm">
            قیمت شفاف، پاسخ سریع کارشناس، و تحویل قابل اعتماد — بدون پیچیدگی
            اضافی.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-bold text-primary">تماس</h2>
          <p className="text-sm">
            تلفن: ۰۳۱-۹۱۶۹۰۴۳۳
            <br />
            ساعات پاسخگویی: شنبه تا پنجشنبه ۹ تا ۱۷
          </p>
        </section>
      </div>
    </div>
  );
}
