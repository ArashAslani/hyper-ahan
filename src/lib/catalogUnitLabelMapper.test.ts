import assert from "node:assert/strict";
import test from "node:test";
import {
  toComparisonUnit,
  toRegistrationUnit,
} from "./catalogUnitMapping.ts";

test("toRegistrationUnit preserves present Backend label and code", () => {
  assert.deepEqual(toRegistrationUnit({ code: "KG", label: "کیلوگرم" }), {
    code: "kg",
    label: "کیلوگرم",
  });
});

test("toRegistrationUnit keeps blank label blank (never uses code)", () => {
  assert.deepEqual(toRegistrationUnit({ code: "KG", label: "" }), {
    code: "kg",
    label: "",
  });
  assert.deepEqual(toRegistrationUnit({ code: "KG", label: "   " }), {
    code: "kg",
    label: "",
  });
});

test("toRegistrationUnit missing label stays blank (code-only input)", () => {
  assert.deepEqual(toRegistrationUnit({ code: "TON" }), {
    code: "ton",
    label: "",
  });
  assert.deepEqual(toRegistrationUnit({ code: "TON", label: undefined }), {
    code: "ton",
    label: "",
  });
});

test("toRegistrationUnit legacy string remains display label", () => {
  assert.deepEqual(toRegistrationUnit("  کیلوگرم  "), {
    code: "کیلوگرم",
    label: "کیلوگرم",
  });
});

test("toComparisonUnit preserves present Backend label", () => {
  assert.deepEqual(
    toComparisonUnit(
      { code: "KG", label: "کیلوگرم" },
      { code: "ton", label: "تن" },
    ),
    { code: "kg", label: "کیلوگرم" },
  );
});

test("toComparisonUnit blank label stays blank (never fallback.label)", () => {
  assert.deepEqual(
    toComparisonUnit({ code: "KG", label: "" }, { code: "ton", label: "تن" }),
    { code: "kg", label: "" },
  );
  assert.deepEqual(
    toComparisonUnit({ code: "KG", label: "  " }, { code: "ton", label: "تن" }),
    { code: "kg", label: "" },
  );
});

test("toComparisonUnit missing label stays blank (code-only)", () => {
  assert.deepEqual(
    toComparisonUnit({ code: "KG" }, { code: "ton", label: "تن" }),
    { code: "kg", label: "" },
  );
  assert.deepEqual(
    toComparisonUnit(null, { code: "ton", label: "تن" }),
    { code: "ton", label: "" },
  );
  assert.deepEqual(
    toComparisonUnit(undefined, { code: "ton", label: "تن" }),
    { code: "ton", label: "" },
  );
});
