import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const blogAdminFormSchema = z.object({
  title: z.string().min(1, "عنوان الزامی است").max(70, "حداکثر ۷۰ کاراکتر"),
  description: z.string().min(1, "خلاصه الزامی است").max(160, "حداکثر ۱۶۰ کاراکتر"),
  body: z.string().min(1, "متن مقاله الزامی است"),
  categoryId: z.string().min(1, "دسته را انتخاب کنید"),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  metaTitle: z.string().max(60, "حداکثر ۶۰ کاراکتر").optional().or(z.literal("")),
  metaDescription: z.string().max(160, "حداکثر ۱۶۰ کاراکتر").optional().or(z.literal("")),
  metaKeywords: z.string().optional().or(z.literal("")),
  slug: z
    .string()
    .min(1, "آدرس (Slug) الزامی است")
    .regex(slugPattern, "فقط حروف انگلیسی کوچک، عدد و خط تیره"),
});

export type BlogAdminFormValues = z.infer<typeof blogAdminFormSchema>;

export const BLOG_ADMIN_DEFAULT_VALUES: BlogAdminFormValues = {
  title: "",
  description: "",
  body: "",
  categoryId: "",
  isFeatured: false,
  isPublished: false,
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  slug: "",
};
