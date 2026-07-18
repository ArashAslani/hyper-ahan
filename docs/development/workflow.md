# Development Workflow

**Status:** Permanent Phase 1 standard  
**Purpose:** Define the official workflow for every future task.

This workflow applies to humans and AI agents. It is designed to prevent accidental feature scope, architecture drift, and documentation debt.

---

## Required Task Flow

Every task must follow this order:

1. Read documentation
2. Analyze the current code
3. Create a plan
4. Wait for approval when the task changes architecture, dependencies, scope, or user-visible behavior
5. Implement
6. Self-review
7. Update documentation
8. Mark ready for commit

Do not skip steps because a change looks small.

---

## 1. Read Documentation

Before implementation, read the documents relevant to the task:

- `.ai/constitution/project-constitution.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/folder-structure.md`
- `docs/development/coding-standards.md`
- `docs/development/definition-of-done.md`
- feature-specific docs if they exist
- API/SEO/UI standards when relevant

For AI agents, this step is mandatory. Do not rely on memory.

---

## 2. Analyze

Inspect the current implementation before proposing changes.

Analysis must identify:

- existing patterns
- impacted files
- architectural boundaries
- data flow
- SEO impact
- responsive/mobile impact
- possible duplication
- whether documentation must change

If the task asks for a feature that belongs to a future phase, stop and ask for confirmation.

---

## 3. Create a Plan

The plan must be short but specific.

Include:

- scope
- files likely to change
- architecture impact
- risk level
- validation steps

For documentation-only tasks, list documents to create or update.

---

## 4. Wait for Approval

Approval is required when a task:

- changes architecture
- installs or removes packages
- moves, renames, or deletes files
- introduces a new route
- changes public UI behavior
- connects backend/API
- adds authentication/admin/blog
- changes SEO URL strategy
- conflicts with roadmap phase scope

Approval is not required for:

- typo fixes
- documentation updates within approved scope
- safe lint fixes
- small bug fixes with obvious intent

---

## 5. Implement

Implementation rules:

- Keep scope narrow.
- Follow existing patterns.
- Do not mix refactors with features.
- Do not add dependencies without approval and documentation.
- Do not touch unrelated files.
- Keep mocks behind services.
- Keep client boundaries small.

If implementation reveals a new architectural decision, pause and document it before proceeding.

---

## 6. Self-Review

Before handing off:

- Review the diff.
- Check for unrelated changes.
- Check imports and dependency direction.
- Check naming and duplication.
- Check accessibility and responsive behavior.
- Check SEO when the page is indexable.
- Confirm no roadmap phase was implemented accidentally.

AI agents must explicitly verify they did not create Blog, Admin, Auth, or backend integration unless requested in the active phase.

---

## 7. Update Documentation

Documentation updates are required when:

- behavior changes
- architecture changes
- folder structure changes
- public routes change
- API contracts change
- UI standards change
- SEO strategy changes
- a new pattern becomes official

Do not leave future agents guessing why a decision was made.

---

## 8. Ready for Commit

A task is ready for commit only when:

- implementation matches scope
- lint passes
- typecheck passes
- documentation is current
- Definition of Done is satisfied
- no unrelated files are included

Do not commit unless the user explicitly asks.

---

## Branch Hygiene

Rules:

- Keep commits focused.
- Do not mix documentation, refactor, feature, and package changes unless the task requires it.
- Avoid large PRs.
- Explain why changes were made, not just what changed.

---

## AI Agent Workflow Rules

AI agents must:

- start by reading relevant docs
- prefer existing patterns over invention
- ask before changing architecture
- avoid large context-consuming searches when a targeted read is enough
- update docs when they create or change standards
- keep final reports concise and factual

AI agents must not:

- implement future phases early
- install packages without documented approval
- delete or move files without explicit instruction
- edit generated or unrelated files
- use mocks directly in UI
