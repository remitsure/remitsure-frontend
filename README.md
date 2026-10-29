<p align="center"><img src="public/logo.svg" width="96" alt="RemitSure logo"></p>

# remitsure-frontend

Frontend for **RemitSure**: send money home for a purpose, and be sure it is used for it.

Pick a school, landlord or hospital from the payee directory, lock the payment with a reference like "Term 1 fees, Ada Obi, JSS2", and share the receipt link. Only that payee can claim it. If they do not claim it by the deadline, you take it back. Every step links to its transaction on Stellar Expert.

## Repos

| Repo                                          | What it is                                        |
| --------------------------------------------- | ------------------------------------------------- |
| [remitsure-contracts](../remitsure-contracts) | Soroban contract that locks, releases and refunds |
| [remitsure-backend](../remitsure-backend)     | API, event indexer, payee directory               |
| **remitsure-frontend** (this repo)            | Next.js app with Stellar wallet                   |

## Pages

| Route              | What it does                                         |
| ------------------ | ---------------------------------------------------- |
| `/`                | What RemitSure is, live stats                        |
| `/send`            | Lock a payment for a payee                           |
| `/payees`          | Search the payee directory                           |
| `/payees/register` | Register your wallet as a payee                      |
| `/r/[id]`          | Public receipt, plus claim, reject or refund buttons |
| `/dashboard`       | What you sent, and what is waiting for you to claim  |

## Stack

Next.js 16 (App Router), React 19, Tailwind CSS 4, `@stellar/stellar-sdk`, `@stellar/freighter-api`, Vitest.

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

| Command         | What it does                         |
| --------------- | ------------------------------------ |
| `npm run dev`   | Dev server on http://localhost:3000  |
| `npm run build` | Production build                     |
| `npm test`      | Unit tests                           |
| `npm run check` | Typecheck, lint, format check, tests |

## Try the full flow on testnet

You need two Freighter accounts on Testnet, both funded with friendbot.

1. **Account A** opens `/payees/register` and registers as a school.
2. **Account B** opens `/send`, picks that school, and sends with the "10 minutes (demo)" deadline.
3. **Account A** opens the receipt and claims it. Or wait 10 minutes and let Account B take a refund.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how reads and writes flow.

## License

MIT
