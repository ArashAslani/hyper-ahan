"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/Button";
import { calculationToolService } from "@/services/calculationToolService";
import { writeEngineeringPrefill } from "@/lib/engineeringPrefill";
import { routes } from "@/lib/routes";
import type { CalculationToolDetail, ExecuteToolResult, UiInput } from "@/types/catalog";

type DynamicToolFormProps = {
  tool: CalculationToolDetail;
  /** When set (from PDP), continue CTA returns to product with engineering prefill. */
  productId?: string | null;
  /** Optional return path; defaults to product PDP when productId is set. */
  returnPath?: string | null;
};

function normalizeInputType(type: string): string {
  return type.trim().toLowerCase();
}

function ToolField({
  input,
  value,
  onChange,
}: {
  input: UiInput;
  value: string;
  onChange: (value: string) => void;
}) {
  const type = normalizeInputType(input.type);

  if (type === "boolean" || type === "bool") {
    return (
      <label className="flex min-h-[var(--touch-min)] items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={value === "true" || value === "1"}
          onChange={(e) => onChange(e.target.checked ? "true" : "false")}
          className="h-5 w-5 accent-[var(--color-accent)]"
        />
        <span>
          {input.label}
          {input.required ? " *" : ""}
        </span>
      </label>
    );
  }

  if (type === "select" && input.options?.length) {
    return (
      <label className="block text-sm">
        <span className="mb-1 block text-text-muted">
          {input.label}
          {input.unit ? ` (${input.unit})` : ""}
          {input.required ? " *" : ""}
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={input.required}
          className="min-h-[var(--touch-min)] w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 text-text"
        >
          <option value="">انتخاب کنید</option>
          {input.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  const inputType =
    type === "number" || type === "decimal" || type === "int" ? "number" : "text";

  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-muted">
        {input.label}
        {input.unit ? ` (${input.unit})` : ""}
        {input.required ? " *" : ""}
      </span>
      <input
        type={inputType}
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={input.required}
        className="min-h-[var(--touch-min)] w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 text-text"
      />
    </label>
  );
}

export function DynamicToolForm({
  tool,
  productId,
  returnPath,
}: DynamicToolFormProps) {
  const router = useRouter();
  const initial = useMemo(() => {
    const values: Record<string, string> = {};
    for (const input of tool.inputs) values[input.key] = "";
    return values;
  }, [tool.inputs]);

  const [values, setValues] = useState(initial);
  const [result, setResult] = useState<ExecuteToolResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      setError(null);
      setResult(null);
      try {
        const inputs: Record<string, number> = {};
        const inputUnits: Record<string, string | null> = {};
        for (const field of tool.inputs) {
          const raw = values[field.key];
          const type = normalizeInputType(field.type);
          if (type === "boolean" || type === "bool") {
            inputs[field.key] = raw === "true" || raw === "1" ? 1 : 0;
          } else {
            const num = Number(raw);
            if (field.required && (raw === "" || Number.isNaN(num))) {
              throw new Error(`مقدار «${field.label}» نامعتبر است`);
            }
            if (raw !== "" && !Number.isNaN(num)) inputs[field.key] = num;
          }
          if (field.unit) inputUnits[field.key] = field.unit;
        }

        const exec = await calculationToolService.execute({
          toolId: tool.id,
          inputs,
          inputUnits: Object.keys(inputUnits).length ? inputUnits : undefined,
        });
        setResult(exec);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطا در محاسبه");
      }
    });
  };

  const continueToPurchase = () => {
    if (!result || !productId) return;

    // Engineering handoff only — never pricingService / useCart.
    writeEngineeringPrefill({
      productId,
      quantity: result.quantity,
      unit: result.unit,
      toolId: result.toolId,
      formulaTypeId: result.formulaTypeId,
    });

    const target =
      returnPath?.trim() ||
      routes.catalog.product(productId);
    const url = new URL(target, window.location.origin);
    url.searchParams.set("applyQty", String(result.quantity));
    if (result.unit) url.searchParams.set("applyUnit", result.unit);
    url.searchParams.set("openAtc", "1");
    router.push(`${url.pathname}${url.search}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {tool.inputs.map((input) => (
        <ToolField
          key={input.key}
          input={input}
          value={values[input.key] ?? ""}
          onChange={(v) => setValues((prev) => ({ ...prev, [input.key]: v }))}
        />
      ))}

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <Button type="submit" variant="accent" className="w-full" disabled={pending}>
        {pending ? "در حال محاسبه…" : "محاسبه"}
      </Button>

      {result ? (
        <div className="rounded-[var(--radius-lg)] bg-accent/10 p-4 text-center">
          <p className="text-xs text-text-muted">نتیجه مهندسی</p>
          <p className="mt-1 text-2xl font-bold text-text">
            {result.quantity.toLocaleString("fa-IR")}
            {result.unit ? (
              <span className="mr-1 text-base font-normal text-text-muted">
                {result.unit}
              </span>
            ) : null}
          </p>
          <p className="mt-2 text-xs text-text-muted">
            این نتیجه قیمت نیست — قیمت فقط پس از انتخاب واحد سفارش در صفحه محصول
            محاسبه می‌شود.
          </p>
          {productId ? (
            <Button
              type="button"
              variant="accent"
              className="mt-4 w-full"
              onClick={continueToPurchase}
            >
              ادامه برای خرید
            </Button>
          ) : (
            <p className="mt-3 text-xs text-text-muted">
              برای خرید، محصول را از کاتالوگ انتخاب کنید و از آنجا محاسبه‌گر را باز
              کنید.
            </p>
          )}
        </div>
      ) : null}
    </form>
  );
}
