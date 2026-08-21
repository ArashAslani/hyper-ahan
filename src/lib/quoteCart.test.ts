import assert from "node:assert/strict";
import test from "node:test";
import type { QuoteCartItem, QuoteCartQuoteSnapshot } from "../types/quoteCart.ts";
import {
  cartHasPricedCheckoutBlockers,
  getQuoteCartLineState,
  quoteCartLineNeedsRequote,
  resolveQuoteCartLineState,
} from "../types/quoteCart.ts";

const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

function sellableQuote(
  overrides: Partial<QuoteCartQuoteSnapshot> = {},
): QuoteCartQuoteSnapshot {
  return {
    isSellable: true,
    salesStatus: "Available",
    resolvedBasePrice: 1000,
    payableQuantity: 1,
    subtotal: 1000,
    vatApplied: false,
    vatAmount: 0,
    finalPrice: 1000,
    appliedTierId: null,
    priceId: "price-1",
    ...overrides,
  };
}

function line(
  overrides: Partial<QuoteCartItem> = {},
): QuoteCartItem {
  return {
    productId: "product-1",
    displayName: "Test",
    orderUnitId: "unit-1",
    orderUnitLabel: "kg",
    quantity: 1,
    quote: sellableQuote(),
    quotedAt: new Date().toISOString(),
    expiresAt: yesterday,
    ...overrides,
  };
}

test("past expiresAt plus sellable finalPrice is quoted, not a hold", () => {
  const item = line({ expiresAt: yesterday, quote: sellableQuote() });
  assert.equal(getQuoteCartLineState(item), "quoted");
  assert.equal(quoteCartLineNeedsRequote("quoted"), false);
  assert.equal(cartHasPricedCheckoutBlockers([item]), false);
});

test("null quote is stale_qty", () => {
  const item = line({ quote: null, lastKnownFinalPrice: 1000 });
  assert.equal(getQuoteCartLineState(item), "stale_qty");
  assert.equal(quoteCartLineNeedsRequote("stale_qty"), true);
});

test("isSellable false is unsellable", () => {
  const item = line({
    quote: sellableQuote({ isSellable: false, finalPrice: 1000 }),
  });
  assert.equal(getQuoteCartLineState(item), "unsellable");
});

test("missing finalPrice is unavailable", () => {
  const item = line({
    quote: sellableQuote({ finalPrice: null }),
  });
  assert.equal(getQuoteCartLineState(item), "unavailable");
});

test("NaN finalPrice is unavailable", () => {
  const item = line({
    quote: sellableQuote({ finalPrice: Number.NaN }),
  });
  assert.equal(getQuoteCartLineState(item), "unavailable");
});

test("resolveQuoteCartLineState overlays error", () => {
  const item = line();
  assert.equal(
    resolveQuoteCartLineState(item, { hasError: true }),
    "error",
  );
  assert.equal(quoteCartLineNeedsRequote("error"), true);
});
