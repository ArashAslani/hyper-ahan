"use client";

import { Component, type ReactNode } from "react";
import { FormProvider, type FieldValues, type UseFormReturn } from "react-hook-form";

type AdminFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void | Promise<void>;
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
};

class AdminFormErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="rounded-[var(--radius-md)] border border-danger/30 bg-danger/10 p-4 text-sm text-danger"
        >
          خطایی در نمایش فرم رخ داد. لطفاً صفحه را دوباره بارگذاری کنید.
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Generic React Hook Form wrapper for every Admin create/edit screen.
 * The caller owns the schema/resolver via `form`; this component only wires
 * up submission, a busy fieldset (loading/disabled), and a render error boundary.
 */
export function AdminForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
  loading = false,
  disabled = false,
  id,
  className = "",
}: AdminFormProps<T>) {
  const isBusy = loading || disabled || form.formState.isSubmitting;

  return (
    <AdminFormErrorBoundary>
      <FormProvider {...form}>
        <form
          id={id}
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className={`space-y-6 ${className}`}
        >
          {/* Disabling the fieldset natively disables every descendant form
              control (input/select/textarea/button) without extra plumbing. */}
          <fieldset disabled={isBusy} className="m-0 space-y-6 border-0 p-0">
            {children}
          </fieldset>
        </form>
      </FormProvider>
    </AdminFormErrorBoundary>
  );
}
