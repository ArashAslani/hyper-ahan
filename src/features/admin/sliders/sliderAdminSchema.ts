import { z } from "zod";

const urlOrPath = z
  .string()
  .min(1, "لینک الزامی است")
  .max(500, "حداکثر ۵۰۰ کاراکتر")
  .refine(
    (value) =>
      value.startsWith("/") ||
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("tel:") ||
      value.startsWith("mailto:"),
    "لینک باید مسیر نسبی یا URL معتبر باشد",
  );

function numberFromInput(schema: z.ZodNumber) {
  return z.preprocess((value) => {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() !== "") return Number(value);
    return value;
  }, schema);
}

export const sliderAdminFormSchema = z
  .object({
    title: z.string().min(1, "عنوان الزامی است").max(200, "حداکثر ۲۰۰ کاراکتر"),
    description: z.string().max(500, "حداکثر ۵۰۰ کاراکتر").optional().or(z.literal("")),
    groupId: z.string().min(1, "گروه را انتخاب کنید"),
    displayOrder: numberFromInput(z.number().int("عدد صحیح").min(0, "حداقل ۰")),
    priority: numberFromInput(z.number().int("عدد صحیح")),
    /** UI uses 0–100; converted to 0–1 before API. */
    overlayOpacity: numberFromInput(z.number().min(0, "حداقل ۰").max(100, "حداکثر ۱۰۰")),
    textAlignment: z.enum(["", "start", "center", "end", "left", "right"]),
    buttonText: z.string().max(80, "حداکثر ۸۰ کاراکتر").optional().or(z.literal("")),
    buttonVariant: z.enum(["", "primary", "secondary", "outline", "ghost", "link"]),
    link: urlOrPath,
    openInNewTab: z.boolean(),
    startDate: z.string().optional().or(z.literal("")),
    endDate: z.string().optional().or(z.literal("")),
    isActive: z.boolean(),
    metaTitle: z.string().max(60, "حداکثر ۶۰ کاراکتر").optional().or(z.literal("")),
    metaDescription: z.string().max(160, "حداکثر ۱۶۰ کاراکتر").optional().or(z.literal("")),
    metaKeywords: z.string().optional().or(z.literal("")),
  })
  .superRefine((values, ctx) => {
    if (values.startDate && values.endDate && values.endDate < values.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "تاریخ پایان باید بعد از تاریخ شروع باشد",
      });
    }
  });

export type SliderAdminFormValues = z.output<typeof sliderAdminFormSchema>;

export const SLIDER_ADMIN_DEFAULT_VALUES: SliderAdminFormValues = {
  title: "",
  description: "",
  groupId: "",
  displayOrder: 0,
  priority: 0,
  overlayOpacity: 35,
  textAlignment: "start",
  buttonText: "",
  buttonVariant: "primary",
  link: "/",
  openInNewTab: false,
  startDate: "",
  endDate: "",
  isActive: true,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

export const BUTTON_VARIANT_OPTIONS = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "outline", label: "Outline" },
  { value: "ghost", label: "Ghost" },
  { value: "link", label: "Link" },
];

export const TEXT_ALIGNMENT_OPTIONS = [
  { value: "start", label: "شروع (start)" },
  { value: "center", label: "وسط" },
  { value: "end", label: "پایان (end)" },
  { value: "left", label: "چپ" },
  { value: "right", label: "راست" },
];
