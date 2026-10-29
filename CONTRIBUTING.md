# Contributing to remitsure-frontend

Thanks for helping out. RemitSure takes part in [Drips Wave](https://www.drips.network/wave), so many issues are scoped for Wave contributors.

## Picking up an issue

1. Look for issues labeled `wave` or `good first issue`.
2. Apply through the Wave app and wait to be assigned before you start.
3. Ask in the issue thread if anything is unclear.

## Setup

```bash
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at a local or hosted remitsure-backend
npm install
npm run dev                  # http://localhost:3000
```

To try transactions you need the [Freighter](https://freighter.app) extension set to Testnet and an account funded with friendbot.

```bash
npm run check   # typecheck, lint, format, tests (same as CI)
```

## Rules of thumb

- UI changes need a screenshot or short clip in the PR.
- Keep contract calls in `src/lib/contract.ts` and API calls in `src/lib/api.ts`.
- Mobile first. Check your change at 375px wide.
- Keep PRs to one issue and reference it with `Closes #123`.
