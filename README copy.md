# Restful-Booker API Test Suite

A comprehensive API test framework for the [Restful-Booker API](https://restful-booker.herokuapp.com/apidoc/index.html) built with **Playwright**, **TypeScript**, **Faker.js**, and **Allure** reporting.

## Architecture

```
restful-booker/
├── src/
│   ├── builders/          # Builder pattern for test data construction
│   │   └── booking.builder.ts
│   ├── config/            # API and Allure configuration
│   │   ├── api.config.ts
│   │   └── allure.config.ts
│   ├── factories/         # Factory pattern with Faker.js for dynamic data
│   │   └── booking.factory.ts
│   ├── fixtures/          # Playwright test fixtures (DI composition root)
│   │   └── test.fixture.ts
│   ├── services/          # Service layer abstracting API calls
│   │   ├── auth.service.ts
│   │   ├── booking.service.ts
│   │   └── http-client.ts  # IHttpClient abstraction (DIP)
│   └── types/             # TypeScript interfaces generated from API docs
│       └── booking.types.ts
├── tests/
│   ├── auth.spec.ts        # Authentication tests
│   ├── booking.spec.ts     # CRUD tests (Create, Read, Update, Delete)
│   └── negative.spec.ts    # Negative / edge case tests
├── .github/workflows/
│   └── ci.yml             # GitHub Actions CI pipeline
├── .husky/                # Pre-commit hooks
├── playwright.config.ts
├── tsconfig.json
├── .eslintrc.json
└── .prettierrc
```

## Design Patterns & Principles

| Pattern / Principle | Where Applied |
|---|---|
| **Dependency Inversion (DIP)** | `IHttpClient` interface; services depend on abstraction not concrete class |
| **Builder** | `BookingBuilder` — fluent API for constructing `Booking` objects |
| **Factory** | `BookingFactory` — creates random and deterministic test data using Faker.js |
| **Fixture / Composition Root** | `test.fixture.ts` — wires dependencies into Playwright extended fixtures |

## Setup

```bash
npm install
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific suites
npm run test:auth
npm run test:booking
npm run test:negative
```

## Allure Reporting

```bash
# Generate and open the Allure report
npm run allure:report

# Generate only
npm run allure:generate

# Open existing report
npm run allure:open
```

## Linting & Formatting

```bash
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier auto-format
npm run format:check  # Prettier check (used in CI)
```

## CI/CD

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs:
1. **Lint job** — ESLint + Prettier check (pipeline fails if any violations)
2. **Test job** — Playwright API tests (pipeline fails if any tests fail)
3. **Allure report job** — Generates Allure HTML report and uploads as artifact

## API Endpoints Covered

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth` | Create authentication token |
| GET | `/ping` | Health check |
| GET | `/booking` | Get all booking IDs (with optional filters) |
| GET | `/booking/:id` | Get a specific booking |
| POST | `/booking` | Create a new booking |
| PUT | `/booking/:id` | Full update of a booking |
| PATCH | `/booking/:id` | Partial update of a booking |
| DELETE | `/booking/:id` | Delete a booking |

## Authentication Methods

- **Token** (`Cookie: token=<value>`) — obtained via `/auth` endpoint
- **Basic Auth** (`Authorization: Basic <base64>`) — `admin:password123`
