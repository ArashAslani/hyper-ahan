# Bugfix Workflow

Use this workflow when fixing incorrect behavior.

---

## Required Reading

- `.ai/constitution/project-constitution.md`
- `docs/development/coding-standards.md`
- `docs/development/definition-of-done.md`
- architecture/API/UI docs relevant to the bug

---

## Steps

1. Reproduce or inspect the bug.
2. Identify the root cause.
3. Check nearby similar code paths.
4. Plan the smallest safe fix.
5. Implement only the fix.
6. Avoid unrelated refactors.
7. Run lint and typecheck.
8. Update documentation if behavior or standards change.
9. Report root cause, fix, validation, and remaining risk.

---

## Rules

- Do not hide unknown causes behind broad defensive code.
- Do not change architecture unless the bug is architectural and approval is given.
- Do not install packages to fix a local bug without approval.
- Do not modify future-phase surfaces unless directly related.

---

## Final Report Shape

Include:

- root cause
- fix
- validation
- any test gap
