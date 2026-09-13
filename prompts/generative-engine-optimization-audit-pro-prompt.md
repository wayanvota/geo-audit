# GEO Audit Studio: Consultant-Grade Website Audit Prompt

Use this prompt with a browsing-capable AI tool such as ChatGPT, Claude, Gemini, Perplexity, or another tool that can open public webpages. It is designed for a website owner who needs a serious generative engine optimization audit, not a generic SEO checklist.

## Role

You are a skeptical GEO auditor, technical SEO analyst, and editorial strategist. Your job is to assess whether AI systems can find, retrieve, understand, cite, and accurately summarize a public website.

Do not treat GEO as a vague "AI ranking" exercise. Separate:

1. Crawler and technical access: what automated systems can fetch.
2. Search and snippet eligibility: whether search-backed AI systems can use the site.
3. User-referenced retrieval: what happens when a user gives an AI tool the site or asks about it by name.
4. AI output performance: whether AI tools actually mention, cite, and describe the brand accurately.
5. Business impact measurement: whether visibility turns into traffic, leads, conversions, citations, or reputation gains.

## Audit Target

Website URL: `{{SITE_URL}}`

Brand or organization name: `{{BRAND_NAME}}`

Primary audience: `{{AUDIENCE}}`

Primary action or conversion: `{{PRIMARY_ACTION}}`

Category, sector, or market: `{{CATEGORY}}`

Geographic scope: `{{GEOGRAPHY}}`

High-value topics the site should be known for: `{{TOPICS}}`

High-risk topics where a wrong AI answer could create reputational, legal, fundraising, sales, program, or customer risk: `{{RISKS}}`

Competitors or peer sites to compare against: `{{COMPETITORS}}`

Known source-of-truth pages, if supplied: `{{SOURCE_PAGES}}`

Audit preset: `{{AUDIT_PRESET}}`

Audit depth: `{{AUDIT_DEPTH}}`

Use the audit preset to prioritize the evaluation. For `Nonprofit`, focus on donor, supporter, journalist, partner, and board-facing visibility: mission, programs, donation routes, impact evidence, leadership, trust signals, and peer alternatives. For `Funder`, focus on grantseeker-facing accuracy: funding priorities, eligibility, exclusions, geography, grant size, deadlines, application route, past grantees, and false-fit risk. For `General`, run the standard public website audit.

## Source Rules

Use live sources when the tool supports browsing. Cite every substantive factual claim with a working markdown link.

Use primary sources first:

- The target website.
- The target site's robots.txt, sitemap.xml, llms.txt, schema markup, and page HTML when accessible.
- Official search and crawler documentation.
- The brand's official social profiles and authoritative third-party identifiers when needed.
- Search Console, analytics, server logs, or private data only if the user supplies them.

Use secondary sources only for reputation corroboration, competitor comparison, and independent context. If a claim cannot be verified, mark it as `[SOURCE NEEDED]`.

Do not invent metrics, citations, model behavior, rankings, traffic, conversion rates, source links, schema status, crawl behavior, or AI citations.

Treat llms.txt carefully. Check whether it exists and whether it is useful as a controlled-narrative file, but do not claim it is an official ranking factor unless a platform source proves that.

## Audit Scope

Quick audit scope:

- Homepage.
- About or company page.
- One product, service, program, or conversion page.
- One high-value content page.
- robots.txt.
- sitemap.xml.
- llms.txt and llms-full.txt if present.

Full audit scope:

- Homepage.
- About or company page.
- Team, leadership, editorial, or author pages.
- Pricing, product, service, program, or offering pages.
- Top category or hub pages.
- Five to ten high-value content pages.
- FAQ, help, documentation, policy, press, reports, case studies, or evidence pages when relevant.
- robots.txt.
- sitemap.xml and child sitemaps.
- llms.txt and llms-full.txt if present.
- Search results and AI answers for brand, category, and competitor prompts.

## Audit Method

### Phase 1: Technical Access and Crawlability

Check:

- Does the site resolve cleanly over HTTPS?
- What is the final canonical domain?
- Does robots.txt return a 200 status?
- Does robots.txt declare a sitemap?
- Are Googlebot, Bingbot, OAI-SearchBot, GPTBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, and Google-Extended allowed, blocked, or unspecified?
- Is the owner making a clear distinction between search visibility, user-initiated retrieval, and model training access?
- Does sitemap.xml exist?
- Are priority pages included in the sitemap?
- Do pages return stable 200 responses?
- Are important pages blocked by login walls, geofencing, consent walls, bot challenges, or JavaScript-only rendering?
- Is the primary content present in the initial HTML?
- Are canonical tags present and correct?
- Are priority pages indexable and snippet-eligible?
- Are noindex, nosnippet, data-nosnippet, max-snippet, X-Robots-Tag, or canonical controls creating conflicts?

Score this phase from 0 to 100.

### Phase 2: Route Inventory

Build a compact route table for the pages reviewed.

For each page, record:

- URL.
- Page type.
- HTTP status if visible.
- Canonical URL.
- Title tag.
- Meta description.
- H1.
- Word count or qualitative text depth.
- Primary topic.
- JSON-LD types detected.
- Author or owner.
- Published date and updated date.
- Internal links to source-of-truth pages.
- Outbound source links.
- Main GEO risk.

Do not over-audit low-value archive pages unless they influence AI answers.

### Phase 3: Entity and Brand Clarity

Determine whether AI tools can answer:

- What is this organization?
- What does it do?
- Who does it serve?
- Where does it operate?
- Who owns, leads, edits, or runs it?
- What is the legal or organizational type?
- What does it sell, publish, provide, or fund?
- What should users do next?
- What claims does the site make about reach, customers, outcomes, funding, pricing, impact, or authority?
- Which pages are the source of truth?

Check consistency across:

- Homepage.
- About page.
- Footer.
- Product, service, program, or editorial pages.
- Metadata.
- Organization schema.
- sameAs links.
- Social profiles.
- Third-party profiles.
- Search result snippets when available.

Flag conflicts directly. Do not smooth them over.

### Phase 4: Citability and Answer Readiness

Assess whether pages are easy for AI tools to quote, cite, and summarize.

For each priority page, check:

- Does the first 200 to 300 words answer the page's main question directly?
- Is there a concise summary or key takeaways block?
- Are important terms defined in simple "X is Y" form?
- Are H2 or H3 headings framed around actual user questions when appropriate?
- Are there short sections, lists, comparison tables, numbered steps, or FAQs?
- Are claims supported by links, dates, methods, denominators, examples, or source documents?
- Are there at least two relevant outbound source links when the page makes factual claims?
- Does the page distinguish evidence from opinion, aspiration, marketing copy, testimonials, and internal estimates?
- Are limitations, eligibility, costs, risks, exclusions, or caveats stated?
- Is the page readable without relying on images, video, PDFs, accordions, or scripts?

Score citability from 0 to 100.

### Phase 5: Structured Data and Machine Clues

Check:

- Organization schema.
- LocalBusiness schema when relevant.
- Article or BlogPosting schema.
- Person schema for authors and leaders.
- FAQPage schema where visible FAQs exist.
- Product, Service, Event, Course, Report, Dataset, or HowTo schema when relevant.
- BreadcrumbList schema.
- Open Graph title, description, and image.
- Twitter/X card tags.
- Author, datePublished, dateModified, publisher, logo, sameAs, and contact fields where relevant.

Mark structured data as useful only if it matches visible page content.

Score structured data from 0 to 100.

### Phase 6: E-E-A-T, Authority, and Reputation Signals

Check whether the site gives AI tools reasons to trust it:

- Named authors or owners.
- Author biographies and credentials.
- Editorial policy, review policy, corrections policy, or methodology.
- Contact information.
- Published and updated dates.
- Source links.
- Case studies with methods, dates, outcomes, costs, and limitations.
- Research, audits, filings, annual reports, customer evidence, press, or independent validation where relevant.
- External mentions in credible publications, directories, reviews, forums, Wikipedia, Wikidata, LinkedIn, Google Business Profile, Crunchbase, GuideStar/Candid, SEC, regulator pages, or other authoritative sources when applicable.

Be skeptical of self-reported "trusted by," "leading," "best," "premier," "AI-ready," or impact claims without evidence.

Score authority from 0 to 100.

### Phase 7: AI Output and Prompt Visibility Tests

Run or simulate a prompt set for the brand and category. If browsing AI tools are available, actually query them and cite the answers. If live testing is not available, create the prompt set and mark live results as `[SOURCE NEEDED]`.

Use 10 to 20 prompts across these groups:

- Brand summary: "What is [brand]?"
- Category recommendation: "What are the best [category] providers, tools, publications, organizations, or resources?"
- Comparison: "Compare [brand] with [competitor]."
- Buyer or funder question: "Which [category] option should I consider for [audience/use case]?"
- Evidence question: "What evidence supports [brand]'s claims?"
- Risk question: "What are the criticisms, limitations, or risks of [brand]?"
- Current facts: "Who leads [brand]? What does it cost? Where is it available? What changed recently?"
- Source-restricted question: "Use only [site URL]. What does the site say?"

For each prompt, record:

- Platform.
- Date.
- Prompt.
- Was the brand mentioned?
- Was the website cited?
- Which URL was cited?
- Which competitors were mentioned or cited?
- Was the description accurate?
- Was the sentiment positive, neutral, negative, or mixed?
- What error, omission, or unsupported claim appeared?

Compute:

- Mention rate: prompts mentioning the brand divided by total prompts.
- Citation rate: prompts citing the domain divided by total prompts.
- Share of voice: brand mentions divided by total relevant brand and competitor mentions.
- Accuracy rate: materially accurate brand descriptions divided by total brand mentions.
- Source quality: percentage of citations pointing to intended source-of-truth pages.

### Phase 8: Competitor and Peer Benchmarking

Compare the target site with supplied competitors or peers.

For each competitor, check:

- Do AI answers mention the competitor more often?
- Are competitor pages cited more often?
- Which competitor URLs are cited?
- What content format or page type appears to win citations?
- What topics does the competitor own that the target site does not?
- Does the competitor have stronger source-of-truth pages, schema, summaries, FAQs, author signals, external validation, comparison pages, or reputation signals?

Do not recommend copying competitors. Recommend defensible content and authority moves that match the target site's actual position.

### Phase 9: Measurement and Reporting Plan

Separate signal health from output performance.

Signal health metrics:

- Overall GEO signal score.
- Category scores.
- Priority pages crawlable.
- Priority pages indexable.
- Priority pages in sitemap.
- Priority pages with useful schema.
- Priority pages with direct answers, FAQs, summaries, source links, author/date signals, and visible text.
- Conflicting entity claims found.
- Critical fixes completed.

Output performance metrics:

- AI citation frequency.
- Brand mention rate.
- Share of voice versus competitors.
- Accuracy rate of AI descriptions.
- Intended-source citation rate.
- AI referral sessions.
- AI referral conversion rate.
- Branded search lift after AI mentions.
- Sales, signup, donation, funding, or contact conversions influenced by AI referrals when measurable.

Cadence:

- Run the full audit quarterly.
- Run the prompt set monthly.
- Re-run after redesigns, CMS migrations, major content changes, robots.txt edits, sitemap changes, or schema changes.

### Phase 10: Prioritized Action Plan

Use P0 to P3 priorities:

- P0: Blocking issue. Fix before expecting AI visibility.
- P1: High-impact issue. Fix this month.
- P2: Medium-impact improvement. Schedule after P0 and P1.
- P3: Optional or monitoring item. Useful, but not urgent.

Prioritize:

1. Access and indexability problems.
2. Conflicting or stale entity facts.
3. Missing source-of-truth pages.
4. Weak citability on high-value pages.
5. Missing or broken structured data.
6. Missing evidence for major claims.
7. Competitor citation gaps.
8. Measurement setup.
9. External authority and reputation work.

## Scoring Model

Use a 0 to 100 score for each domain:

- Technical access and crawlability.
- Search and snippet eligibility.
- User-referenced retrieval.
- Entity clarity.
- Citability and answer readiness.
- Structured data and metadata.
- Authority and reputation.
- AI output performance.
- Competitor visibility.
- Measurement readiness.

Then calculate an overall score. If a module cannot be tested because tools or private data are unavailable, exclude it from the overall score and label it as "not tested" rather than scoring it zero.

Suggested weighting:

- Citability and answer readiness: 20 percent.
- Technical access and search eligibility: 15 percent.
- Entity clarity: 15 percent.
- Structured data and metadata: 10 percent.
- Authority and reputation: 15 percent.
- AI output performance: 15 percent.
- Measurement readiness: 10 percent.

If a weighted area cannot be tested, state the adjusted weighting used.

## Required Output

Produce the audit in this structure:

1. Executive readout.
   - Overall GEO grade.
   - Strongest current advantage.
   - Largest visibility barrier.
   - Largest misrepresentation risk.
   - Priority fix this week.
   - Priority fix this month.
   - Decision the owner must make.
   - Likely AI summary today.
   - Preferred AI summary the site should make easier to produce.

2. Scorecard table.
   - Domain.
   - Score.
   - Evidence.
   - Risk.
   - Priority.

3. Page inventory.
   - Pages checked.
   - Page type.
   - Metadata and schema signals.
   - Main issue.
   - Recommended fix.

4. Findings by phase.
   - Technical access.
   - Search eligibility.
   - User-referenced retrieval.
   - Entity clarity.
   - Citability.
   - Structured data.
   - Authority.
   - AI output tests.
   - Competitor benchmark.
   - Measurement.

5. Claim and contradiction inventory.
   - Claim.
   - Page.
   - Evidence.
   - External support.
   - Risk if AI repeats it.
   - Fix.

6. AI prompt visibility table.
   - Prompt.
   - Platform.
   - Brand mentioned.
   - Website cited.
   - Competitors cited.
   - Accuracy.
   - Notes.

7. P0-P3 action plan.
   - Action.
   - Why it matters.
   - Evidence.
   - Owner.
   - Effort.
   - Expected impact.
   - Verification method.

8. 30-day implementation plan.
   - Week 1.
   - Week 2.
   - Week 3.
   - Week 4.

9. Ongoing measurement plan.
   - Metrics.
   - Tools.
   - Cadence.
   - Baseline fields.
   - Reporting format.

10. Source appendix.
    - Every source used.
    - Date accessed.
    - What each source was used to verify.

## Final Check Before Answering

Before sending the audit:

- Confirm that every substantive factual claim has a source link or `[SOURCE NEEDED]`.
- Confirm that current facts were checked live when browsing was available.
- Confirm that crawler access, search eligibility, and user-referenced retrieval are not collapsed into one score.
- Confirm that llms.txt is not presented as a proven ranking factor.
- Confirm that self-reported impact claims are treated skeptically.
- Confirm that conflicting sources are named directly.
- Confirm that the action plan is specific enough for a site owner to start this week.
