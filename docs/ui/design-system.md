# Design System Standard

**Status:** Permanent Phase 1 standard  
**Purpose:** Define product-level UI rules without prescribing implementation details.

HyperAhan is a mobile-first steel marketplace. The design system must make price discovery, trust, and purchase intent clear on small screens.

---

## Design Philosophy

The UI must feel:

- fast
- practical
- trustworthy
- direct
- readable on low-end mobile devices
- optimized for conversion, not decoration

The product sells industrial goods. Visual design should support confidence, clarity, and action. Avoid visual complexity that distracts from price, availability, contact, and checkout.

---

## Component Hierarchy

Components belong to one of three levels:

1. **Primitives:** buttons, inputs, cards, badges, modals, sheets.
2. **Compositions:** product cards, order timeline, cart summary, filter sheet.
3. **Feature views:** complete page sections owned by a feature.

Primitives must remain domain-neutral.

Compositions may encode product UX patterns but should avoid backend details.

Feature views may contain business context and orchestration.

---

## Layout Philosophy

The primary layout is mobile-first.

Rules:

- Design first for one-handed mobile use.
- Keep the primary content column narrow on desktop.
- Preserve the active shell: top bar plus bottom navigation.
- Place primary CTAs near the thumb zone when appropriate.
- Avoid desktop-first mega menus for MVP customer flows.
- Do not hide critical content behind hover-only interactions.

Desktop should enhance readability, not replace the mobile experience.

---

## Spacing

Spacing must create scanability.

Rules:

- Use consistent spacing increments from Tailwind/theme tokens.
- Group related content tightly.
- Separate unrelated sections clearly.
- Avoid cramped touch targets.
- Keep sticky UI from covering important content.

Spacing should guide users toward price, product details, and CTA.

---

## Typography

Typography must prioritize readability in Persian and numeric price scanning.

Rules:

- Use the approved project font.
- Keep price text visually strong.
- Use concise headings.
- Avoid long paragraphs on product and conversion pages.
- Maintain clear hierarchy between title, metadata, price, and CTA.
- Numbers, units, and prices must be easy to compare.

Do not create new font families without a documented design decision.

---

## Icons

Icons support recognition; they do not replace text for important actions.

Rules:

- Use icons consistently.
- Pair icons with labels in navigation and key actions.
- Avoid decorative icon clutter.
- Import icons individually to protect bundle size.
- Use accessible labels for icon-only controls.

---

## Colors

Colors must come from design tokens.

Rules:

- Use semantic tokens (`primary`, `accent`, `surface`, `danger`, `success`, etc.).
- Do not introduce arbitrary color families for one-off screens.
- Ensure sufficient contrast.
- Use accent color for conversion actions with discipline.
- Status colors must be consistent across order, cart, and admin views.

Color should never be the only way to communicate status.

---

## Responsive Strategy

Mobile is the base. Larger breakpoints may add breathing room, not new product behavior.

Rules:

- Important actions must be visible and reachable on mobile.
- Forms must be usable without horizontal scrolling.
- Cards must stack naturally.
- Tables need a mobile representation before they ship.
- Dialogs should become bottom sheets when better for mobile ergonomics.

---

## Loading States

Loading states must reduce uncertainty.

Rules:

- Use skeletons for content that has predictable shape.
- Use spinners only for short, isolated actions.
- Keep layout stable while loading.
- Do not block the whole page for small async actions.
- Show action-specific pending states for buttons.

---

## Empty States

Empty states must tell the user what to do next.

Rules:

- Explain the empty condition briefly.
- Provide a clear next action.
- Avoid blame or technical language.
- Use empty states for cart, orders, search, filters, and admin tables.

---

## Tables

Tables are not mobile-first by default. Use them only when comparison or admin density requires them.

Rules:

- Customer-facing mobile views should prefer cards/lists.
- Admin tables must support search, filter, sort, and pagination when data grows.
- Numeric columns must align consistently.
- Row actions must be clear and not cramped.
- Empty, loading, and error states are required.

---

## Forms

Forms must minimize friction.

Rules:

- Ask only for needed fields.
- Labels must always be available.
- Validation must be clear and close to the field.
- Use input types appropriate to mobile keyboards.
- Preserve user input on validation errors.
- Primary action text must describe the outcome.

Checkout forms must prioritize completion over visual novelty.

---

## Dialogs

Dialogs interrupt the user and must be used carefully.

Rules:

- Use dialogs for confirmation, focused input, or important feedback.
- Use bottom sheets for mobile filters and quick choices.
- Provide obvious close/cancel behavior.
- Avoid nested dialogs.
- Do not use browser `alert()` in production UI.

---

## Cards

Cards must be scannable.

Product cards should prioritize:

- product name
- key spec
- price
- unit
- trust/availability cue
- primary action or link

Do not overload cards with every field from the backend.

---

## Navigation

Navigation must support the customer journey:

1. discover category/product
2. compare price
3. view detail
4. add to cart/contact
5. checkout
6. track order

Rules:

- Bottom navigation owns primary mobile destinations.
- Top bar owns brand, search, phone/contact, and cart affordances.
- Footer/secondary navigation must not compete with conversion actions.
- Route labels must be consistent with business language.

---

## Trust Elements

Steel buyers need confidence.

Use trust elements for:

- expert consultation
- phone contact
- order tracking
- clear pricing units
- transparent checkout expectations
- business identity and contact information

Trust elements must be specific, not generic marketing filler.
