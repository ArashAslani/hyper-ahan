# Refactor Workflow

Use this workflow only for approved refactors.

---

## Required Reading

- `.ai/constitution/project-constitution.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/folder-structure.md`
- `docs/development/coding-standards.md`
- `docs/development/definition-of-done.md`

---

## Steps

1. Define the refactor goal.
2. Confirm behavior must remain unchanged.
3. Inspect affected modules and imports.
4. Identify risks and rollback path.
5. Create a plan and wait for approval if files move/rename/delete or architecture changes.
6. Refactor in small steps.
7. Keep public contracts stable unless explicitly approved.
8. Run lint and typecheck.
9. Update docs when architecture or standards change.
10. Report what improved and how behavior was preserved.

---

## Refactor Rules

- No feature work.
- No visual redesign.
- No dependency changes without approval.
- No broad formatting-only churn unless the task is formatting.
- No dead-code deletion unless explicitly approved.

---

## Success Criteria

A refactor succeeds when:

- behavior is unchanged
- complexity or duplication is reduced
- architecture boundaries are clearer
- validation passes
- docs remain accurate
