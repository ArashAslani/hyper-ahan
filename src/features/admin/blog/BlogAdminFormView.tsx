"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faEye } from "@fortawesome/free-solid-svg-icons";
import {
  AdminForm,
  AdminPageHeader,
  AdminSection,
  AdminSelect,
  AdminSeoPanel,
  AdminSwitch,
  AdminTextInput,
  AdminTextarea,
  AdminFilePicker,
  AdminCard,
} from "@/features/admin/components";
import { Button } from "@/shared/ui/Button";
import { ApiError } from "@/lib/api-client";
import { routes } from "@/lib/routes";
import { useAdminAuth } from "../auth/AdminAuthProvider";
import {
  blogAdminService,
  type BlogAdminPost,
} from "@/services/blogAdminService";
import type { FileDto } from "@/types";
import {
  BLOG_ADMIN_DEFAULT_VALUES,
  blogAdminFormSchema,
  type BlogAdminFormValues,
} from "./blogAdminSchema";
import { BlogBodyEditor } from "./BlogBodyEditor";

type BlogAdminFormViewProps = {
  mode: "create" | "edit";
  postId?: string;
};

function toPreviewFileDto(file: File): FileDto {
  return {
    id: "local-preview",
    url: URL.createObjectURL(file),
    thumbnailUrl: null,
    width: null,
    height: null,
    alt: file.name,
  };
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function BlogAdminFormView({ mode, postId }: BlogAdminFormViewProps) {
  const router = useRouter();
  const { accessToken, adminId } = useAdminAuth();
  const form = useForm<BlogAdminFormValues>({
    resolver: zodResolver(blogAdminFormSchema),
    defaultValues: BLOG_ADMIN_DEFAULT_VALUES,
  });

  const [loadingPost, setLoadingPost] = useState(mode === "edit");
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<FileDto | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [wasPublished, setWasPublished] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  const titleValue = useWatch({ control: form.control, name: "title" });
  const slugValue = useWatch({ control: form.control, name: "slug" });
  const isPublished = useWatch({ control: form.control, name: "isPublished" });

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    async function loadCategories() {
      try {
        const categories = await blogAdminService.getCategories(accessToken!);
        if (cancelled) return;
        setCategoryOptions(categories.map((c) => ({ value: c.id, label: c.title })));
      } catch {
        if (!cancelled) setFormError("بارگذاری دسته‌ها ناموفق بود.");
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    }

    void loadCategories();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  useEffect(() => {
    if (mode !== "edit" || !postId || !accessToken) return;
    let cancelled = false;

    async function loadPost() {
      setLoadingPost(true);
      setFormError(null);
      try {
        const post = await blogAdminService.getById(postId!, accessToken!);
        if (cancelled) return;
        form.reset({
          title: post.title,
          description: post.description,
          body: post.body,
          categoryId: post.categoryId,
          isFeatured: false,
          isPublished: post.isPublished,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          metaKeywords: post.metaKeywords,
          slug: post.slug,
        });
        setImagePreview(post.image);
        setOriginalSlug(post.slug);
        setWasPublished(post.isPublished);
        setSlugTouched(true);
      } catch (error) {
        if (!cancelled) {
          setFormError(
            error instanceof ApiError ? error.message : "بارگذاری مقاله ناموفق بود.",
          );
        }
      } finally {
        if (!cancelled) setLoadingPost(false);
      }
    }

    void loadPost();
    return () => {
      cancelled = true;
    };
    // form.reset is stable enough; including `form` causes unnecessary reloads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, postId, accessToken]);

  useEffect(() => {
    if (slugTouched || mode === "edit") return;
    const next = slugify(titleValue);
    if (next) form.setValue("slug", next, { shouldValidate: false });
  }, [titleValue, slugTouched, mode, form]);

  useEffect(() => {
    return () => {
      if (imagePreview?.id === "local-preview" && imagePreview.url.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview.url);
      }
    };
  }, [imagePreview]);

  const breadcrumbs = useMemo(
    () => [
      { label: "داشبورد", href: routes.admin.dashboard },
      { label: "مقالات", href: routes.admin.blog.list },
      { label: mode === "create" ? "مقاله جدید" : "ویرایش مقاله" },
    ],
    [mode],
  );

  async function syncPublishState(id: string, token: string, published: boolean) {
    if (published && !wasPublished) {
      await blogAdminService.publish(id, token);
    } else if (!published && wasPublished) {
      await blogAdminService.unpublish(id, token);
    }
  }

  async function onSubmit(values: BlogAdminFormValues) {
    if (!accessToken || !adminId) {
      setFormError("نشست ادمین معتبر نیست. دوباره وارد شوید.");
      return;
    }

    if (mode === "create" && !imageFile) {
      setFormError("تصویر مقاله الزامی است.");
      return;
    }

    setFormError(null);

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      body: values.body,
      slug: values.slug.trim(),
      userId: adminId,
      ownerName: "ادمین",
      categoryId: values.categoryId,
      metaTitle: values.metaTitle?.trim() || undefined,
      metaDescription: values.metaDescription?.trim() || undefined,
      metaKeywords: values.metaKeywords?.trim() || undefined,
      imageFile,
    };

    try {
      let saved: BlogAdminPost;

      if (mode === "create") {
        saved = await blogAdminService.create(payload, accessToken);
        if (values.isPublished) {
          await blogAdminService.publish(saved.id, accessToken);
        }
      } else {
        saved = await blogAdminService.update(
          { ...payload, id: postId! },
          accessToken,
        );

        if (originalSlug && values.slug.trim() !== originalSlug) {
          await blogAdminService.changeSlug(saved.id, values.slug.trim(), accessToken);
        }

        await syncPublishState(saved.id, accessToken, values.isPublished);
      }

      router.push(routes.admin.blog.list);
      router.refresh();
    } catch (error) {
      setFormError(
        error instanceof ApiError ? error.message : "ذخیره مقاله ناموفق بود.",
      );
    }
  }

  function handleImageUpload(file: File) {
    if (imagePreview?.id === "local-preview" && imagePreview.url.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview.url);
    }
    setImageFile(file);
    setImagePreview(toPreviewFileDto(file));
  }

  function handleImageRemove() {
    if (imagePreview?.id === "local-preview" && imagePreview.url.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview.url);
    }
    setImageFile(null);
    setImagePreview(null);
  }

  if (loadingPost) {
    return (
      <div className="space-y-4">
        <AdminPageHeader title={mode === "create" ? "مقاله جدید" : "ویرایش مقاله"} breadcrumbs={breadcrumbs} />
        <AdminCard>
          <p className="text-sm text-text-muted">در حال بارگذاری...</p>
        </AdminCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={mode === "create" ? "مقاله جدید" : "ویرایش مقاله"}
        description={
          mode === "create"
            ? "ایجاد مقاله جدید برای بخش بلاگ"
            : "ویرایش محتوا، تصویر و تنظیمات SEO"
        }
        breadcrumbs={breadcrumbs}
        actions={
          slugValue ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => window.open(routes.blog.detail(slugValue), "_blank", "noopener,noreferrer")}
            >
              <FontAwesomeIcon icon={faEye} />
              پیش‌نمایش
            </Button>
          ) : null
        }
      />

      {formError ? (
        <div role="alert" className="rounded-[var(--radius-md)] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {formError}
        </div>
      ) : null}

      <AdminCard>
        <AdminForm form={form} onSubmit={onSubmit} loading={form.formState.isSubmitting}>
          <AdminSection title="محتوای اصلی">
            <div className="space-y-4">
              <AdminTextInput name="title" label="عنوان" required maxLength={70} showCounter />
              <AdminTextarea
                name="description"
                label="خلاصه"
                required
                rows={3}
                maxLength={160}
                showCounter
                autoResize={false}
              />
              <BlogBodyEditor />
              <AdminSelect
                name="categoryId"
                label="دسته"
                required
                options={categoryOptions}
                loading={categoriesLoading}
                placeholder="انتخاب دسته"
                searchable
              />
            </div>
          </AdminSection>

          <AdminSection title="تصویر شاخص">
            <AdminFilePicker
              label="تصویر مقاله"
              description={mode === "create" ? "الزامی — jpg/png/gif/webp" : "اختیاری — در صورت عدم انتخاب، تصویر قبلی حفظ می‌شود"}
              value={imagePreview}
              onUpload={handleImageUpload}
              onRemove={mode === "create" ? handleImageRemove : undefined}
            />
          </AdminSection>

          <AdminSection title="وضعیت انتشار">
            <div className="grid gap-3 sm:grid-cols-2">
              <AdminSwitch
                name="isFeatured"
                label="مقاله ویژه"
                description="نمایش در بخش مقالات ویژه (در صورت پشتیبانی بک‌اند)"
              />
              <AdminSwitch
                name="isPublished"
                label="انتشار"
                description={
                  isPublished
                    ? "مقاله در سایت عمومی نمایش داده می‌شود"
                    : "پیش‌نویس — در سایت عمومی دیده نمی‌شود"
                }
              />
            </div>
          </AdminSection>

          <div
            onFocusCapture={() => setSlugTouched(true)}
          >
            <AdminSeoPanel namePrefix="" />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(routes.admin.blog.list)}
              disabled={form.formState.isSubmitting}
            >
              انصراف
            </Button>
            <Button type="submit" variant="accent" disabled={form.formState.isSubmitting}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {form.formState.isSubmitting ? "در حال ذخیره..." : "ذخیره مقاله"}
            </Button>
          </div>
        </AdminForm>
      </AdminCard>
    </div>
  );
}
