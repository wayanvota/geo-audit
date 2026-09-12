# End-to-end test report

## Scope

The harness exercises the static site through Chromium and a local HTTP server.
It covers prompt loading and fallback behavior, form state, audit settings,
generated modules, readiness scoring, clipboard operations, downloads, hostile
input, public-file parity, and secret scanning. Fixtures use only reserved
`example.invalid` data and do not contact a target website or AI provider.

The OpenAI key named `github` is not applicable to this repository. Geo Audit
Studio generates prompts locally and has no provider integration, so the key
was not loaded.

## Results

| ID | Category | Expected behavior | Result |
|---|---|---|---|
| U01 | Application load | The builder and complete prompt render | Pass |
| U02 | Sample workflow | Sample data produces a full audit | Pass |
| U03 | Owner inputs | URL and brand interpolate into the prompt | Pass |
| U04 | Audit depth | Quick and full settings update the prompt | Pass |
| U05 | Module scope | Selected modules control the scope preface | Pass |
| U06 | Readiness | Partial and complete self-checks report 50% and 100% | Pass |
| U07 | Output tabs | Scorecard, measurement, and action modules render | Pass |
| U08 | Clipboard | The active module copies to the clipboard | Pass |
| U09 | Prompt download | The full brief downloads with a safe filename | Pass |
| U10 | Pack download | The pack contains all four output sections | Pass |
| A01 | Missing template | The embedded prompt provides a usable fallback | Pass |
| A02 | Corrupt state | Malformed local storage is removed safely | Pass |
| A03 | Markup input | Script-shaped input remains inert textarea text | Pass |
| A04 | Token collision | User text resembling a token is not expanded again | Pass |
| A05 | Empty inputs | Explicit evidence placeholders remain visible | Pass |
| A06 | Empty scope | No selected modules produces a clear warning | Pass |
| A07 | Filename safety | Hostile brand punctuation cannot escape the filename | Pass |
| A08 | Missing reference | The reference page reports a missing Markdown file | Pass |
| A09 | Reference copy | Copy uses loaded prompt text, not loading text | Pass |
| A10 | Public artifact | Source and `dist` match and contain no provider secrets | Pass |

Local result: 20 of 20 categories passed in Chromium. JavaScript syntax,
source-to-`dist` parity, and the dependency audit also passed with zero known
vulnerabilities.

[GitHub Actions run 34668416379](https://github.com/wayanvota/geo-audit/actions/runs/34668416379)
passed all 20 categories in Chromium, source-to-`dist` parity, and the dependency
audit on Node 22.16.0.

## Defect fixed

The previous sequential token replacement could interpret a token-shaped value
entered by a user as another template instruction. Replacement is now a single
pass, so user-supplied `{{TOKEN}}` text remains literal. The same fix is present
in the source and deployable `dist` copy.

## Run locally

```bash
npm ci
npx playwright install chromium
npm run test:ci
npm audit --audit-level=high
```

## Debug and extend

- The local test server listens only on `127.0.0.1:5174`.
- Keep exactly 10 `U` and 10 `A` categories. Replace a weaker scenario when a
  more consequential behavior is added.
- Keep source files and `dist` byte-for-byte identical.
- Do not add provider keys, target-site credentials, private analytics, or real
  audit inputs to fixtures or GitHub Actions.
