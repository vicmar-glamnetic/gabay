# Gabay

**Sahod, benepisyo, at papeles sa isang lugar.**

A Philippine payroll, benefits, rights and government transactions reference tool.
Expo + React Native + `react-native-web`. No backend, no database, no accounts.
The entire dataset compiles into the bundle, so everything works offline.

```bash
npm test          # the pure calc layer — run this first, it gates everything
npm run typecheck
npm start         # Expo dev server
npm run web
npm run build:web # static export to dist/
```

## Architecture

**One rates file.** Every statutory figure lives in [`lib/rates.ts`](lib/rates.ts) with a
`lastVerified` date and a source string per schedule. No rate, threshold, multiplier or
bracket appears anywhere else. When a circular changes a number, that is the only file
that gets edited.

**Pure calc layer.** [`lib/calc/*`](lib/calc/) has no React, React Native or platform
imports. Every function takes a plain input object and returns `CalcResult<T>` — the
figures plus the ledger lines that explain them. Screens render; screens never compute.
This is what lets the same functions run in the app, the web build, the tests, and the
batch payroll feature on the roadmap without a rewrite.

**Screens.** `app/` is Expo Router, five bottom tabs. Every pushed screen lives *inside*
its tab's own stack — `app/(tabs)/kalkula/net-pay.tsx`, not `app/calc/net-pay.tsx` — so the
bottom bar stays visible everywhere. A screen pushed from the root stack would cover it.
The three primitives every screen is built on are
[`components/Ledger.tsx`](components/Ledger.tsx),
[`components/StickyResultBar.tsx`](components/StickyResultBar.tsx) and
[`components/Sheet.tsx`](components/Sheet.tsx).

## Where the numbers come from

| Schedule | Source |
|---|---|
| SSS | Schedule of Contributions under RA 11199 |
| PhilHealth | RA 11223, final scheduled rate |
| Pag-IBIG | HDMF Circular 460 |
| Withholding tax | [BIR RR 11-2018 Annex "E"](https://bir-cdn.bir.gov.ph/local/pdf/Annex%20E%20RR%2011-2018.pdf), effective 1 Jan 2023 |
| Premium pay | Labor Code Book III; DOLE Handbook on Workers' Statutory Monetary Benefits |
| Separation / retirement / final pay | Labor Code Arts. 298–299, RA 7641, DOLE LA 06-20 |
| 2026 holidays | Proclamation 1006 s.2025, plus the two Eid proclamations |

All four withholding tables — daily, weekly, semi-monthly, monthly — are **transcribed
from the published BIR table for that frequency**, never derived by dividing the monthly
figures. The published values carry rounding that division does not reproduce. A test
asserts each bracket's base equals the tax computed at its own lower bound, which catches
a mistyped figure.

## Deliberately not in the bundle

Three datasets are typed but empty, with a clearly marked slot to populate. Each is a
case where a stale or invented number does real harm:

- **PhilHealth case rates** — `CASE_RATES` in `lib/data/karapatan.ts`. Thousands of them,
  changed by circular.
- **Regional minimum wage floors** — `WAGE_REGIONS` in `lib/calc/minimumWage.ts`. All 17
  regions are listed with `dailyFloor: null`; the comparison logic works the moment a
  verified figure lands.
- **OFW recruitment agencies** — never. Verification links out to the official DMW check.
  The app contributes the red-flag scoring and the process walkthrough only.
