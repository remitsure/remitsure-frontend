# Frontend architecture

## Reads and writes take different paths

- **Writes** go straight from the browser to the contract. `src/lib/contract.ts` builds the call, simulates it through Soroban RPC, asks Freighter to sign, submits it and waits for the result. The backend is never in the money path.
- **Reads** come from remitsure-backend (`src/lib/api.ts`), which indexes contract events into Postgres. That is what makes search, dashboards and receipts cheap.

After a write, the receipt page refreshes a few times while the indexer catches up.

Contract errors are mapped to plain sentences in `src/lib/contract.ts`. That table mirrors `contracts/remittance/src/errors.rs` and must change with it.

## Layout

| Path                  | What it is                            |
| --------------------- | ------------------------------------- |
| `src/app/page.tsx`    | Landing and stats                     |
| `src/app/send`        | Send form                             |
| `src/app/payees`      | Directory and payee registration      |
| `src/app/r/[id]`      | Receipt and every settle action       |
| `src/app/dashboard`   | Sent and received lists               |
| `src/components/`     | Shared UI and the wallet context      |
| `src/lib/config.ts`   | All `NEXT_PUBLIC_*` env in one place  |
| `src/lib/contract.ts` | Contract calls and error messages     |
| `src/lib/wallet.ts`   | Freighter wrapper                     |
| `src/lib/format.ts`   | Amount and date helpers (unit tested) |

## Which buttons show up on a receipt

| Status  | You are | Before deadline   | After deadline |
| ------- | ------- | ----------------- | -------------- |
| Pending | payee   | Claim, Reject     | Reject         |
| Pending | sender  | (waiting)         | Refund         |
| Settled | anyone  | Copy receipt link |                |
