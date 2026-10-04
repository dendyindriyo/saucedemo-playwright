# SauceDemo E2E Automation Test Suite

Automated E2E test suite for SauceDemo using Playwright and TypeScript with Page Object Model (POM).

## Prerequisites
- Node.js (v18+)
- VS Code

## Setup Instructions
1. Clone the repository and open the folder in VS Code.
2. Open the integrated terminal (Ctrl + ~).
3. Install dependencies:
   npm install
4. Install Playwright browsers:
   npx playwright install

## Running Tests
- Run all tests (headless):
  npm test
- Run tests in UI mode:
  npm run test:ui
- Run tests in headed browser mode:
  npm run test:headed
- Open execution report:
  npm run report