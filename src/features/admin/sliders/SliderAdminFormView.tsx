"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import {
  AdminCard,
  AdminField,
  AdminFilePicker,
  AdminForm,
  AdminPageHeader,
  AdminSection,
  AdminSelect,
  AdminSeoPanel,
  AdminSwitch,
  AdminTextInput,
  AdminTextarea,
} from "@/features/admin/components";
import { Button } from "@/shared/ui/Button";
import { ApiError } from "@/lib/api-client";
import { routes } from "@/lib/routes";
import { useAdminAuth } from "../auth/AdminAuthProvider";
import { sliderAdminService } from "@/services/sliderAdminService";
import type { FileDto } from "@/types";
import { getFieldError } from "../components/forms/utils";
import {
  BUTTON_VARIANT_OPTIONS,
  SLIDER_ADMIN_DEFAULT_VALUES,
  TEXT_ALIGNMENT_OPTIONS,
  sliderAdminFormSchema,
  type SliderAdminFormValues,
} from "./sliderAdminSchema";
import {
  fromDatetimeLocalValue,
  previewPathForGroupSlug,
  toDatetimeLocalValue,
} from "./sliderAdminUtils";

type SliderAdminFormViewProps = {
  mode: "create" | "edit";
  slideId?: string;
};

function toPreviewFileDto(file: File, id = "local-preview"): FileDto {
  return {
    id,
    url: URL.createObjectURL(file),
    thumbnailUrl: null,
    width: null,
    height: null,
    alt: file.name,
  };
}

function DatetimeField({
  name,
  label,
  description,
}: {
  name: "startDate" | "endDate";
  label: string;
  description?: string;
}) {
  const fieldId = useId();
  const {
    register,
    formState: { errors },
  } = useFormContext<SliderAdminFormValues>();
  const error = getFieldError(errors, name);

  return (
    <AdminField label={label} htmlFor={fieldId} description={description} error={error}>
      <input
        id={fieldId}
        type="datetime-local"
        {...register(name)}
        className={`min-h-[var(--touch-min)] w-full rounded-[var(--radius-md)] border bg-surface px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 ${
          error ? "border-danger" : "border-border focus:border-accent"
        }`}
      />
    </AdminField>
  );
}

export function SliderAdminFormView({ mode, slideId }: SliderAdminFormViewProps) {
  const router = useRouter();
  const { accessToken } = useAdminAuth();
  const form = useForm<SliderAdminFormValues>({
    resolver: zodResolver(sliderAdminFormSchema) as never,
    defaultValues: SLIDER_ADMIN_DEFAULT_VALUES,
  });

  const [loadingSlide, setLoadingSlide] = useState(mode === "edit");
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [groupOptions, setGroupOptions] = useState<{ value: string; label: string; slug: string }[]>(
    [],
  );
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [desktopPreview, setDesktopPreview] = useState<FileDto | null>(null);
  const [mobilePreview, setMobilePreview] = useState<FileDto | null>(null);
  const [clearMobileImage, setClearMobileImage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const groupId = useWatch({ control: form.control, name: "groupId" });
  const isActive = useWatch({ control: form.control, name: "isActive" });
  const selectedGroup = groupOptions.find((g) => g.value === groupId);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    async function loadGroups() {
      try {
        const groups = await sliderAdminService.listGroups(accessToken!);
        if (cancelled) return;
        setGroupOptions(
          groups.map((g) => ({
            value: g.id,
            label: g.title,
            slug: g.slug,
          })),
        );
      } catch {
        if (!cancelled) setFormError("بارگذاری گروه‌های اسلایدر ناموفق بود.");
      } finally {
        if (!cancelled) setGroupsLoading(false);
      }
    }
    void loadGroups();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  useEffect(() => {
    if (mode !== "edit" || !slideId || !accessToken) return;
    let cancelled = false;

    async function loadSlide() {
      setLoadingSlide(true);
      setFormError(null);
      try {
        const slide = await sliderAdminService.getById(slideId!, accessToken!);
        if (cancelled) return;
        form.reset({
          title: slide.title,
          description: slide.description,
          groupId: slide.groupId,
          displayOrder: slide.displayOrder,
          priority: slide.priority,
          overlayOpacity:
            slide.overlayOpacity === null || slide.overlayOpacity === undefined
              ? 35
              : Math.round(slide.overlayOpacity * 100),
          textAlignment: slide.textAlignment || "start",
          buttonText: slide.buttonText,
          buttonVariant: slide.buttonVariant || "primary",
          link: slide.link,
          openInNewTab: slide.openInNewTab,
          startDate: toDatetimeLocalValue(slide.startDate),
          endDate: toDatetimeLocalValue(slide.endDate),
          isActive: slide.isActive,
          metaTitle: slide.metaTitle,
          metaDescription: slide.metaDescription,
          metaKeywords: slide.metaKeywords,
        });
        setDesktopPreview(slide.image);
        setMobilePreview(slide.mobileImage);
        setClearMobileImage(false);
      } catch (error) {
        if (!cancelled) {
          setFormError(
            error instanceof ApiError ? error.message : "بارگذاری اسلاید ناموفق بود.",
          );
        }
      } finally {
        if (!cancelled) setLoadingSlide(false);
      }
    }

    void loadSlide();
    return () => {
      cancelled = true;
    };
    // form.reset is stable enough; including `form` causes unnecessary reloads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, slideId, accessToken]);

  useEffect(() => {
    return () => {
      if (desktopPreview?.id === "local-preview" && desktopPreview.url.startsWith("blob:")) {
        URL.revokeObjectURL(desktopPreview.url);
      }
    };
  }, [desktopPreview]);

  useEffect(() => {
    return () => {
      if (
        mobilePreview?.id === "local-preview-mobile" &&
        mobilePreview.url.startsWith("blob:")
      ) {
        URL.revokeObjectURL(mobilePreview.url);
      }
    };
  }, [mobilePreview]);

  const breadcrumbs = useMemo(
    () => [
      { label: "داشبورد", href: routes.admin.dashboard },
      { label: "اسلایدرها", href: routes.admin.sliders.list },
      { label: mode === "create" ? "اسلاید جدید" : "ویرایش اسلاید" },
    ],
    [mode],
  );

  async function onSubmit(values: SliderAdminFormValues) {
    if (!accessToken) {
      setFormError("نشست ادمین معتبر نیست. دوباره وارد شوید.");
      return;
    }

    if (mode === "create" && !desktopFile) {
      setFormError("تصویر دسکتاپ الزامی است.");
      return;
    }

    setFormError(null);

    const overlay =
      typeof values.overlayOpacity === "number" && !Number.isNaN(values.overlayOpacity)
        ? values.overlayOpacity / 100
        : null;

    const payload = {
      title: values.title.trim(),
      groupId: values.groupId,
      link: values.link.trim(),
      description: values.description?.trim() || undefined,
      displayOrder: values.displayOrder,
      priority: values.priority,
      isActive: values.isActive,
      openInNewTab: values.openInNewTab,
      buttonText: values.buttonText?.trim() || undefined,
      buttonVariant: values.buttonVariant || undefined,
      overlayOpacity: overlay,
      textAlignment: values.textAlignment || undefined,
      startDate: fromDatetimeLocalValue(values.startDate ?? ""),
      endDate: fromDatetimeLocalValue(values.endDate ?? ""),
      metaTitle: values.metaTitle?.trim() || undefined,
      metaDescription: values.metaDescription?.trim() || undefined,
      metaKeywords: values.metaKeywords?.trim() || undefined,
      imageFile: desktopFile,
      mobileImageFile: mobileFile,
      clearMobileImage: mode === "edit" ? clearMobileImage : false,
    };

    try {
      if (mode === "create") {
        await sliderAdminService.create(payload, accessToken);
      } else {
        await sliderAdminService.update({ ...payload, id: slideId! }, accessToken);
      }
      router.push(routes.admin.sliders.list);
      router.refresh();
    } catch (error) {
      setFormError(
        error instanceof ApiError ? error.message : "ذخیره اسلاید ناموفق بود.",
      );
    }
  }

  function handleDesktopUpload(file: File) {
    if (desktopPreview?.id === "local-preview" && desktopPreview.url.startsWith("blob:")) {
      URL.revokeObjectURL(desktopPreview.url);
    }
    setDesktopFile(file);
    setDesktopPreview(toPreviewFileDto(file, "local-preview"));
  }

  function handleDesktopRemove() {
    if (desktopPreview?.id === "local-preview" && desktopPreview.url.startsWith("blob:")) {
      URL.revokeObjectURL(desktopPreview.url);
    }
    setDesktopFile(null);
    setDesktopPreview(null);
  }

  function handleMobileUpload(file: File) {
    if (
      mobilePreview?.id === "local-preview-mobile" &&
      mobilePreview.url.startsWith("blob:")
    ) {
      URL.revokeObjectURL(mobilePreview.url);
    }
    setMobileFile(file);
    setMobilePreview(toPreviewFileDto(file, "local-preview-mobile"));
    setClearMobileImage(false);
  }

  function handleMobileRemove() {
    if (
      mobilePreview?.id === "local-preview-mobile" &&
      mobilePreview.url.startsWith("blob:")
    ) {
      URL.revokeObjectURL(mobilePreview.url);
    }
    setMobileFile(null);
    setMobilePreview(null);
    setClearMobileImage(true);
  }

  if (loadingSlide) {
    return (
      <div className="space-y-4">
        <AdminPageHeader
          title={mode === "create" ? "اسلاید جدید" : "ویرایش اسلاید"}
          breadcrumbs={breadcrumbs}
        />
        <AdminCard>
          <p className="text-sm text-text-muted">در حال بارگذاری...</p>
        </AdminCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={mode === "create" ? "اسلاید جدید" : "ویرایش اسلاید"}
        description={
          mode === "create"
            ? "ایجاد اسلاید جدید برای جایگاه‌های بنر سایت"
            : "ویرایش محتوا، تصویر و تنظیمات نمایش"
        }
        breadcrumbs={breadcrumbs}
        actions={
          selectedGroup ? (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                window.open(
                  previewPathForGroupSlug(selectedGroup.slug),
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              <FontAwesomeIcon icon={faEye} />
              پیش‌نمایش
            </Button>
          ) : null
        }
      />

      {formError ? (
        <div
          role="alert"
          className="rounded-[var(--radius-md)] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {formError}
        </div>
      ) : null}

      <AdminCard>
        <AdminForm form={form} onSubmit={onSubmit} loading={form.formState.isSubmitting}>
          <AdminSection title="محتوای اصلی">
            <div className="space-y-4">
              <AdminTextInput name="title" label="عنوان" required maxLength={200} showCounter />
              <AdminTextarea
                name="description"
                label="توضیحات"
                rows={3}
                maxLength={500}
                showCounter
                autoResize={false}
              />
              <AdminSelect
                name="groupId"
                label="گروه"
                required
                options={groupOptions}
                loading={groupsLoading}
                placeholder="انتخاب گروه"
                searchable
              />
              <AdminTextInput name="link" label="لینک" required placeholder="/products" />
            </div>
          </AdminSection>

          <AdminSection title="تصویر شاخص">
            <div className="grid gap-6 md:grid-cols-2">
              <AdminFilePicker
                label="تصویر دسکتاپ"
                description={
                  mode === "create"
                    ? "الزامی — jpg/png/gif/webp"
                    : "اختیاری — در صورت عدم انتخاب، تصویر قبلی حفظ می‌شود"
                }
                value={desktopPreview}
                onUpload={handleDesktopUpload}
                onRemove={mode === "create" ? handleDesktopRemove : undefined}
              />
              <AdminFilePicker
                label="تصویر موبایل"
                description="اختیاری — در صورت عدم انتخاب، تصویر دسکتاپ استفاده می‌شود"
                value={mobilePreview}
                onUpload={handleMobileUpload}
                onRemove={handleMobileRemove}
              />
            </div>
          </AdminSection>

          <AdminSection title="نمایش و ترتیب">
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminTextInput name="displayOrder" label="ترتیب نمایش" required />
              <AdminTextInput name="priority" label="اولویت" required />
              <AdminTextInput
                name="overlayOpacity"
                label="شفافیت پوشش (۰–۱۰۰)"
                description="۰ = بدون پوشش · ۱۰۰ = کاملاً تیره"
              />
              <AdminSelect
                name="textAlignment"
                label="تراز متن"
                options={TEXT_ALIGNMENT_OPTIONS}
              />
            </div>
          </AdminSection>

          <AdminSection title="دکمه CTA">
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminTextInput name="buttonText" label="متن دکمه" maxLength={80} showCounter />
              <AdminSelect
                name="buttonVariant"
                label="نوع دکمه"
                options={BUTTON_VARIANT_OPTIONS}
              />
            </div>
          </AdminSection>

          <AdminSection title="زمان‌بندی">
            <div className="grid gap-4 sm:grid-cols-2">
              <DatetimeField
                name="startDate"
                label="تاریخ شروع (اختیاری)"
                description="خالی = بدون محدودیت شروع"
              />
              <DatetimeField
                name="endDate"
                label="تاریخ پایان (اختیاری)"
                description="خالی = بدون محدودیت پایان"
              />
            </div>
          </AdminSection>

          <AdminSection title="وضعیت انتشار">
            <div className="grid gap-3 sm:grid-cols-2">
              <AdminSwitch name="openInNewTab" label="باز شدن لینک در تب جدید" />
              <AdminSwitch
                name="isActive"
                label="فعال"
                description={
                  isActive
                    ? "اسلاید در سایت عمومی نمایش داده می‌شود"
                    : "غیرفعال — در سایت عمومی دیده نمی‌شود"
                }
              />
            </div>
          </AdminSection>

          <AdminSeoPanel namePrefix="" showSlug={false} />

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(routes.admin.sliders.list)}
              disabled={form.formState.isSubmitting}
            >
              انصراف
            </Button>
            <Button type="submit" variant="accent" disabled={form.formState.isSubmitting}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {form.formState.isSubmitting ? "در حال ذخیره..." : "ذخیره اسلاید"}
            </Button>
          </div>
        </AdminForm>
      </AdminCard>
    </div>
  );
}
