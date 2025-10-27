# OrangeHRM with Playwright + Cucumber 🧪🎭

End-to-end and API testing framework for the OrangeHRM demo site using Playwright (browser automation) and Cucumber (BDD). It implements a clean Page Object Model (POM), tagged scenarios for UI and API, HTML/JSON reporting, and helpful utilities for reliability.

## Highlights ✨

- 🧩 BDD with Cucumber: readable, maintainable scenarios
- 🎭 Playwright-powered UI automation (Chromium)
- 📦 Page Object Model (Login, Home, Admin, Add User, Base)
- 🔗 API testing via Playwright's request context (cookie/session-based auth)

## Windows notes 💡

- If PowerShell blocks `npm`/`npx` with execution policy errors, use Command Prompt (cmd) to run the commands, or temporarily allow scripts:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

- Screenshots for failed steps are saved under `cucumber/report/screenshots/`.

## Key modules and responsibilities 🧱

- `BasePage.ts`
	- Provides `navigateTo`, `waitForNetworkIdle`, `waitForSelector`, `clearAndFill`, `clickAndWaitForNavigation`, and exposes `request` via `page.context().request` to enable API calls that share browser cookies.
	- Maintains `BasePage.recordsCount` for grid count assertions across steps.

- `LoginPage.ts`
	- `enterCredentials`, `clickLoginButton`, plus `authenticateViaUI` helper to do a full login and wait for network idle.

- `HomePage.ts`
	- Toggles side menu (only if visible) and navigates to the Admin module.

- `AdminPage.ts`
	- Gets total rows via `[role=row]`.
	- Searches by username and resets filters.
	- Deletes a row using the first action button, handles confirmation dialog, and waits for the success message.

- `AddEmployeePage.ts`
	- Selects User Role and Status via dropdowns with fast existence checks.
	- Handles employee name autocomplete robustly (listbox wait + option load then ArrowDown/Enter).
	- Fills Username, Password, Confirm Password, then saves and waits for navigation.

- `ApiPage.ts`
	- `authenticateViaUI` to establish a session cookie via real login.
	- Candidate operations via OrangeHRM v2 API:
		- `addCandidate(data)` → POST `/api/v2/recruitment/candidates`
		- `getCandidates()` → GET `/api/v2/recruitment/candidates?limit=50&offset=0`
		- `deleteCandidate(id)` and `deleteCandidates(ids)` → DELETE `/api/v2/recruitment/candidates`
		- `findCandidateByName(first,last)` → in-memory filter over fetched list

## Cucumber configuration ⚙️

`cucumber.json`:

- Loads step definitions and hooks via ts-node
- Parallel: 1 (safe for shared demo site)
- Reports: HTML + JSON under `cucumber/report/`
- Paths: `cucumber/features`
- Snippet interface: async/await

## Playwright configuration 🧩

`playwright.config.ts` exists for convenience if you add Playwright Test specs, but Cucumber runs do not use it. You can still leverage it for Playwright Test-only suites later (reporter, devices, retries, traces, etc.).

## Test data and environment 🌍

- Target site: `https://opensource-demo.orangehrmlive.com/` (shared public demo)
- Credentials (demo): `Admin` / `admin123`
- Data collisions can happen due to other users; UI assertions use greater-than checks for counts, not strict equality.

## Troubleshooting 🧯

- PowerShell execution policy blocks npm/npx
	- Use Command Prompt or run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in PowerShell.

- API scenario fails with 401 / Session expired
	- Ensure `When user logins via API ...` step is present and succeeds. It performs UI login to seed cookies used by subsequent API calls via the same context.

- Autocomplete (Employee Name) stuck at "Searching..."
	- The page object waits for a non-"Searching" option before selecting. If it still fails, network slowness may be the cause—rerun.

- Element not found or flaky selectors
	- The POM uses robust CSS and role-based selectors. If the OrangeHRM DOM changes, update the selectors in `pages/*Page.ts`.

- Headless CI runs
	- In `cucumber/hooks/hooks.ts`, change `chromium.launch({ headless: false })` to `headless: true`.

## Extending the framework 🚀

- Add more features under `cucumber/features/` with tags for selective runs.
- Create new Page Objects under `cucumber/pages/` and keep locators + actions encapsulated.
- Add new API endpoints into `ApiPage.ts` and reuse the same authenticated context.
- Scale concurrency by increasing `parallel` in `cucumber.json` once stability is proven.

## Quick start 🏁

1) Clone the repo and open in VS Code
2) Install deps and browsers

```sh
npm install
npx playwright install
```

3) Run all tests or pick tags

```sh
npm test
npm test -- --tags "@E2E"
npm test -- --tags "@api"
```

4) View the HTML report

```
cucumber/report/cucumber-report.html
```

Happy testing! 🧡
- 🧾 Cucumber HTML + JSON reports
- 🧰 TypeScript + ts-node for type safety
- 🪵 Helpful logs, waits, and robust locators

## Project Structure 🗂️

```
.
├─ cucumber.json                         # Cucumber runner config
├─ package.json                          # Scripts & dev dependencies
├─ playwright.config.ts                  # Playwright test config (not used by Cucumber runner)
├─ tsconfig.json                         # TypeScript compiler config
├─ Readme.md                             # This documentation
├─ cucumber/
│  ├─ features/
│  │  └─ E2E.feature                    # UI + API scenarios with tags (@E2E, @api)
│  ├─ hooks/
│  │  └─ hooks.ts                       # Global setup/teardown, browser & context lifecycle
│  ├─ pages/
│  │  ├─ BasePage.ts                    # Shared utilities (navigate, waits, request context)
│  │  ├─ LoginPage.ts                   # Login actions
│  │  ├─ HomePage.ts                    # Sidebar/admin nav
│  │  ├─ AdminPage.ts                   # System Users grid (counts, search, delete)
│  │  ├─ AddEmployeePage.ts             # Add User form (role, status, autocomplete, passwords)
│  │  └─ Api/
│  │     └─ ApiPage.ts                  # Candidate API (create, list, find, delete)
│  ├─ report/
│  │  ├─ cucumber-report.html           # Generated HTML report
│  │  ├─ cucumber-report.json           # Generated JSON report
│  │  └─ screenshots/                   # Failure screenshots per step
│  └─ steps/
│     ├─ baseSteps.ts                   # Navigate to URL
│     ├─ loginPageSteps.ts              # UI login steps
│     ├─ homePageSteps.ts               # Sidebar & admin nav steps
│     ├─ adminPageSteps.ts              # Grid counts, search, delete
│     ├─ addEmployeeSteps.ts            # Fill + save Add User
│     └─ apiSteps.ts                    # API: authenticate via UI, CRUD candidate
└─ node_modules/                         # Installed deps
```

## How it works 🧠

- POM: All UI interactions live in `cucumber/pages/*Page.ts` and inherit from `BasePage` for shared utilities (navigation, waits, locator helpers, and access to `request` for API calls via `page.context().request`).
- Hooks: `hooks.ts` launches Chromium before tests, creates a new context and page per scenario, and captures screenshots on step failure. Headless is off by default to make flows visible.
- Tags: Two scenarios live in `E2E.feature`:
	- `@E2E` UI flow: login → navigate to Admin → get record count → add user → verify increased → search → delete → verify decreased.
	- `@api` API flow: authenticate via UI (to obtain session cookies) → add candidate → list → find → delete → verify deletion.
- Auth for API: The `ApiPage` uses the Playwright request fixture associated with the same browser context. `authenticateViaUI` performs a real UI login once, so subsequent API calls share the session via cookies.

## Dependencies 📦

- Node.js (LTS recommended, 18+)
- TypeScript + ts-node
- @cucumber/cucumber
- @playwright/test (browser engine + request context)
- rimraf, mkdirp (scripts/utilities)

See `package.json` for exact versions.

## Installation 🛠️

1) Install Node.js (18+ LTS recommended)

2) Install dependencies

```sh
npm install
```

3) Install Playwright browsers (Chromium is required for UI tests)

```sh
npx playwright install
```

Tip: On CI or for Chromium only, you can run `npx playwright install chromium`.

## Running tests ▶️

- Run all scenarios (UI + API):

```sh
npm test
```

- Run only UI scenario(s):

```sh
npm test -- --tags "@E2E"
```

- Run only API scenario(s):

```sh
npm test -- --tags "@api"
```

- Open the Cucumber HTML report after a run:

```
./cucumber/report/cucumber-report.html
```

If you prefer to add dedicated scripts, you can extend `package.json` like:

```json
{
	"scripts": {
		"test": "npx cucumber-js",
		"test:ui": "npx cucumber-js --tags @E2E",
		"test:api": "npx cucumber-js --tags @api"
	}
}
```
