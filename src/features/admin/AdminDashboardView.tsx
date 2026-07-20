import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faBoxesStacked,
  faClipboardList,
  faNewspaper,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "@/shared/ui/Card";

const statPlaceholders = [
  { label: "سفارش‌های امروز", icon: faClipboardList },
  { label: "کاربران فعال", icon: faUsers },
  { label: "محصولات فعال", icon: faBoxesStacked },
  { label: "رشد فروش", icon: faArrowTrendUp },
];

const quickActions = [
  { label: "افزودن مقاله جدید", icon: faNewspaper },
  { label: "بررسی سفارش‌ها", icon: faClipboardList },
  { label: "مدیریت محصولات", icon: faBoxesStacked },
];

export function AdminDashboardView() {
  return (
    <div className="space-y-6">
      <Card className="bg-primary text-white">
        <h1 className="text-lg font-bold md:text-xl">خوش آمدید 👋</h1>
        <p className="mt-2 text-sm text-white/80">
          این نسخهٔ اولیهٔ پنل مدیریت هایپر آهن است. بخش‌های مدیریت محتوا و
          سفارش‌ها به‌زودی به این داشبورد اضافه می‌شوند.
        </p>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-bold text-text">اقدامات سریع</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Card
              key={action.label}
              className="flex items-center gap-3 opacity-70"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <FontAwesomeIcon icon={action.icon} />
              </span>
              <div>
                <p className="text-sm font-medium text-text">
                  {action.label}
                </p>
                <p className="text-xs text-text-muted">به‌زودی</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-bold text-text">آمار کلی</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {statPlaceholders.map((stat) => (
            <Card key={stat.label} className="text-center">
              <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                <FontAwesomeIcon icon={stat.icon} />
              </span>
              <p className="text-2xl font-bold text-text">—</p>
              <p className="mt-1 text-xs text-text-muted">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-bold text-text">فعالیت‌های اخیر</h2>
        <Card>
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <FontAwesomeIcon
              icon={faClipboardList}
              className="text-3xl text-text-muted"
            />
            <p className="text-sm text-text-muted">
              فعالیتی برای نمایش وجود ندارد. با اتصال به داده‌های واقعی این
              بخش تکمیل می‌شود.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
