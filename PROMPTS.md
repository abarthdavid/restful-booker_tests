# PROMPTS.md

## Purpose

This log captures how AI-assisted and manual approaches were used while building and stabilizing the Playwright API framework.

## 1) Architecture Decisions (AI-assisted + Manual)

### Challenge

Keep strict layering so tests never call raw HTTP requests directly.

### Approach

- AI-assisted: identified layering leaks where `.spec.ts` files used direct request calls.
- Manual implementation: moved those operations into `BookingService` methods.

### Result

- `tests/*.spec.ts` now execute API behavior through service methods only.
- Added helper methods to service layer for negative/auth variants:
  - `updateBookingWithToken`
  - `updateBookingWithBasicAuth`
  - `deleteBookingWithoutAuth`
  - `patchBookingCollection`
  - `createBookingRaw`
  - `createBookingMalformedJson`

## 2) Site Exploration and API Understanding

### Manual evidence

- API documentation source analyzed: https://restful-booker.herokuapp.com/apidoc/index.html
- Extracted endpoint contract and mapped to typed interfaces in `src/types/booking.types.ts`.

### MCP note

- Equivalent exploration can be done with Playwright MCP for endpoint behavior checks and payload experimentation.
- This repository keeps a manual analysis trail in code (`types`, `services`, and tests) for reproducibility.

## 3) Automated Healing Example

### Failure Pattern

Negative tests had intermittent maintenance issues due to mixed direct request calls and service abstractions.

### Healing Strategy

- AI-assisted detection of anti-pattern (layering violation).
- Manual refactor to service-only usage and centralized auth/payload behavior.

### Outcome

- Reduced duplication in tests.
- Easier future healing because auth and request mechanics are in one layer.

## 4) CI/CD Decisions (AI-assisted + Manual)

### Challenge

Meet DoD requirements for parallel execution, artifacts, and failure traceability.

### Changes

- Sharded Playwright execution in CI matrix.
- Per-shard artifact upload for Allure and Playwright reports.
- Traceability via retained traces on failure and `test-results` artifact upload.

### Outcome

- Faster parallel test execution.
- Better diagnosis for failed CI runs.

## 5) Prompting Style Used

- Ask AI for architectural gaps against DoD.
- Ask AI to propose minimal, targeted refactors.
- Apply changes manually when endpoint-specific behavior needed explicit control.
