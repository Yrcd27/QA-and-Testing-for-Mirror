# QA & Testing — Mirror Journaling App

> **Application repo:** [github.com/Yrcd27/Mirror](https://github.com/Yrcd27/Mirror)

A complete software quality assurance project covering the full testing pyramid — unit tests, API testing, end-to-end browser automation, load testing, security analysis, and CI/CD pipeline automation.

---

## Testing Strategy Overview

```
          ╔══════════════════════╗
          ║   Security Testing   ║  ← OWASP Top 10 analysis & fixes
          ╠══════════════════════╣
          ║     E2E Testing      ║  ← Selenium WebDriver (3 test scripts)
          ╠══════════════════════╣
          ║    API Testing       ║  ← Postman collections + Newman
          ╠══════════════════════╣
          ║    Unit Testing      ║  ← Jest + Supertest (9 test cases)
          ╚══════════════════════╝
                 CI/CD (GitHub Actions) runs all of the above
```

---

## Unit Tests — Jest + Supertest

**Directory:** `unit-tests/`
**Framework:** Jest with Supertest for HTTP assertions
**Run order:** Registration suite → Login suite (sequential to handle state dependency)

### Registration Suite — `auth/registration.test.js`

| # | Test Case | Expected |
|:---:|:---|:---:|
| 1 | Register a new user with valid data | `201` |
| 2 | Fail when required fields are missing | `400` |
| 3 | Fail when password is shorter than 8 characters | `400` |
| 4 | Fail when registering with an already-used email | `400` |

### Login Suite — `auth/login.test.js`

| # | Test Case | Expected |
|:---:|:---|:---:|
| 5 | Login successfully with valid credentials | `200` + JWT token |
| 6 | Fail when email or password field is missing | `400` |
| 7 | Fail with a non-existent email | `400` |
| 8 | Fail with a correct email but wrong password | `400` |
| 9 | Register a second user and login successfully | `201` → `200` |

**Test data** is generated with timestamps to ensure unique emails on every run — no database cleanup needed between runs.

```bash
cd unit-tests
npm test
```

---

## End-to-End Tests — Selenium WebDriver

**Directory:** `selenium-tests/`
**Browser:** Chrome (headless-capable, auto-detects binary path)
**Pattern:** Each test pre-checks that both servers are reachable before launching the browser

### Test Scripts

| Script | Flow Tested |
|:---|:---|
| `login-test.js` | Navigate to login page → fill credentials → submit → verify dashboard redirect |
| `journal-creation-test.js` | Login → navigate to new entry → fill content → save → verify redirect |
| `login-journal-test.js` | Full combined flow: login + journal creation with mood selection in one run |

### What Each Test Verifies

- **Server health check** before test begins (backend + frontend reachability)
- **Element targeting** using CSS selectors with fallback chains for resilience
- **URL assertion** (`until.urlContains('/dashboard')`) to confirm successful navigation
- **Screenshot capture** at key steps — dashboard after login, final state after journal save, and on failure
- **Configurable timeouts**: implicit 10s, explicit 15s, page load 30s

```bash
cd selenium-tests
npm test
```

---

## API Testing — Postman / Newman

**Directory:** `postman-tests/`
**Collection:** `Mirror_API_Tests.postman_collection.json`
**Environment:** `Mirror_API_Testing_Environment.postman_environment.json`

### Coverage

- **Authentication** — Login (success path, assertions on status, message, token, user object), token extraction stored as collection variable for chained requests
- **Journal CRUD** — Create, list, get by ID, update, delete
- **Profile** — Get profile, update profile

### Test Assertions (per request)

- Status code validation
- Response body structure checks
- Token and data field presence
- Auto-extraction of `authToken` for use in protected endpoint requests

```bash
cd postman-tests
npm test          # runs via Newman in CI
```

---

## Load Testing — Apache JMeter

**Directory:** `jmeter-tests/`
**Script:** `scripts/login-api-load-test.jmx`
**Target endpoint:** `POST /api/auth/login`

### Test Configuration

| Parameter | Value |
|:---|:---:|
| Concurrent users (threads) | 25 |
| Iterations per user | 5 |
| Total requests | 125 |
| Ramp-up period | Gradual |

### Results (October 2025 run)

| Metric | Result |
|:---|:---:|
| Total requests | 125 |
| Success rate | **100%** |
| Average response time | ~200 ms |
| Min response time | 162 ms |
| Max response time | 342 ms |
| Error rate | **0%** |

All 125 requests returned `200 OK`. Response times remained stable under concurrent load, staying well within the target thresholds (avg < 500ms, 95th percentile < 1000ms).

Results are saved as CSV and a full HTML dashboard is generated automatically after each run.

```bash
cd jmeter-tests
.\run-load-test.bat       # Windows
```

---

## Security Testing — OWASP Top 10

**Directory:** `security-testing/`

A structured security review was conducted using the OWASP Top 10 (2021) as the reference framework. Two primary vulnerability categories were identified, documented with evidence, and fixed.

### Vulnerability 1 — A07: Identification and Authentication Failures

| Finding | Before | After |
|:---|:---|:---|
| Password policy | 6-char minimum, no complexity | 8-char min + uppercase + lowercase + number + special char |
| Password hashing | bcrypt cost factor default | Cost factor 12 |
| JWT expiry | No enforcement | 1-hour expiry |
| Brute force protection | None | Rate limiter: 10 attempts / 15 min on auth routes |
| Error messages | Different messages for "user not found" vs "wrong password" | Unified: "Invalid email or password" (prevents user enumeration) |

### Vulnerability 2 — A01: Broken Access Control

| Finding | Before | After |
|:---|:---|:---|
| CORS policy | `app.use(cors())` — allows all origins | Restricted to whitelisted origins only |
| API rate limiting | None | 100 requests / 15 min globally |
| HTTP security headers | None | Applied via `helmet` middleware |

**Documentation artifacts included:**
- Full security testing report
- Evidence files per vulnerability (before/after screenshots and code diffs)
- Fixed source files in `security-testing/fixes/`
- OWASP Top 10 reference guide

---

## CI/CD Pipeline — GitHub Actions

**Directory:** `.github/workflows/`

Three pipeline definitions handling different scenarios:

| Workflow | Trigger | Purpose |
|:---|:---:|:---|
| `main.yml` | Push / PR to `main` | Full pipeline: build → unit tests → Selenium tests |
| `basic.yml` | Push / PR to `main` | Environment sanity check (Node version, deps install) |
| `run-tests.yml` | Manual dispatch | Run unit, selenium, or all tests on demand |

### Pipeline Steps (`main.yml`)

```
1. Checkout code
2. Setup Node.js 20.x
3. Install root + backend + frontend dependencies
4. Check backend syntax (node --check)
5. Copy CI environment config (.env.ci → mirror-backend/.env)
6. Spin up MongoDB 4.4 service container
7. Start backend server (nohup, 10s warmup)
8. Install and run unit tests
9. Setup Chrome (browser-actions/setup-chrome)
10. Serve CI test page on port 5173
11. Run Selenium tests against CI test page
```

The MongoDB connection, JWT secret, and port are all injected via environment variables — no secrets are stored in code.

---

## Repository Structure

```
├── unit-tests/
│   ├── auth/
│   │   ├── registration.test.js    # 4 test cases
│   │   └── login.test.js           # 5 test cases
│   ├── config/
│   │   ├── testConfig.js           # test users + API base URL
│   │   └── urlHelper.js            # URL parser utility
│   └── run-tests.js                # sequential test runner
│
├── selenium-tests/
│   ├── login-test.js               # login flow test
│   ├── journal-creation-test.js    # journal creation test
│   ├── login-journal-test.js       # combined E2E flow
│   ├── helpers/test-utils.js       # shared driver, login, screenshot utils
│   └── config/testConfig.js        # URLs, timeouts, test credentials
│
├── postman-tests/
│   ├── Mirror_API_Tests.postman_collection.json
│   └── Mirror_API_Testing_Environment.postman_environment.json
│
├── jmeter-tests/
│   ├── scripts/login-api-load-test.jmx
│   ├── results/                    # CSV + HTML dashboard from last run
│   └── LOAD-TEST-INSTRUCTIONS.txt
│
├── security-testing/
│   ├── documentation/              # report + OWASP reference guide
│   ├── evidence/                   # per-vulnerability evidence files
│   └── fixes/                      # patched source files
│
└── .github/workflows/              # CI/CD pipeline definitions
``` 

---

## Tools & Versions

| Tool | Version | Purpose |
|:---|:---:|:---|
| Jest | 29.x | Unit test framework |
| Supertest | 6.x | HTTP API assertions |
| Selenium WebDriver | 4.x | Browser automation |
| Postman / Newman | — | API collection testing |
| Apache JMeter | 5.6.3+ | Load & performance testing |
| GitHub Actions | — | CI/CD automation |
| Node.js | 20.x | Runtime (CI) |
