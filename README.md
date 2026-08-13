# GEO Audit Studio

GEO Audit Studio is a static public tool that creates a consultant-grade generative engine optimization audit pack for a website owner. It does not require a backend, API keys, cookies, or a database.

The tool generates:

- A full browsing-AI audit brief.
- A weighted scorecard scaffold.
- A monthly user-referenced retrieval measurement plan.
- A P0-P3 action plan.
- A downloadable Markdown audit pack.

## Why this format

The best low-cost public version is a static prompt builder, not a fully automated crawler.

Most website owners can use it immediately by pasting the generated prompt into a browsing AI tool. You do not pay for their audits, they do not share API keys with you, and the quality stays high because the prompt forces cited evidence, live page checks, competitor testing, and a structured action plan.

An automated SaaS-style crawler would be more impressive at first glance, but it would introduce hosting cost, API key handling, anti-bot failures, CORS limits, crawler maintenance, and false confidence. GEO changes quickly, so the public tool should make the audit method transparent and portable.

## Source ideas incorporated

From the original Markdown template:

- Separate crawler access, search eligibility, and user-referenced retrieval.
- Treat misrepresentation risk as a first-class audit domain.
- End with specific owner actions, not just diagnosis.

From the SearchScore PDFs:

- Separate signal health from output performance.
- Track AI citation frequency, brand mention rate, AI referral traffic, and brand description accuracy.
- Use quarterly full audits and monthly prompt testing.
- Include category scoring and stakeholder reporting.

From the GEO audit framework PDFs:

- Treat prompts as the GEO equivalent of keyword sets.
- Benchmark competitors and cited source URLs.
- Measure share of voice, citation growth, prompt visibility, and conversions.
- Include off-site reputation and authority checks.

From the `g-shevchenko/geo-audit` repo:

- Use module-style scoring.
- Exclude unavailable modules from the composite score instead of scoring them zero.
- Prioritize deterministic zero-key checks.
- Add citability checks for direct answers, FAQs, numbered structure, source links, and definitions.
- Include llms.txt checks with a clear caveat that it is not a proven ranking factor.
- Use P0-P3 priorities.
- Degrade gracefully when private data or live model access is unavailable.

## Files

- `index.html`: static app shell.
- `styles.css`: visual system and responsive layout.
- `app.js`: prompt generator, tabs, copy, download, sample data, readiness self-check.
- `prompts/generative-engine-optimization-audit-pro-prompt.md`: standalone expert prompt.

## How to use

Open `index.html` in a browser or host the folder on any static host.

For best local behavior, serve the directory with a tiny local server so the app can load the Markdown prompt file:

```bash
python3 -m http.server 5174
```

Then open:

```text
http://localhost:5174
```

The app still has an embedded fallback prompt if the Markdown file cannot be fetched.

## Public positioning

Suggested description:

> GEO Audit Studio helps website owners generate a rigorous AI visibility audit prompt and measurement plan. It checks whether AI tools can access, understand, cite, and accurately describe a website, then produces a practical action plan.

Suggested caveat:

> This tool creates a rigorous audit workflow. It does not claim to measure private AI rankings or replace private Search Console, analytics, server log, or paid LLM tracking data.

## Deployment

This is a static site. It can be deployed to GitHub Pages, Netlify, Cloudflare Pages, Vercel static hosting, or any normal web server.

No build step is required.
