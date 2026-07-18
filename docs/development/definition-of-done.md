# Definition of Done

**Status:** Permanent Phase 1 standard  
**Purpose:** Define when work is complete.

A feature, bugfix, refactor, or documentation change is not done because the UI appears to work. It is done only when the relevant criteria below are satisfied.

---

## Universal Criteria

Every task must satisfy:

- Scope matches the approved request.
- No unrelated files were changed.
- Architecture boundaries are respected.
- Documentation is updated when needed.
- No new package was installed without approval.
- No future roadmap phase was implemented accidentally.
- `npm run lint` passes.
- `npm run typecheck` passes.

---

## Feature Criteria

A feature is complete only if:

- Implementation matches the approved plan.
- UI is mobile-first.
- Responsive behavior is checked.
- Accessibility basics are covered.
- SEO impact is handled for indexable pages.
- Reusable components are extracted only when justified.
- No business rule is duplicated across features.
- Data access goes through services.
- Mocks are not imported by UI.
- Loading, empty, and error states are considered.
- Documentation is updated.

---

## Bugfix Criteria

A bugfix is complete only if:

- The root cause is understood.
- The fix is minimal.
- The fix does not mask the problem with unrelated guards.
- Similar code paths are checked.
- A regression test is added when test infrastructure exists.
- Documentation is updated if behavior or standards change.

---

## Refactor Criteria

A refactor is complete only if:

- Public behavior is unchanged.
- The motivation is documented or obvious.
- The diff reduces complexity, duplication, or risk.
- No feature work is mixed in.
- Imports still follow dependency direction.
- Lint and typecheck pass.

---

## Documentation Criteria

Documentation is complete only if:

- It is written in English for official standards.
- It is specific to HyperAhan.
- It contains no placeholder sections.
- It defines ownership and rules where relevant.
- It can guide a future AI agent without extra explanation.
- It links or names related standards when helpful.

---

## Accessibility Criteria

For UI work:

- Interactive targets are at least 44px where practical.
- Buttons and links use the correct element.
- Inputs have labels.
- Dialogs and sheets have clear close behavior.
- Color is not the only signal.
- Keyboard navigation is not broken.
- Loading states are announced or understandable.

---

## Responsive Criteria

For UI work:

- Mobile layout is the primary layout.
- Desktop does not stretch content awkwardly.
- Sticky/fixed UI does not hide primary actions.
- Forms are usable on small screens.
- Tables have a mobile strategy before they are introduced.

---

## SEO Criteria

For indexable pages:

- Metadata is defined.
- Canonical URL strategy is respected.
- Page has meaningful server-rendered content.
- Images have alt text.
- Structured data is considered where relevant.
- Internal links use stable routes.
- No client-only dependency prevents crawlable content.

---

## Reuse Criteria

Extract reusable code when:

- there are at least two real use cases
- the abstraction is domain-neutral or has a clear domain owner
- the API is simpler than repeated code
- it reduces future maintenance

Do not extract when:

- it creates vague props
- it mixes business contexts
- it hides important differences
- it exists only to reduce line count

---

## Final Handoff Checklist

Before reporting completion:

- Summarize changed files by purpose.
- Report validation commands run.
- Report anything not run and why.
- Report remaining risks.
- Confirm whether docs were updated.
- Do not claim readiness if lint/typecheck failed.
