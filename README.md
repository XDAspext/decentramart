# DecentraMart

DecentraMart is a university classroom sandbox for Foundations of Blockchain Technology. It demonstrates a functional product marketplace, independent demo identities and balances, SHA-256 transaction hashes, hash-linked educational blocks, and a Merkle root per block. **The in-browser ledger is simulated.** SHA-256 and Merkle calculations are real browser Web Crypto operations, but transactions are not broadcast, block production is not consensus, and demo ETH is not cryptocurrency.

## Learning objectives

Follow a purchase from product selection through confirmation, transaction hashing, block inclusion, and explorer verification. Compare that local educational model with the included Solidity contract and local Hardhat workflow. The About page covers transactions, hashing, Merkle trees, keys and signatures, EVM contracts, consensus, decentralization, and security limitations.

## Stack and prerequisites

Next.js App Router, React, TypeScript, Tailwind CSS, Lucide, Recharts, Prisma/SQLite schema, ethers.js, Solidity, Hardhat. Use Node.js 20 or newer and npm. No paid service or real cryptocurrency is required.

## Install and run (macOS/Linux)

```bash
npm install
npm run dev
```
Open http://localhost:3000. Browser local storage seeds deterministic marketplace products and demo wallets on first use. The main classroom demo does not require a database or `.env` file.

Optional SQLite schema setup:

```bash
cp .env.example .env
npx prisma generate
npx prisma db push
npm run db:seed
```

The Prisma schema and seed script are included as a persistence foundation. The current classroom UI stores its live demo ledger and listings in browser local storage; it does not read or write marketplace purchases through Prisma.

## Classroom workflow

1. Browse Marketplace and choose an available product.
2. Review buyer, seller, demo price, network, and payment mode in the confirmation dialog.
3. Confirm. The app computes a SHA-256 digest over the canonical transaction payload, updates the demo balance and availability, then appends a block with the previous hash and Merkle root.
4. Inspect the receipt in Transactions and open Blockchain Explorer to follow the block link.
5. Use **Demonstrate tampering** to show a visibly mismatched displayed digest; use reset to restore the demo.
6. Reset demo restores seeded products and all sample balances.

The Merkle root is displayed for each block in the explorer. Use **Verify Merkle inclusion** on a block to build and verify a proof from its transaction leaf to the displayed root. Current purchases form one-transaction blocks, so this classroom proof has a zero-sibling path; the shared ledger utility also supports multi-leaf proofs.

## Local smart contract

```bash
npm run chain
# in another terminal
npm run contract:deploy
npm run contract:test
```
Hardhat provides local test accounts and an ephemeral network. The contract has listing and purchase events, exact-price payment, listing availability checks, self-purchase prevention, and checks-effects-interactions ordering. No public deployment exists. The React purchase flow currently uses the educational ledger; connecting MetaMask only detects an available wallet and does not submit a marketplace contract transaction.

## Tests

- `npm test` runs the Vitest test suite (additions can cover browser ledger primitives).
- `npm run contract:test` runs the Hardhat contract tests.
- `npm run lint` runs the TypeScript type check.

## Architecture

```text
Next.js UI → marketplace flow → browser-persisted demo records
                         ↘ Web Crypto SHA-256 → educational hash-linked blocks + Merkle roots
Prisma schema → SQLite (ready for server persistence)
ethers.js → local Hardhat JSON-RPC → DecentraMart.sol
```

## Security and limitations

Never enter a seed phrase or private key. Demo identities have no signing keys, and simulated balances are isolated from real ETH. Browser storage is user-editable and is not authoritative or tamper resistant. SHA-256 provides integrity fingerprints, not encryption or consensus. A production marketplace needs server-side validation, authenticated users, atomic persistence, contract audits, privacy review, and a robust deployment strategy. The included Prisma data model is a foundation; purchase operations are not currently implemented as a Prisma-backed API.

## Repository validation

GitHub Actions runs dependency installation, TypeScript validation, educational ledger tests, Solidity contract tests, and the production build on pushes and pull requests targeting `main`.
