This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Pilot Brief

See the pilot brief and checklist for the current pilot scope: `PILOT_BRIEF_FINAL.md` and `PILOT_CHECKLIST.md`.

## Running tests (dev)

For local deterministic E2E runs the repo provides a helper that:

- starts the Next dev server on `PORT` (default `3001`),
- waits for the app to be ready,
- hits the dev-only seed endpoint `/api/test/seed` to populate demo users and students,
- runs Playwright against the running app, and
- tears down the dev server.

Usage:

```bash
# make the script executable once
chmod +x ./scripts/dev-test.sh

# run tests (passes extra args to Playwright)
./scripts/dev-test.sh --reporter=list tests/ehs-flow.spec.ts

# or via npm
npm run dev:test -- --reporter=list tests/ehs-flow.spec.ts
```

## Testing (E2E)

The repository includes a helper that starts the Next.js dev server, waits for it to be responsive, seeds demo data (dev-only), runs Playwright E2E tests, and then shuts down the server.

Run the full E2E flow locally with:

```bash
# ensure Playwright browsers are installed first
npx playwright install

# runs the helper which starts dev server, seeds, runs tests, then tears down
npm run dev:test -- --reporter=list tests/ehs-flow.spec.ts
```

You can set `PORT` env var to change the dev port (default `3001`):

```bash
PORT=3002 npm run dev:test -- --reporter=list tests/ehs-flow.spec.ts
```

Note: The seeding endpoint `/api/test/seed` is only enabled in non-production environments.

Notes:

- The script is a best-effort helper for local/CI runs and will attempt to clean up the dev server using multiple fallbacks. If ports remain in use, `npx kill-port 3001` is a useful manual fallback.
- CI is wired to run `npm run dev:test` in `.github/workflows/ci.yml`.

If you'd like me to add a GitHub Actions badge or adjust the CI job to run only specific suites, tell me which branch or suite to target.
