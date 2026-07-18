# Review Workflow

Use this workflow for code, architecture, or documentation reviews.

---

## Required Reading

- `.ai/constitution/project-constitution.md`
- `docs/development/definition-of-done.md`
- standards relevant to the reviewed area

---

## Review Priorities

Findings must prioritize:

1. correctness bugs
2. security/privacy risks
3. architecture violations
4. SEO regressions
5. accessibility regressions
6. performance regressions
7. maintainability risks
8. documentation gaps

Style-only issues are lowest priority unless they violate project standards.

---

## Steps

1. Identify the change scope.
2. Read affected files and related standards.
3. Check dependency direction.
4. Check data flow and service boundaries.
5. Check mobile/accessibility/SEO impact where relevant.
6. Check docs and tests.
7. Report findings by severity.

---

## Output Rules

Lead with findings.

For each finding include:

- severity
- affected file or area
- problem
- reason
- suggested fix

If no issues are found, say so and mention residual risks or test gaps.

---

## Review Guardrails

- Do not rewrite code during review unless asked.
- Do not over-focus on preferences.
- Do not suggest future-phase implementation unless relevant to the risk.
- Do not ask for new packages when existing tools are sufficient.
