# Refactor Prompt Template

Use this template for approved refactors.

---

## Prompt

```text
You are refactoring HyperAhan.

Refactor goal:
[Describe the exact improvement]

Read first:
- .ai/constitution/project-constitution.md
- docs/architecture/frontend-architecture.md
- docs/architecture/folder-structure.md
- docs/development/coding-standards.md
- docs/development/definition-of-done.md

Constraints:
- Preserve public behavior.
- Do not implement features.
- Do not install packages.
- Do not move, rename, or delete files without explicit approval.
- Do not refactor unrelated areas.
- Keep architecture boundaries intact.
- Update docs if a standard or architecture decision changes.

Required workflow:
1. Analyze current structure.
2. Explain risk and rollback path.
3. Create a concise plan.
4. Wait for approval if architecture or file structure changes.
5. Refactor narrowly.
6. Run lint and typecheck.
7. Report behavior-preservation evidence.
```

---

## Fill Before Use

- Refactor target:
- Reason:
- Behavior that must remain unchanged:
- Files likely affected:
- Approval needed for moves/deletes:
