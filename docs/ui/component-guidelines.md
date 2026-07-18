# Component Guidelines

**Status:** Permanent Phase 1 standard  
**Purpose:** Define when and how reusable components should be created.

Reusable components are contracts. Create them carefully.

---

## Shared vs Feature-Specific

Keep a component feature-specific when:

- it contains business language
- it depends on product/order/cart/auth concepts
- it has only one real use case
- it would require vague props to become shared
- it changes with one feature's requirements

Move a component to `shared/ui` when:

- it is domain-neutral
- it has at least two real use cases
- its API is stable and simple
- it improves consistency
- it does not import services or feature code

Default decision: keep local first, promote later.

---

## Props Philosophy

Props should describe intent, not implementation leaks.

Rules:

- Keep prop names clear and business-readable.
- Prefer explicit props over generic `config` objects.
- Avoid boolean explosions (`primary`, `danger`, `large`, `rounded`, etc.).
- Use `variant` only for approved visual variants.
- Use `children` for composition.
- Keep event names specific (`onSubmitOrder`, not `onClickThing`) when business intent matters.

Bad:

```tsx
<Box type="orange" mode="big" data={x} />
```

Better:

```tsx
<Button variant="accent" size="lg">Submit request</Button>
```

---

## Composition Rules

Prefer composition over configuration.

Rules:

- Let callers pass content as children when layout is stable.
- Split complex components into named subcomponents only when it improves clarity.
- Do not create a single component that handles unrelated layouts.
- Avoid render-prop patterns unless they solve a real reuse problem.

Components should be easy to read at the call site.

---

## Variant Rules

Variants are allowed when they represent approved design-system options.

Examples:

- button visual style
- input state
- badge status
- card emphasis

Rules:

- Variants must be finite and typed.
- Variant names must be semantic.
- Do not add one-off variants for one screen.
- Do not encode feature-specific behavior in shared variants.

If a variant is needed only once, prefer a feature-specific wrapper.

---

## Accessibility Rules

Reusable components must protect accessibility by default.

Rules:

- Buttons must render buttons unless navigation is intended.
- Links must render links when navigation is intended.
- Inputs must support labels and error messages.
- Icon-only controls need accessible names.
- Disabled states must be clear.
- Focus states must remain visible.
- Dialog/sheet components must define close behavior.

No reusable component should make accessible usage harder than inaccessible usage.

---

## Styling Rules

Rules:

- Use design tokens.
- Avoid arbitrary colors unless documented.
- Keep touch targets practical.
- Do not expose low-level class composition as the primary API.
- Allow `className` only when it does not undermine the component contract.

Shared components must enforce consistency. They are not just wrappers around arbitrary styles.

---

## Data Rules

Shared UI components must not fetch data.

Rules:

- Data loading belongs in routes, services, or feature orchestration.
- Shared components receive ready-to-render props.
- Shared components must not import mocks, services, or feature constants.

Feature components may receive domain objects, but should still avoid backend DTOs.

---

## Promotion Checklist

Before moving a component to `shared/ui`:

- Is it used in at least two places?
- Is it domain-neutral?
- Can it be documented in one sentence?
- Is the prop API small?
- Does it avoid services/mocks/features?
- Does it follow design tokens?
- Does it handle accessibility basics?

If any answer is no, keep it feature-local.

---

## Deprecation

If a shared component becomes too feature-specific:

- stop adding variants
- create a feature-local component
- migrate call sites deliberately
- document why the shared component changed or was deprecated

Do not keep expanding a broken abstraction.
