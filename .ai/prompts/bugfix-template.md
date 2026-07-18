# Bugfix Prompt Template

Use this template when requesting a bugfix.

---

## Prompt

```text
You are fixing a bug in HyperAhan.

Bug:
[Describe observed behavior]

Expected behavior:
[Describe correct behavior]

Read first:
- .ai/constitution/project-constitution.md
- docs/development/coding-standards.md
- docs/development/definition-of-done.md
- standards relevant to the affected area

Constraints:
- Find the root cause.
- Keep the fix minimal.
- Do not refactor unrelated code.
- Do not install packages.
- Do not change architecture without approval.
- Update docs if behavior or standards change.

Required output:
- root cause
- fix summary
- validation run
- remaining risk or test gap
```

---

## Fill Before Use

- Steps to reproduce:
- Current behavior:
- Expected behavior:
- Affected route/component/service:
- Screenshots/logs if available:
