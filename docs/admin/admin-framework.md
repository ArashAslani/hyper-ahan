# Admin Framework Standard

**Status:** Permanent Phase 1 standard  
**Purpose:** Define future admin principles without implementing admin.

Admin is not allowed until the official Admin Foundation phase. This document defines standards for the future phase where admin becomes approved.

---

## Admin Philosophy

Admin must be operational software.

Priorities:

- accuracy
- clarity
- safe editing
- auditability
- speed for repeated tasks
- low maintenance

Avoid building admin as a second marketing website. Admin should help the business manage catalog, prices, orders, and content reliably.

---

## Layout

Future admin layout should be:

- desktop-capable
- usable on tablet
- clear in hierarchy
- dense where useful, but not cramped
- separated from customer storefront navigation

Admin layout must not reuse customer bottom navigation.

---

## Navigation

Navigation should reflect operational tasks.

Likely sections:

- Dashboard
- Products
- Categories
- Prices
- Orders
- Customers
- Content
- Uploads
- Settings

Navigation labels must be stable and business-readable.

---

## Dashboard

Dashboard should summarize operational priorities.

Useful cards:

- new purchase requests
- orders needing review
- recent price updates
- low-quality/incomplete product data
- content needing review

Do not add vanity metrics unless they drive action.

---

## Permissions

Future admin must assume permissions will matter.

Conceptual roles:

- Owner
- Manager
- Content editor
- Order operator
- Read-only viewer

Rules:

- Sensitive actions require explicit permission.
- Destructive actions require confirmation.
- Permission decisions must be enforced by backend, not only UI.

Frontend may hide unavailable actions, but backend remains authority.

---

## CRUD Philosophy

CRUD must be safe and predictable.

Rules:

- Prefer edit screens for complex records.
- Use inline edits only for simple, reversible fields.
- Confirm destructive actions.
- Preserve unsaved form state where practical.
- Show validation near fields.
- Show clear success/error feedback.

Admin CRUD must protect business data quality.

---

## Tables

Admin tables should support operations at scale.

Standards:

- search
- filters
- sorting
- pagination
- visible row actions
- clear empty/loading/error states
- stable columns
- responsive strategy

Tables must not fetch directly from components. Data access belongs in admin services or shared services.

---

## Forms

Admin forms must be structured and forgiving.

Rules:

- group related fields
- mark required fields
- validate before submit
- show backend errors clearly
- avoid losing input after failure
- use explicit save/cancel actions
- support file/upload fields only when the API strategy exists

Forms should map to business concepts, not raw database tables.

---

## Uploads

Uploads require a documented API and storage strategy before implementation.

Standards:

- validate file type and size
- show progress
- support failure recovery
- store metadata
- avoid exposing private URLs unintentionally
- optimize images before public use where appropriate

Do not implement uploads without backend contract.

---

## Notifications

Admin notifications should be action-specific.

Use notifications for:

- saved changes
- failed requests
- validation summaries
- long-running upload/process status

Avoid noisy success messages for every minor interaction.

---

## Search and Filters

Search and filters should match operational questions.

Examples:

- product name/spec/factory
- order status/date/customer phone
- content status
- price update date

Filter state should be shareable or restorable when it supports operations.

---

## No Implementation Rule

Until the admin phase is explicitly approved:

- do not create admin routes
- do not create admin components
- do not add admin packages
- do not implement permission logic
- do not connect admin API endpoints

This document is a future framework only.
