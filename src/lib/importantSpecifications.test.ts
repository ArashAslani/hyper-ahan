import assert from "node:assert/strict";
import test from "node:test";
import {
  mapImportantSpecifications,
  takeImportantSpecifications,
} from "./importantSpecifications.ts";

test("maps two specs in Backend order", () => {
  const result = mapImportantSpecifications([
    { label: "سایز", value: "14" },
    { label: "نمره", value: "AIII" },
  ]);
  assert.deepEqual(result, [
    { label: "سایز", value: "14" },
    { label: "نمره", value: "AIII" },
  ]);
});

test("maps a single spec", () => {
  const result = mapImportantSpecifications([{ label: "ضخامت", value: "2" }]);
  assert.deepEqual(result, [{ label: "ضخامت", value: "2" }]);
});

test("absent or empty collection becomes []", () => {
  assert.deepEqual(mapImportantSpecifications(undefined), []);
  assert.deepEqual(mapImportantSpecifications(null), []);
  assert.deepEqual(mapImportantSpecifications([]), []);
});

test("preserves Backend label/value text unchanged", () => {
  const result = mapImportantSpecifications([
    { label: "  سایز  ", value: " 14 " },
  ]);
  assert.deepEqual(result, [{ label: "  سایز  ", value: " 14 " }]);
});

test("defensively caps at first two without reordering", () => {
  const result = mapImportantSpecifications([
    { label: "a", value: "1" },
    { label: "b", value: "2" },
    { label: "c", value: "3" },
  ]);
  assert.deepEqual(result, [
    { label: "a", value: "1" },
    { label: "b", value: "2" },
  ]);
});

test("takeImportantSpecifications shares the same capped list view", () => {
  const mapped = mapImportantSpecifications([
    { label: "a", value: "1" },
    { label: "b", value: "2" },
    { label: "c", value: "3" },
  ]);
  assert.deepEqual(takeImportantSpecifications(mapped), mapped);
  assert.deepEqual(takeImportantSpecifications(mapped, 1), [
    { label: "a", value: "1" },
  ]);
});

test("omits incomplete among first two without pulling later entries", () => {
  const result = mapImportantSpecifications([
    { label: "", value: "x" },
    { label: "ok", value: "1" },
    { label: "later", value: "2" },
  ]);
  assert.deepEqual(result, [{ label: "ok", value: "1" }]);
});
