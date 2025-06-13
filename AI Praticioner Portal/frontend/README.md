# AI Practitioner Canvas Frontend

## Running the App

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the dev server:
   ```sh
   npm run dev
   ```
   By default, the app runs at http://localhost:5173

---

## End-to-End (E2E) Testing with Cypress

### Directory Structure

```
frontend/
  cypress.config.mjs
  cypress/
    e2e/
      dashboard.cy.js
      file_explorer.cy.js
      ...
    support/
    fixtures/
```

### How to Run E2E Tests

1. **Start the dev server** (in one terminal):
   ```sh
   npm run dev
   ```
2. **Run Cypress E2E tests** (in another terminal):
   ```sh
   npx cypress run --e2e --config-file cypress.config.mjs
   ```
   Or open the Cypress UI:
   ```sh
   npx cypress open --config-file cypress.config.mjs
   ```

### Troubleshooting

- **Config Not Found:**
  - Make sure you run Cypress from the `frontend` directory and use `cypress.config.mjs`.
  - Example: `npx cypress run --e2e --config-file cypress.config.mjs`
- **No Spec Files Found:**
  - Ensure your test files are in `frontend/cypress/e2e/` and named `*.cy.js`.
- **Port 5173 in Use:**
  - Only one process can use a port at a time. Stop any other process using that port, or run Vite on a different port and update `baseUrl` in `cypress.config.mjs`.
- **Base URL:**
  - If you change the dev server port, update `baseUrl` in `cypress.config.mjs` accordingly.

### Example Cypress Config (frontend/cypress.config.mjs)
```js
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false,
  },
});
```

---

## Additional Notes
- All E2E tests use mock data/services for frontend-only development.
- For backend integration, update the app and Cypress config as needed. 