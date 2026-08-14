import assert from "node:assert/strict";
import test from "node:test";
import {
  appendCatalogNavParam,
  bindCatalogCalculatorEntryRecord,
  bindCatalogNavigationOwnershipRecord,
  buildCatalogProductHref,
  buildCleanedProductHref,
  canonicalizeCatalogCategoryHref,
  canonicalizeCurrentProductHref,
  createCatalogNavigationTransitionTicket,
  decideCatalogReturnNavigation,
  issueCatalogNavigationContinuationRecord,
  mergeCalculatorHandoff,
  parseCatalogPlpScrollSnapshot,
  readCatalogNavParam,
  resolveCatalogPlpScrollToStore,
  storedCatalogPlpScrollMatchesHref,
  resolveCatalogReturnHref,
  shouldPreserveSuspendedCatalogOwnership,
  stripCalculatorHandoffParams,
  withCatalogNavigationCalculatorActivation,
  type CatalogNavigationOwnership,
  type CatalogTransitionTicket,
} from "./catalogNavigationContext.ts";

const categoryId = "00000000-0000-0000-a001-000000000043";
const productId = "00000000-0000-0000-a001-000000000610";
const factoryA = "00000000-0000-0000-a001-000000000051";
const factoryB = "00000000-0000-0000-a001-000000000052";
const selectionDefinition = "00000000-0000-0000-a001-000000000021";
const optionA = "00000000-0000-0000-a001-000000000031";
const optionB = "00000000-0000-0000-a001-000000000032";
const categoryPath = `/catalog/categories/${categoryId}`;

const CHAIN_A = "chain-live-a";
const ACT_OTHER = "bbbbbbbb-1111-4000-8000-0000000000a2";
const CONT_OTHER = "bbbbbbbb-1111-4000-8000-0000000000c2";
const STALE_NAV = "cccccccc-1111-4000-8000-0000000000c3";
const PDP_ENTRY = "pdp-entry-live";
const CALC_ENTRY = "calc-entry-live";
const RETURN_ENTRY = "pdp-entry-return";
const REOPEN_ENTRY = "pdp-entry-reopen";
const CALC_REOPEN_ENTRY = "calc-entry-reopen";

test("PLP scroll snapshots preserve recorded 420 and zero", () => {
  const href = `${categoryPath}?page=2&sort=newest`;
  assert.equal(
    parseCatalogPlpScrollSnapshot(JSON.stringify({ href, y: 420 }), href),
    420,
  );
  assert.equal(
    parseCatalogPlpScrollSnapshot(JSON.stringify({ href, y: 0 }), href),
    0,
  );
});

test("missing, invalid, negative, and mismatched PLP scroll use safe fallback", () => {
  const href = `${categoryPath}?page=2`;
  assert.equal(parseCatalogPlpScrollSnapshot(null, href), null);
  assert.equal(parseCatalogPlpScrollSnapshot("not-json", href), null);
  assert.equal(
    parseCatalogPlpScrollSnapshot(JSON.stringify({ href, y: -1 }), href),
    null,
  );
  assert.equal(
    parseCatalogPlpScrollSnapshot(
      JSON.stringify({ href: `${categoryPath}?page=3`, y: 420 }),
      href,
    ),
    null,
  );
});

test("Quick Detail open captures the live position; the later lock cannot replace it", () => {
  const href = `${categoryPath}?page=2&sort=newest`;
  const atOpen = resolveCatalogPlpScrollToStore(null, href, 420, false);
  assert.deepEqual(atOpen, { href, y: 420 });

  const afterLock = resolveCatalogPlpScrollToStore(
    JSON.stringify(atOpen),
    href,
    0,
    true,
  );
  assert.deepEqual(afterLock, { href, y: 420 });
});

test("a captured zero is preserved as a value, not treated as missing", () => {
  const href = `${categoryPath}?page=2`;
  const atOpen = resolveCatalogPlpScrollToStore(null, href, 0, false);
  assert.deepEqual(atOpen, { href, y: 0 });
  assert.deepEqual(
    resolveCatalogPlpScrollToStore(JSON.stringify(atOpen), href, 0, true),
    { href, y: 0 },
  );
});

test("preserving falls back to the live position when no valid snapshot exists", () => {
  const href = `${categoryPath}?page=2`;
  const other = `${categoryPath}?page=3`;
  for (const stored of [
    null,
    "not-json",
    JSON.stringify({ href, y: -1 }),
    JSON.stringify({ href, y: Number.NaN }),
    JSON.stringify({ href: other, y: 420 }),
  ]) {
    assert.deepEqual(resolveCatalogPlpScrollToStore(stored, href, 310, true), {
      href,
      y: 310,
    });
  }
});

test("a card navigation recaptures rather than reusing an earlier snapshot", () => {
  const href = `${categoryPath}?page=2`;
  assert.deepEqual(
    resolveCatalogPlpScrollToStore(JSON.stringify({ href, y: 420 }), href, 100, false),
    { href, y: 100 },
  );
});

test("abandoned Quick Detail clears only the matching snapshot, including 420 and 0", () => {
  const href = `${categoryPath}?page=2&sort=newest`;
  const other = `${categoryPath}?page=3`;
  assert.equal(
    storedCatalogPlpScrollMatchesHref(JSON.stringify({ href, y: 420 }), href),
    true,
  );
  assert.equal(
    storedCatalogPlpScrollMatchesHref(JSON.stringify({ href, y: 0 }), href),
    true,
  );
  assert.equal(
    storedCatalogPlpScrollMatchesHref(JSON.stringify({ href: other, y: 420 }), href),
    false,
  );
  assert.equal(storedCatalogPlpScrollMatchesHref(null, href), false);
  assert.equal(storedCatalogPlpScrollMatchesHref("", href), false);
  assert.equal(storedCatalogPlpScrollMatchesHref("not-json", href), false);
  assert.equal(
    storedCatalogPlpScrollMatchesHref(
      JSON.stringify({ href, y: 420 }),
      "https://evil.example" + href,
    ),
    false,
  );
});

test("promoted full-PDP keeps the captured snapshot; abandon must not run", () => {
  const href = `${categoryPath}?page=2&sort=newest`;
  const captured = resolveCatalogPlpScrollToStore(null, href, 420, false);
  const promoted = resolveCatalogPlpScrollToStore(
    JSON.stringify(captured),
    href,
    0,
    true,
  );
  assert.deepEqual(promoted, { href, y: 420 });
  const stored = JSON.stringify(promoted);
  assert.equal(storedCatalogPlpScrollMatchesHref(stored, href), true);
  const shouldDiscard = (promotedToFullPdp: boolean) =>
    !promotedToFullPdp && storedCatalogPlpScrollMatchesHref(stored, href);
  assert.equal(shouldDiscard(true), false);
  assert.equal(shouldDiscard(false), true);
});

test("invalid live positions and non-Catalog hrefs never fabricate a snapshot", () => {
  const href = `${categoryPath}?page=2`;
  assert.equal(resolveCatalogPlpScrollToStore(null, href, -5, false), null);
  assert.equal(
    resolveCatalogPlpScrollToStore(null, href, Number.NaN, true),
    null,
  );
  assert.equal(
    resolveCatalogPlpScrollToStore(null, `/catalog/products/${productId}`, 420, false),
    null,
  );
  assert.equal(
    resolveCatalogPlpScrollToStore(
      JSON.stringify({ href, y: 420 }),
      "https://evil.example" + href,
      420,
      true,
    ),
    null,
  );
});

function calculatorHref(nav: string): string {
  return `/tools/calculators/sample-tool?productId=${productId}&nav=${nav}`;
}

test("preserves exact repeated Category query parameters", () => {
  const href =
    `${categoryPath}?sort=newest&page=2` +
    `&factory=${factoryA}&factory=${factoryB}` +
    `&selection=${selectionDefinition}:${optionA}` +
    `&selection=${selectionDefinition}:${optionB}`;

  assert.equal(canonicalizeCatalogCategoryHref(href), href);
  assert.equal(
    buildCatalogProductHref(productId, href),
    `/catalog/products/${productId}?from=${encodeURIComponent(href)}`,
  );
});

test("canonical Category pathname without query is accepted", () => {
  assert.equal(canonicalizeCatalogCategoryHref(categoryPath), categoryPath);
  assert.equal(resolveCatalogReturnHref(categoryPath), "/catalog");
});

test("encoded characters in the Category query round-trip through from", () => {
  const href = `${categoryPath}?range=${selectionDefinition}:1.5:2.5`;
  const productHref = buildCatalogProductHref(productId, href);
  const params = new URLSearchParams(productHref.split("?")[1]);
  assert.equal(params.get("from"), href);
  assert.equal(canonicalizeCatalogCategoryHref(params.get("from")), href);
});

test("missing context falls back to Catalog root", () => {
  assert.equal(canonicalizeCatalogCategoryHref(null), null);
  assert.equal(canonicalizeCatalogCategoryHref(""), null);
  assert.equal(resolveCatalogReturnHref(undefined), "/catalog");
  assert.equal(buildCatalogProductHref(productId), `/catalog/products/${productId}`);
});

test("rejects malformed, absolute, protocol-relative, and non-Catalog targets", () => {
  assert.equal(
    canonicalizeCatalogCategoryHref("https://evil.example/catalog/categories/" + categoryId),
    null,
  );
  assert.equal(
    canonicalizeCatalogCategoryHref("//evil.example/catalog/categories/" + categoryId),
    null,
  );
  assert.equal(
    canonicalizeCatalogCategoryHref("/catalog/products/" + productId),
    null,
  );
  assert.equal(
    canonicalizeCatalogCategoryHref("/catalog/categories/not-a-uuid"),
    null,
  );
  assert.equal(
    canonicalizeCatalogCategoryHref("/catalog/categories/" + categoryId + "/extra"),
    null,
  );
  assert.equal(
    canonicalizeCatalogCategoryHref(["/catalog/categories/" + categoryId, "/catalog"]),
    null,
  );
  assert.equal(resolveCatalogReturnHref("javascript:alert(1)"), "/catalog");
});

test("unsafe, repeated, invalid, and missing from resolve to Catalog root", () => {
  assert.equal(resolveCatalogReturnHref(undefined), "/catalog");
  assert.equal(resolveCatalogReturnHref(""), "/catalog");
  assert.equal(resolveCatalogReturnHref("https://evil.example/catalog"), "/catalog");
  assert.equal(resolveCatalogReturnHref("//evil.example/catalog/categories/" + categoryId), "/catalog");
  assert.equal(resolveCatalogReturnHref("javascript:alert(1)"), "/catalog");
  assert.equal(resolveCatalogReturnHref("/about"), "/catalog");
  assert.equal(
    resolveCatalogReturnHref("/catalog/categories/" + categoryId + "\\extra"),
    "/catalog",
  );
  assert.equal(
    canonicalizeCatalogCategoryHref([
      `${categoryPath}?page=2`,
      `${categoryPath}?page=3`,
    ]),
    null,
  );
  assert.equal(
    resolveCatalogReturnHref([`${categoryPath}?page=2`, `${categoryPath}?page=3`]),
    "/catalog",
  );
});

test("calculator handoff merge keeps Catalog from and adds one-shot params", () => {
  const categoryHref = `${categoryPath}?page=2&sort=newest`;
  const returnPath = buildCatalogProductHref(productId, categoryHref);
  const merged = mergeCalculatorHandoff(returnPath, productId, {
    applyQty: "12.5",
    applyUnit: "kg",
  });
  const params = new URLSearchParams(merged.split("?")[1]);
  assert.equal(params.get("from"), categoryHref);
  assert.equal(params.get("applyQty"), "12.5");
  assert.equal(params.get("applyUnit"), "kg");
  assert.equal(params.get("openAtc"), "1");
  assert.equal(params.get("nav"), null);
  assert.ok(merged.startsWith(`/catalog/products/${productId}?`));
});

test("calculator merge attaches a single valid continuation identity", () => {
  const categoryHref = `${categoryPath}?page=2`;
  const returnPath = buildCatalogProductHref(productId, categoryHref);
  const merged = mergeCalculatorHandoff(returnPath, productId, {
    applyQty: "12",
    applyUnit: "kg",
    nav: CONT_OTHER,
  });
  const params = new URLSearchParams(merged.split("?")[1]);
  assert.equal(params.get("nav"), CONT_OTHER);
  assert.equal(params.get("from"), categoryHref);
});

test("calculator merge rejects malformed continuation identity", () => {
  const categoryHref = `${categoryPath}?page=2`;
  const returnPath = buildCatalogProductHref(productId, categoryHref);
  const merged = mergeCalculatorHandoff(returnPath, productId, {
    applyQty: "12",
    nav: "not-a-uuid",
  });
  assert.equal(new URLSearchParams(merged.split("?")[1]).get("nav"), null);
});

test("calculator merge rejects absolute return paths and keeps the product route", () => {
  const merged = mergeCalculatorHandoff(
    "https://evil.example/catalog/products/" + productId,
    productId,
    { applyQty: "3" },
  );
  const params = new URLSearchParams(merged.split("?")[1]);
  assert.equal(params.get("from"), null);
  assert.equal(params.get("applyQty"), "3");
  assert.equal(params.get("openAtc"), "1");
});

test("stripping one-shot params preserves Catalog return context", () => {
  const categoryHref = `${categoryPath}?factory=${factoryA}`;
  const params = new URLSearchParams();
  params.set("from", categoryHref);
  params.set("applyQty", "8");
  params.set("applyUnit", "ton");
  params.set("openAtc", "1");
  params.set("nav", CONT_OTHER);

  const cleaned = stripCalculatorHandoffParams(params);
  assert.equal(cleaned.get("applyQty"), null);
  assert.equal(cleaned.get("applyUnit"), null);
  assert.equal(cleaned.get("openAtc"), null);
  assert.equal(cleaned.get("nav"), null);
  assert.equal(cleaned.get("from"), categoryHref);
  assert.equal(
    buildCleanedProductHref(productId, params),
    buildCatalogProductHref(productId, categoryHref),
  );
});

test("nav param accepts one UUID and rejects missing, repeated, and malformed values", () => {
  assert.equal(readCatalogNavParam(CONT_OTHER), CONT_OTHER);
  assert.equal(readCatalogNavParam(null), null);
  assert.equal(readCatalogNavParam(""), null);
  assert.equal(readCatalogNavParam("not-a-uuid"), null);
  assert.equal(readCatalogNavParam("nav-stale-token"), null);
  assert.equal(readCatalogNavParam([CONT_OTHER, ACT_OTHER]), null);
  const repeated = new URLSearchParams();
  repeated.append("nav", CONT_OTHER);
  repeated.append("nav", ACT_OTHER);
  assert.equal(readCatalogNavParam(repeated), null);
  const href = appendCatalogNavParam(
    buildCatalogProductHref(productId, `${categoryPath}?page=2`),
    CONT_OTHER,
  );
  assert.ok(href.includes(`nav=${CONT_OTHER}`));
  assert.equal(appendCatalogNavParam(href, ACT_OTHER), href);
  assert.equal(
    appendCatalogNavParam(buildCatalogProductHref(productId), "not-a-uuid"),
    buildCatalogProductHref(productId),
  );
});

function liveTicket(
  plpHref: string,
  pdpHref: string,
  plpIdx: number | null = 2,
  plpLength: number | null = 3,
): CatalogTransitionTicket {
  const ticket = createCatalogNavigationTransitionTicket(plpHref, pdpHref, {
    idx: plpIdx,
    length: plpLength,
  });
  assert.ok(ticket);
  return ticket;
}

function createdOwnership(
  plpHref: string,
  pdpHref: string,
  extras: Partial<CatalogNavigationOwnership> = {},
): CatalogNavigationOwnership {
  return {
    plpHref,
    pdpHref,
    plpIdx: 2,
    plpLength: 3,
    pdpIdx: null,
    pdpLength: null,
    bound: false,
    phase: "created",
    chainId: CHAIN_A,
    activationId: null,
    activationConsumed: false,
    continuationId: null,
    continuationConsumed: false,
    pdpEntryId: null,
    calcEntryHref: null,
    calcEntryId: null,
    calcEntryIdx: null,
    calcEntryLength: null,
    calcReturnIdx: null,
    calcReturnLength: null,
    calcReturnEntryId: null,
    suspended: false,
    ...extras,
  };
}

function bindLivePdp(
  plpHref: string,
  pdpHref: string,
  entryId: string | null = PDP_ENTRY,
): CatalogNavigationOwnership {
  const bound = bindCatalogNavigationOwnershipRecord(
    createdOwnership(plpHref, pdpHref),
    pdpHref,
    { idx: 3, length: 4 },
    false,
    entryId,
    null,
    liveTicket(plpHref, pdpHref),
  );
  assert.ok(bound);
  assert.equal(bound.phase, "pdp-bound");
  assert.equal(bound.bound, true);
  assert.equal(bound.pdpIdx, 3);
  assert.equal(bound.pdpEntryId, entryId);
  return bound;
}

function enterCalculator(
  ownership: CatalogNavigationOwnership,
): CatalogNavigationOwnership {
  const activated = withCatalogNavigationCalculatorActivation(
    ownership,
    ownership.pdpEntryId,
    { idx: ownership.pdpIdx, length: ownership.pdpLength },
  );
  assert.ok(activated);
  assert.equal(activated.phase, "calc-activated");
  assert.ok(activated.activationId);
  const href = calculatorHref(activated.activationId);
  const entered = bindCatalogCalculatorEntryRecord(
    activated,
    activated.activationId,
    href,
    { idx: 4, length: 5 },
    CALC_ENTRY,
  );
  assert.ok(entered);
  assert.equal(entered.phase, "calc-entry-bound");
  assert.equal(entered.activationConsumed, true);
  return entered;
}

function completeCalculatorReturn(
  plpHref: string,
  pdpHref: string,
): {
  ownership: CatalogNavigationOwnership;
  returnedHref: string;
  continuationId: string;
} {
  const entered = enterCalculator(bindLivePdp(plpHref, pdpHref));
  const issued = issueCatalogNavigationContinuationRecord(
    entered,
    entered.calcEntryHref!,
    CALC_ENTRY,
    { idx: 4, length: 5 },
  );
  assert.ok(issued);
  assert.equal(issued.phase, "continuation-issued");
  assert.ok(issued.continuationId);
  const returnedHref = mergeCalculatorHandoff(pdpHref, productId, {
    applyQty: "12",
    applyUnit: "kg",
    nav: issued.continuationId,
  });
  const returned = bindCatalogNavigationOwnershipRecord(
    issued,
    returnedHref,
    { idx: 6, length: 7 },
    false,
    RETURN_ENTRY,
  );
  assert.ok(returned);
  return {
    ownership: returned,
    returnedHref,
    continuationId: issued.continuationId,
  };
}

test("valid transitions from PLP creation through Calculator return consume once", () => {
  const plpHref = `${categoryPath}?page=2&sort=newest`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const { ownership, returnedHref, continuationId } = completeCalculatorReturn(
    plpHref,
    pdpHref,
  );

  assert.equal(ownership.phase, "returned-pdp-bound");
  assert.equal(ownership.continuationConsumed, true);
  assert.equal(ownership.continuationId, continuationId);
  assert.equal(ownership.calcReturnIdx, 6);
  assert.equal(ownership.chainId, CHAIN_A);

  assert.deepEqual(
    decideCatalogReturnNavigation({
      currentHref: returnedHref,
      ownership,
      historyIdx: 6,
      historyLength: 7,
      entryId: RETURN_ENTRY,
    }),
    { mode: "go", delta: -4 },
  );

  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      ownership,
      returnedHref,
      { idx: 9, length: 10 },
      false,
      REOPEN_ENTRY,
    ),
    null,
  );
});

test("handoff parameters without continuation identity stay unowned", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const bound = bindLivePdp(plpHref, pdpHref);
  const constructed = `${pdpHref}&applyQty=12&openAtc=1`;
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      bound,
      constructed,
      { idx: 8, length: 9 },
      false,
      REOPEN_ENTRY,
    ),
    null,
  );
  assert.equal(
    decideCatalogReturnNavigation({
      currentHref: constructed,
      ownership: bound,
      historyIdx: 8,
      historyLength: 9,
      entryId: REOPEN_ENTRY,
    }),
    "replace",
  );
});

test("matching stored activation without returned identity stays unowned", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const bound = bindLivePdp(plpHref, pdpHref);
  const activated = withCatalogNavigationCalculatorActivation(
    bound,
    PDP_ENTRY,
    { idx: 3, length: 4 },
  );
  assert.ok(activated);
  const constructed = `${pdpHref}&applyQty=12&applyUnit=kg&openAtc=1`;
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      activated,
      constructed,
      { idx: 8, length: 9 },
      false,
      REOPEN_ENTRY,
    ),
    null,
  );
});

test("returned identity without activation, entry, and continuation phases stays unowned", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const bound = bindLivePdp(plpHref, pdpHref);
  const withToken = appendCatalogNavParam(pdpHref, CONT_OTHER);
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      bound,
      `${withToken}&applyQty=12&openAtc=1`,
      { idx: 8, length: 9 },
      false,
      REOPEN_ENTRY,
    ),
    null,
  );
  const created = createdOwnership(plpHref, pdpHref, {
    continuationId: CONT_OTHER,
  });
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      created,
      appendCatalogNavParam(`${pdpHref}&applyQty=12&openAtc=1`, CONT_OTHER),
      { idx: 8, length: 9 },
      false,
      REOPEN_ENTRY,
    ),
    null,
  );
});

test("wrong, malformed, repeated, stale, superseded, and consumed identities stay unowned", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const bound = bindLivePdp(plpHref, pdpHref);
  const activated = withCatalogNavigationCalculatorActivation(
    bound,
    PDP_ENTRY,
    { idx: 3, length: 4 },
  );
  assert.ok(activated);
  const href = calculatorHref(activated.activationId!);
  const cursor = { idx: 4, length: 5 };
  assert.equal(
    bindCatalogCalculatorEntryRecord(activated, ACT_OTHER, href, cursor, CALC_ENTRY),
    null,
  );
  assert.equal(
    bindCatalogCalculatorEntryRecord(activated, "not-a-uuid", href, cursor, CALC_ENTRY),
    null,
  );
  assert.equal(
    bindCatalogCalculatorEntryRecord(
      activated,
      [activated.activationId!, ACT_OTHER],
      href,
      cursor,
      CALC_ENTRY,
    ),
    null,
  );
  const entered = bindCatalogCalculatorEntryRecord(
    activated,
    activated.activationId,
    href,
    cursor,
    CALC_ENTRY,
  );
  assert.ok(entered);
  const issued = issueCatalogNavigationContinuationRecord(
    entered,
    href,
    CALC_ENTRY,
    { idx: 4, length: 5 },
  );
  assert.ok(issued);

  const later = { idx: 8, length: 9 };
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      issued,
      appendCatalogNavParam(`${pdpHref}&applyQty=12&openAtc=1`, CONT_OTHER),
      later,
      false,
      REOPEN_ENTRY,
    ),
    null,
  );
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      issued,
      `${pdpHref}&applyQty=12&openAtc=1&nav=not-a-uuid`,
      later,
      false,
      REOPEN_ENTRY,
    ),
    null,
  );
  const repeated = `${pdpHref}&applyQty=12&openAtc=1&nav=${issued.continuationId}&nav=${STALE_NAV}`;
  assert.equal(
    bindCatalogNavigationOwnershipRecord(issued, repeated, later, false, REOPEN_ENTRY),
    null,
  );
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      issued,
      appendCatalogNavParam(`${pdpHref}&applyQty=12&openAtc=1`, STALE_NAV),
      later,
      false,
      REOPEN_ENTRY,
    ),
    null,
  );

  const firstIssued = issued;
  const superseded = issueCatalogNavigationContinuationRecord(
    entered,
    href,
    CALC_ENTRY,
    { idx: 4, length: 5 },
  );
  assert.ok(superseded);
  assert.notEqual(superseded.continuationId, firstIssued.continuationId);
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      superseded,
      appendCatalogNavParam(
        `${pdpHref}&applyQty=12&openAtc=1`,
        firstIssued.continuationId!,
      ),
      later,
      false,
      REOPEN_ENTRY,
    ),
    null,
  );

  const { ownership, returnedHref } = completeCalculatorReturn(plpHref, pdpHref);
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      ownership,
      returnedHref,
      { idx: 11, length: 12 },
      false,
      REOPEN_ENTRY,
    ),
    null,
  );
});

test("refresh of the validated returned PDP stays owned without re-consuming handoff", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const { ownership, returnedHref } = completeCalculatorReturn(plpHref, pdpHref);
  assert.equal(ownership.continuationConsumed, true);

  const refreshed = bindCatalogNavigationOwnershipRecord(
    ownership,
    returnedHref,
    { idx: 6, length: 7 },
    false,
    RETURN_ENTRY,
  );
  assert.ok(refreshed);
  assert.equal(refreshed.phase, "returned-pdp-bound");
  assert.equal(refreshed.continuationConsumed, true);
  assert.equal(refreshed.calcReturnIdx, 6);
  assert.deepEqual(
    decideCatalogReturnNavigation({
      currentHref: returnedHref,
      ownership: refreshed,
      historyIdx: 6,
      historyLength: 7,
      entryId: RETURN_ENTRY,
    }),
    { mode: "go", delta: -4 },
  );
});

test("same URL and reused history cursor after leaving stay unowned", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const bound = bindLivePdp(plpHref, pdpHref);
  const sameEntryAfterSuspend = bindCatalogNavigationOwnershipRecord(
    { ...bound, suspended: true },
    pdpHref,
    { idx: 3, length: 4 },
    false,
    PDP_ENTRY,
  );
  assert.ok(sameEntryAfterSuspend);
  assert.equal(sameEntryAfterSuspend.suspended, false);

  const independent = bindCatalogNavigationOwnershipRecord(
    bound,
    pdpHref,
    { idx: 9, length: 10 },
    false,
    REOPEN_ENTRY,
  );
  assert.equal(independent, null);
});

test("Back then Forward to the owned entry stays valid; independent reopen does not", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const bound = bindLivePdp(plpHref, pdpHref);
  const afterBack = bindCatalogNavigationOwnershipRecord(
    { ...bound, suspended: true },
    pdpHref,
    { idx: 3, length: 4 },
    true,
    PDP_ENTRY,
  );
  assert.ok(afterBack);
  assert.equal(afterBack.bound, true);
  assert.equal(afterBack.suspended, false);
  assert.equal(
    decideCatalogReturnNavigation({
      currentHref: pdpHref,
      ownership: afterBack,
      historyIdx: 3,
      historyLength: 4,
      entryId: PDP_ENTRY,
    }),
    "back",
  );

  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      afterBack,
      pdpHref,
      { idx: 12, length: 13 },
      false,
      REOPEN_ENTRY,
    ),
    null,
  );
});

test("visible return, leave PLP, then direct same PDP+from stays unowned", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const bound = bindLivePdp(plpHref, pdpHref);
  assert.equal(
    decideCatalogReturnNavigation({
      currentHref: pdpHref,
      ownership: bound,
      historyIdx: 3,
      historyLength: 4,
      entryId: PDP_ENTRY,
    }),
    "back",
  );
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      bound,
      pdpHref,
      { idx: 8, length: 9 },
      false,
      REOPEN_ENTRY,
    ),
    null,
  );
  assert.equal(
    decideCatalogReturnNavigation({
      currentHref: pdpHref,
      ownership: bound,
      historyIdx: 8,
      historyLength: 9,
      entryId: REOPEN_ENTRY,
    }),
    "replace",
  );
});

test("Back then direct same PDP+from reusing the former index stays unowned", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const bound = bindLivePdp(plpHref, pdpHref);
  const reusedIndex = bindCatalogNavigationOwnershipRecord(
    { ...bound, suspended: true },
    pdpHref,
    { idx: 3, length: 4 },
    false,
    REOPEN_ENTRY,
  );
  assert.equal(reusedIndex, null);
  assert.equal(
    decideCatalogReturnNavigation({
      currentHref: pdpHref,
      ownership: { ...bound, suspended: true },
      historyIdx: 3,
      historyLength: 4,
      entryId: REOPEN_ENTRY,
    }),
    "replace",
  );
});

test("direct same PDP+from with constructed handoff after activation without completion stays unowned", () => {
  const plpHref = `${categoryPath}?page=2&sort=newest`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const entered = enterCalculator(bindLivePdp(plpHref, pdpHref));
  const constructed = `${pdpHref}&applyQty=12&openAtc=1`;
  const stolen = bindCatalogNavigationOwnershipRecord(
    entered,
    constructed,
    { idx: 8, length: 9 },
    false,
    REOPEN_ENTRY,
  );
  assert.equal(stolen, null);
  assert.equal(
    decideCatalogReturnNavigation({
      currentHref: constructed,
      ownership: entered,
      historyIdx: 8,
      historyLength: 9,
      entryId: REOPEN_ENTRY,
    }),
    "replace",
  );
});

test("independent Calculator reopen cannot reuse a prior calc-entry-bound phase", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const entered = enterCalculator(bindLivePdp(plpHref, pdpHref));
  const href = entered.calcEntryHref!;
  const cursor = { idx: 4, length: 5 };
  assert.equal(
    bindCatalogCalculatorEntryRecord(
      entered,
      entered.activationId,
      href,
      cursor,
      CALC_REOPEN_ENTRY,
    ),
    null,
  );
  assert.equal(
    issueCatalogNavigationContinuationRecord(
      entered,
      href,
      CALC_REOPEN_ENTRY,
      { idx: 4, length: 5 },
    ),
    null,
  );
  const sameEntry = bindCatalogCalculatorEntryRecord(
    entered,
    entered.activationId,
    href,
    cursor,
    CALC_ENTRY,
  );
  assert.ok(sameEntry);
  const issued = issueCatalogNavigationContinuationRecord(
    sameEntry,
    href,
    CALC_ENTRY,
    { idx: 4, length: 5 },
  );
  assert.ok(issued);
  assert.equal(issued.phase, "continuation-issued");
});

test("owned original PDP visible return uses back; unknown context replaces Catalog", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const bound = bindLivePdp(plpHref, pdpHref);
  assert.equal(
    decideCatalogReturnNavigation({
      currentHref: pdpHref,
      ownership: bound,
      historyIdx: 3,
      historyLength: 4,
      entryId: PDP_ENTRY,
    }),
    "back",
  );
  assert.equal(
    decideCatalogReturnNavigation({
      currentHref: pdpHref,
      ownership: null,
      historyIdx: 3,
      historyLength: 4,
      entryId: PDP_ENTRY,
    }),
    "replace",
  );
  assert.equal(
    decideCatalogReturnNavigation({
      currentHref: pdpHref,
      ownership: createdOwnership(plpHref, pdpHref, { chainId: "" }),
      historyIdx: 3,
      historyLength: 4,
      entryId: PDP_ENTRY,
    }),
    "replace",
  );
});

test("length fallback applies only when history idx is unavailable", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const bound = bindCatalogNavigationOwnershipRecord(
    createdOwnership(plpHref, pdpHref, { plpIdx: null, plpLength: 3 }),
    pdpHref,
    { idx: null, length: 4 },
    false,
    PDP_ENTRY,
    null,
    liveTicket(plpHref, pdpHref, null, 3),
  );
  assert.ok(bound);
  assert.equal(bound.pdpLength, 4);
  assert.equal(
    decideCatalogReturnNavigation({
      currentHref: pdpHref,
      ownership: bound,
      historyIdx: null,
      historyLength: 4,
      entryId: PDP_ENTRY,
    }),
    "back",
  );
});

test("activation and continuation helpers reject invalid prior phases", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  assert.equal(
    withCatalogNavigationCalculatorActivation(
      createdOwnership(plpHref, pdpHref),
      PDP_ENTRY,
    ),
    null,
  );
  const bound = bindLivePdp(plpHref, pdpHref);
  assert.equal(
    withCatalogNavigationCalculatorActivation(bound, REOPEN_ENTRY),
    null,
  );
  const href = calculatorHref(ACT_OTHER);
  assert.equal(
    bindCatalogCalculatorEntryRecord(
      bound,
      ACT_OTHER,
      href,
      { idx: 4, length: 5 },
      CALC_ENTRY,
    ),
    null,
  );
  assert.equal(
    issueCatalogNavigationContinuationRecord(bound, href, CALC_ENTRY),
    null,
  );
  const activated = withCatalogNavigationCalculatorActivation(
    bound,
    PDP_ENTRY,
    { idx: 3, length: 4 },
  );
  assert.ok(activated);
  assert.equal(
    issueCatalogNavigationContinuationRecord(
      activated,
      calculatorHref(activated.activationId!),
      CALC_ENTRY,
    ),
    null,
  );
});

test("reload and Back/Forward recognize the same slot when the entry id changes", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const { ownership, returnedHref } = completeCalculatorReturn(plpHref, pdpHref);
  const reloaded = bindCatalogNavigationOwnershipRecord(
    ownership,
    returnedHref,
    { idx: 6, length: 7 },
    false,
    REOPEN_ENTRY,
    "reload",
  );
  assert.ok(reloaded);
  assert.equal(reloaded.calcReturnEntryId, REOPEN_ENTRY);
  assert.deepEqual(
    decideCatalogReturnNavigation({
      currentHref: returnedHref,
      ownership: reloaded,
      historyIdx: 6,
      historyLength: 7,
      entryId: REOPEN_ENTRY,
      navType: "reload",
    }),
    { mode: "go", delta: -4 },
  );

  const bound = bindLivePdp(plpHref, pdpHref);
  const forwarded = bindCatalogNavigationOwnershipRecord(
    { ...bound, suspended: true },
    pdpHref,
    { idx: 3, length: 4 },
    true,
    REOPEN_ENTRY,
  );
  assert.ok(forwarded);
  assert.equal(forwarded.pdpEntryId, REOPEN_ENTRY);

  const remintedForward = bindCatalogNavigationOwnershipRecord(
    { ...bound, suspended: true },
    pdpHref,
    { idx: 9, length: 10 },
    true,
    REOPEN_ENTRY,
  );
  assert.equal(remintedForward, null);
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      { ...bound, suspended: true },
      pdpHref,
      { idx: 9, length: 10 },
      true,
      REOPEN_ENTRY,
      "back_forward",
    ),
    null,
  );
});

test("current PDP href strips one-shot params and keeps from", () => {
  const plpHref = `${categoryPath}?page=2`;
  const search = new URLSearchParams();
  search.set("from", plpHref);
  search.set("applyQty", "3");
  search.set("openAtc", "1");
  search.set("nav", CONT_OTHER);
  assert.equal(
    canonicalizeCurrentProductHref(
      `/catalog/products/${productId}?${search.toString()}`,
    ),
    buildCatalogProductHref(productId, plpHref),
  );
});

test("PLP click ticket binds the immediate PDP with or without Navigation API id", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const ticket = liveTicket(plpHref, pdpHref);
  const withId = bindCatalogNavigationOwnershipRecord(
    createdOwnership(plpHref, pdpHref),
    pdpHref,
    { idx: 3, length: 4 },
    false,
    PDP_ENTRY,
    null,
    ticket,
  );
  assert.ok(withId);
  assert.equal(withId.pdpEntryId, PDP_ENTRY);
  const withoutId = bindCatalogNavigationOwnershipRecord(
    createdOwnership(plpHref, pdpHref),
    pdpHref,
    { idx: 3, length: 4 },
    false,
    null,
    null,
    ticket,
  );
  assert.ok(withoutId);
  assert.equal(withoutId.pdpEntryId, null);
  assert.equal(withoutId.pdpIdx, 3);
  assert.equal(
    decideCatalogReturnNavigation({
      currentHref: pdpHref,
      ownership: withoutId,
      historyIdx: 3,
      historyLength: 4,
      entryId: null,
    }),
    "back",
  );
});

test("portable ticket remains bindable when WebKit exposes successor length late", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const pending = createdOwnership(plpHref, pdpHref, {
    plpIdx: null,
    plpLength: 3,
  });
  const ticket = liveTicket(plpHref, pdpHref, null, 3);
  const early = bindCatalogNavigationOwnershipRecord(
    pending,
    pdpHref,
    { idx: null, length: 3 },
    false,
    null,
    "navigate",
    ticket,
  );
  assert.equal(early?.bound, false);
  const settled = bindCatalogNavigationOwnershipRecord(
    early,
    pdpHref,
    { idx: null, length: 4 },
    false,
    null,
    "navigate",
    ticket,
  );
  assert.ok(settled?.bound);
  assert.equal(settled.pdpLength, 4);
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      pending,
      pdpHref,
      { idx: null, length: 4 },
      false,
      null,
      "reload",
      ticket,
    ),
    null,
  );
});

test("missing, stale, consumed, copied, and superseded transition tickets stay unowned", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const otherHref = buildCatalogProductHref(
    "00000000-0000-0000-a001-000000000611",
    plpHref,
  );
  const pending = createdOwnership(plpHref, pdpHref);
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      pending,
      pdpHref,
      { idx: 3, length: 4 },
      false,
      PDP_ENTRY,
    ),
    null,
  );
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      pending,
      pdpHref,
      { idx: 3, length: 4 },
      false,
      PDP_ENTRY,
      null,
      liveTicket(plpHref, otherHref),
    ),
    null,
  );
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      pending,
      pdpHref,
      { idx: 3, length: 4 },
      true,
      PDP_ENTRY,
      null,
      liveTicket(plpHref, pdpHref),
    ),
    null,
  );
  const first = bindLivePdp(plpHref, pdpHref);
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      createdOwnership(plpHref, pdpHref),
      pdpHref,
      { idx: 3, length: 4 },
      false,
      PDP_ENTRY,
      null,
      liveTicket(plpHref, pdpHref),
    )?.pdpIdx,
    3,
  );
  const newer = bindCatalogNavigationOwnershipRecord(
    createdOwnership(plpHref, otherHref, { pdpHref: otherHref }),
    otherHref,
    { idx: 3, length: 4 },
    false,
    PDP_ENTRY,
    null,
    liveTicket(plpHref, otherHref),
  );
  assert.ok(newer);
  assert.equal(newer.pdpHref, otherHref);
  assert.equal(first.pdpHref, pdpHref);
});

test("exact stored-slot refresh and Back/Forward stay owned; mismatched traversal does not", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const bound = bindLivePdp(plpHref, pdpHref, null);
  const refreshed = bindCatalogNavigationOwnershipRecord(
    bound,
    pdpHref,
    { idx: 3, length: 4 },
    false,
    null,
    "reload",
  );
  assert.ok(refreshed);
  const forwarded = bindCatalogNavigationOwnershipRecord(
    { ...bound, suspended: true },
    pdpHref,
    { idx: 3, length: 4 },
    true,
    null,
  );
  assert.ok(forwarded);
  assert.equal(forwarded.suspended, false);
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      { ...bound, suspended: true },
      pdpHref,
      { idx: 8, length: 9 },
      true,
      null,
    ),
    null,
  );
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      { ...bound, suspended: true },
      pdpHref,
      { idx: 3, length: 4 },
      false,
      null,
    ),
    null,
  );
  assert.equal(
    decideCatalogReturnNavigation({
      currentHref: pdpHref,
      ownership: bound,
      historyIdx: null,
      historyLength: 4,
      entryId: null,
    }),
    "replace",
  );
});

test("portable Calculator chain still issues and consumes a single-use identity", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const bound = bindLivePdp(plpHref, pdpHref, null);
  const activated = withCatalogNavigationCalculatorActivation(
    bound,
    null,
    { idx: 3, length: 4 },
  );
  assert.ok(activated);
  const href = calculatorHref(activated.activationId!);
  const entered = bindCatalogCalculatorEntryRecord(
    activated,
    activated.activationId,
    href,
    { idx: 4, length: 5 },
    null,
  );
  assert.ok(entered);
  assert.equal(entered.calcEntryId, null);
  const issued = issueCatalogNavigationContinuationRecord(
    entered,
    href,
    null,
    { idx: 4, length: 5 },
  );
  assert.ok(issued);
  const returnedHref = mergeCalculatorHandoff(pdpHref, productId, {
    applyQty: "12",
    nav: issued.continuationId,
  });
  const returned = bindCatalogNavigationOwnershipRecord(
    issued,
    returnedHref,
    { idx: 6, length: 7 },
    false,
    null,
  );
  assert.ok(returned);
  assert.equal(returned.phase, "returned-pdp-bound");
  assert.equal(returned.calcReturnEntryId, null);
  assert.deepEqual(
    decideCatalogReturnNavigation({
      currentHref: returnedHref,
      ownership: returned,
      historyIdx: 6,
      historyLength: 7,
      entryId: null,
    }),
    { mode: "go", delta: -4 },
  );
});

test("suspended same-slot remount without traverse is preserved, not consumed as live", () => {
  const plpHref = `${categoryPath}?page=2`;
  const pdpHref = buildCatalogProductHref(productId, plpHref);
  const bound = bindLivePdp(plpHref, pdpHref, null);
  const suspended = { ...bound, suspended: true };
  assert.equal(
    bindCatalogNavigationOwnershipRecord(
      suspended,
      pdpHref,
      { idx: 3, length: 4 },
      false,
      null,
    ),
    null,
  );
  assert.equal(
    shouldPreserveSuspendedCatalogOwnership(
      suspended,
      pdpHref,
      { idx: 3, length: 4 },
      false,
      null,
    ),
    true,
  );
  assert.equal(
    decideCatalogReturnNavigation({
      currentHref: pdpHref,
      ownership: suspended,
      historyIdx: 3,
      historyLength: 4,
      entryId: null,
    }),
    "replace",
  );
  assert.equal(
    shouldPreserveSuspendedCatalogOwnership(
      suspended,
      pdpHref,
      { idx: 8, length: 9 },
      false,
      null,
    ),
    false,
  );
  assert.equal(
    shouldPreserveSuspendedCatalogOwnership(
      suspended,
      pdpHref,
      { idx: 3, length: 4 },
      true,
      null,
    ),
    false,
  );
});
