# Listing copy

Ready to paste. Character counts are noted where a store enforces a limit.

---

## App Builders PH — appbuildersph.com/submit

**App name**

```
Gabay
```

**Tagline / one-liner**

```
Check if your payslip is right, and know exactly what to bring to a government office.
```

**Category** — `Finance`

Productivity is the fallback if Finance is unavailable, but the core job is
money: contributions, withholding tax, net pay, separation and final pay.

**Website**

```
https://gabay-site.vercel.app
```

**Description**

```
Gabay means guide. It does three things.

It tells you whether your payslip is right. Enter what your payslip says beside
what the law gives, and get a line-by-line difference for SSS, PhilHealth,
Pag-IBIG, withholding tax and net pay — with the common innocent explanations
for each gap, so you can ask HR a precise question instead of a suspicious one.

It tells you exactly what to bring to a government office. Twelve transactions —
PSA, NBI, passport, PhilSys, driver's licence, TIN, business permit and more —
each with a checklist that saves as you gather documents over days, and a
section nobody else publishes: why people get turned away. The laminated birth
certificate. The missing parental advice. The barangay clearance for the wrong
address.

And it tells you what you are entitled to that nobody mentioned. Six statutory
leaves, the senior and PWD discount rules including the VAT treatment retail
gets wrong, contract red flags, PhilHealth benefits, and an OFW recruiter check.

What makes it different is not the calculator. Free calculators are everywhere.
Every result in Gabay renders as an itemised ledger with the rule cited beside
each line, so an HR officer can defend the number and an employee can challenge
a wrong deduction and point at the schedule it came from. No bare numbers
anywhere in the app.

Everything is compiled into the app, so it works with no connection — which is
usually exactly when you need it, standing in a queue with one bar of signal.
No account, no login, no analytics. It never asks for your name, your email,
your number or your salary.

Free, and open source.
```

**What to mention in a comment or launch note**

```
Built it because every payroll calculator gives you a number and no reasoning.
The whole app is designed around one rule: no figure appears without the rule
it came from, on screen, next to it. All four BIR withholding tables are
transcribed from the published schedule rather than derived, because the
published values carry rounding that division does not reproduce.
```

---

## Google Play

**App name** (≤30)

```
Gabay: Payslip & Papeles PH
```
26 characters.

**Short description** (≤80)

```
Check your payslip against the law. Know what to bring to any government office.
```
79 characters.

**Full description** (≤4000) — use the App Builders PH description above.

**Category** — Finance
**Tags** — payroll, payslip, government, benefits, Philippines
**Content rating** — Everyone
**Contains ads** — No · **In-app purchases** — No

**Data safety form.** Answer *no collection, no sharing* throughout. Gabay has
no backend, no analytics SDK and no network calls of any kind. Saved
computations, checklists and role preferences stay in on-device storage. Say so
plainly; this is the rare app where the honest answer is the simplest one.

---

## App Store

**Name** (≤30)

```
Gabay: Payslip & Papeles PH
```

**Subtitle** (≤30)

```
Sahod, benepisyo, papeles
```
25 characters.

**Promotional text** (≤170)

```
Every peso figure shows the rule behind it. Every government transaction tells
you why people get turned away. Works with no signal.
```

**Keywords** (≤100, comma separated, no spaces)

```
payslip,sahod,payroll,sss,philhealth,pagibig,bir,tax,dole,holiday,13thmonth,ofw,psa,nbi,passport
```

**Description** — use the App Builders PH description above.

**Privacy** — *Data Not Collected*. No tracking, no third-party SDKs.

**Age rating** — 4+

---

## Screenshots

`store/screenshots/play` — 1080×1920, eight images
`store/screenshots/ios67` — 1290×2796, eight images

Suggested order, strongest first:

1. `02-net-pay` — the ledger, which is the whole pitch
2. `03-payslip-match` — the payslip checker result
3. `04-checklist-ready` — the tickable checklist and the HANDA stamp
4. `05-papeles-turned-away` — why people get turned away
5. `01-home` — next holiday, payday countdown, Alam mo ba
6. `07-leave` — leave entitlements with their statutes
7. `08-rates` — every figure with its source
8. `06-karapatan` — the rights index

Both sets are captured from the web build. Visually identical to native since it
is the same React Native tree, but if a reviewer is strict, recapture from a
device or emulator once the APK installs.

---

## Two things to be accurate about

**Do not claim the app gives legal or tax advice.** It states rules and cites
sources. The in-app disclaimer says the controlling figures in a dispute are the
current DOLE, BIR, SSS, PhilHealth and Pag-IBIG issuances. Keep listing copy
consistent with that.

**Do not claim complete coverage.** Three datasets are deliberately not compiled
in — PhilHealth case rates, regional minimum wage floors, and any list of OFW
recruitment agencies — because a stale or invented number there does real harm.
Each links out to the source instead. If a reviewer asks why the minimum wage
checker shows no figure, that is the reason.
