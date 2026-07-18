# Business Principles

**Status:** Permanent Phase 1 standard  
**Purpose:** Define product and conversion principles for HyperAhan.

HyperAhan is an SEO-first steel e-commerce platform. The primary business goal is to convert visitors into customers.

---

## Business Goals

Primary goal:

- convert steel buyers into qualified purchase requests

Supporting goals:

- make price discovery fast
- build trust with buyers
- reduce friction before contact/order submission
- support SEO acquisition
- prepare for scalable catalog, orders, and admin operations

The project must optimize for long-term maintainability and conversion quality, not feature quantity.

---

## Target Audience

Primary audiences:

- contractors and builders buying steel for projects
- small business buyers comparing daily prices
- procurement users who need quick consultation
- returning customers tracking requests/orders

Audience traits:

- often mobile-first
- price-sensitive
- trust-sensitive
- may prefer phone confirmation before purchase
- needs clear units, specs, and availability context

The UI must not assume users want a fully self-service checkout before talking to an expert.

---

## User Journey

Core journey:

1. Visitor lands from search, direct, or referral.
2. Visitor finds category/product/price.
3. Visitor evaluates trust and relevance.
4. Visitor adds item to cart or contacts expert.
5. Visitor submits purchase request.
6. Expert follows up.
7. Customer tracks order status.

Every major page should support one or more steps in this journey.

---

## Trust Building

Trust is essential in steel commerce.

Trust signals should include:

- clear business identity
- visible phone/contact access
- transparent price units
- expert consultation messaging
- order tracking expectations
- accurate product specs
- realistic availability/pricing language

Avoid vague claims that cannot be supported.

---

## Conversion Principles

Rules:

- Primary CTA must be clear.
- Users must always know the next step.
- Product pages must make price/unit/spec visible quickly.
- Cart/checkout must reduce uncertainty.
- Contact and consultation must be easy to reach.
- Do not add friction unless legally or operationally required.

Conversion is not only checkout. For this business, phone consultation can be a conversion path.

---

## CTA Philosophy

CTA text must describe the outcome.

Good:

- Add to cart
- Submit purchase request
- Call expert
- Track order

Avoid:

- Click here
- Submit
- Continue when the destination is unclear

Primary and secondary CTAs must be visually distinct.

---

## Content Strategy

Content must support buying decisions.

Priority content types:

- category explanations
- product specifications
- price and unit guidance
- buying guides
- trust/support information
- future articles around steel purchase intent

Do not publish thin content just to fill pages.

---

## SEO Strategy

SEO must target commercial and informational intent.

Priority page types:

- category pages
- product pages
- article/guides in future phases
- business/contact pages

SEO content must be accurate, useful, and internally linked to conversion paths.

---

## Admin Goals

Future admin exists to support operations, not to impress technically.

Admin should help manage:

- products
- categories
- prices
- orders
- customer requests
- content
- uploads

Admin must prioritize reliability, clarity, and auditability over visual complexity.

---

## Future Roadmap

Future phases must follow `docs/roadmap/project-roadmap.md`. The current official sequence is:

1. complete the Business & UX Blueprint before implementation assumptions harden
2. stabilize foundation cleanup/tooling using the blueprint
3. prepare SEO/catalog foundations
4. connect backend services through the service layer
5. add authentication/customer continuity
6. mature checkout/orders
7. add admin only when operationally needed
8. add content/blog only when editorial process and conversion paths are ready
9. optimize performance, analytics, tests, and scale

Do not build future surfaces early if core conversion is not stable.

---

## Product Decision Rule

Before adding a feature, ask:

- Does it help visitors become customers?
- Does it improve trust or clarity?
- Does it support SEO or conversion?
- Can a solo developer maintain it?
- Does it belong in the current roadmap phase?

If the answer is no, defer it.
