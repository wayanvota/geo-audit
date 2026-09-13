const form = document.querySelector("#auditForm");
const output = document.querySelector("#output");
const statusText = document.querySelector("#statusText");
const readinessScore = document.querySelector("#readinessScore");
const readinessBar = document.querySelector("#readinessBar");
const readinessText = document.querySelector("#readinessText");
const tabs = Array.from(document.querySelectorAll(".tab"));
const outputLabel = document.querySelector("#outputLabel");
const outputHelp = document.querySelector("#outputHelp");

let activeTab = "brief";
let promptTemplate = "";

const fields = [
  "siteUrl",
  "brandName",
  "audience",
  "primaryAction",
  "category",
  "geography",
  "topics",
  "risks",
  "competitors",
  "sourcePages",
];

const samples = {
  siteUrl: "https://ictworks.org",
  brandName: "ICTworks",
  audience: "International development professionals using technology for social impact",
  primaryAction: "Subscribe to the newsletter, read analysis, submit guest posts, sponsor content",
  category: "ICT4D publication and community",
  geography: "Global, with emphasis on low- and middle-income countries",
  topics: "Digital development, AI in international development, grant funding, connectivity, health technology, data systems",
  risks: "Incorrect reach metrics, stale leadership or ownership descriptions, sponsored content disclosure, overstated impact claims",
  competitors: "Devex, ICT4D Conference, Digital Impact Alliance, GSMA Mobile for Development",
  sourcePages: "About, Sponsored Posts, Guest Post Guidelines, Generative AI policy, Funding category, RSS feed",
};

const presetSamples = {
  nonprofit: {
    siteUrl: "",
    brandName: "",
    audience: "Donors, supporters, journalists, volunteers, partners, and nonprofit staff",
    primaryAction: "Donate, volunteer, subscribe, contact the development team, or learn about programs",
    category: "Nonprofit organization in a specific cause area",
    geography: "Primary service area and donor market",
    topics: "Mission, programs, impact evidence, donation options, volunteer opportunities, current campaigns",
    risks: "Incorrect mission summary, stale program descriptions, unsupported impact claims, wrong donation route, outdated leadership, peer organizations recommended instead",
    competitors: "Peer nonprofits, local alternatives, national organizations in the same cause area",
    sourcePages: "About, programs, impact or annual report, leadership, donate, FAQ, financials, ratings profiles, press facts",
  },
  funder: {
    siteUrl: "",
    brandName: "",
    audience: "Grantseekers, nonprofit executives, program staff, philanthropy advisors, and foundation staff",
    primaryAction: "Assess fit, review eligibility, understand funding priorities, and decide whether to apply",
    category: "Foundation, grantmaker, donor-advised fund sponsor, or philanthropic intermediary",
    geography: "Funding geography and applicant geography",
    topics: "Funding priorities, eligibility, exclusions, grant sizes, application process, deadlines, past grantees, program officers",
    risks: "AI assistants overstating openness, misstating funding priorities, missing exclusions, inventing deadlines, citing old grant cycles, sending ineligible applicants to staff",
    competitors: "Peer funders, regional foundations, public grant programs, issue-area funders",
    sourcePages: "Funding priorities, eligibility, exclusions, how to apply, grants database, annual report, IRS Form 990, staff, FAQ, news",
  },
};

const fallbackTemplate = `# GEO Audit Studio: Consultant-Grade Website Audit Brief

You are a skeptical GEO auditor, technical SEO analyst, and editorial strategist. Audit the target website for generative engine optimization.

Separate crawler and technical access, search and snippet eligibility, user-referenced retrieval, AI output performance, competitor visibility, and measurement readiness.

Website URL: {{SITE_URL}}
Brand or organization name: {{BRAND_NAME}}
Primary audience: {{AUDIENCE}}
Primary action or conversion: {{PRIMARY_ACTION}}
Category, sector, or market: {{CATEGORY}}
Geographic scope: {{GEOGRAPHY}}
High-value topics: {{TOPICS}}
High-risk topics: {{RISKS}}
Competitors or peer sites: {{COMPETITORS}}
Known source-of-truth pages: {{SOURCE_PAGES}}
Audit preset: {{AUDIT_PRESET}}
Audit depth: {{AUDIT_DEPTH}}

Use live sources when browsing is available. Cite every substantive factual claim with a working markdown link or mark it as [SOURCE NEEDED].

Audit phases:
1. Technical access and crawlability.
2. Route inventory.
3. Entity and brand clarity.
4. Citability and answer readiness.
5. Structured data and machine clues.
6. E-E-A-T, authority, and reputation signals.
7. AI output and user-referenced retrieval tests.
8. Competitor and peer benchmarking.
9. Measurement and reporting plan.
10. P0-P3 prioritized action plan.

Required output: executive readout, scorecard, page inventory, findings by phase, claim contradiction table, user-referenced retrieval test table, P0-P3 action plan, 30-day implementation plan, measurement plan, and source appendix.`;

function getValue(id) {
  const el = document.querySelector(`#${id}`);
  return el ? el.value.trim() : "";
}

function getAuditDepth() {
  const selected = document.querySelector('input[name="auditDepth"]:checked');
  return selected ? selected.value : "Quick";
}

function getAuditPreset() {
  const selected = document.querySelector('input[name="auditPreset"]:checked');
  return selected ? selected.value : "Nonprofit";
}

function getSelectedModules() {
  return Array.from(document.querySelectorAll("[data-module]"))
    .filter((input) => input.checked)
    .map((input) => input.dataset.module);
}

function inputData() {
  return {
    SITE_URL: getValue("siteUrl") || "[WEBSITE URL]",
    BRAND_NAME: getValue("brandName") || "[BRAND OR ORGANIZATION]",
    AUDIENCE: getValue("audience") || "[PRIMARY AUDIENCE]",
    PRIMARY_ACTION: getValue("primaryAction") || "[PRIMARY ACTION]",
    CATEGORY: getValue("category") || "[CATEGORY OR MARKET]",
    GEOGRAPHY: getValue("geography") || "[GEOGRAPHIC SCOPE]",
    TOPICS: getValue("topics") || "[HIGH-VALUE TOPICS]",
    RISKS: getValue("risks") || "[HIGH-RISK TOPICS]",
    COMPETITORS: getValue("competitors") || "[COMPETITORS OR PEERS]",
    SOURCE_PAGES: getValue("sourcePages") || "[SOURCE-OF-TRUTH PAGES]",
    AUDIT_DEPTH: getAuditDepth(),
    AUDIT_PRESET: getAuditPreset(),
  };
}

function replaceTokens(template, data) {
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (token, key) => {
    return Object.hasOwn(data, key) ? data[key] : token;
  });
}

function moduleIntro() {
  const modules = getSelectedModules();
  const labels = {
    technical: "Technical access",
    citability: "Citability",
    entity: "Entity clarity",
    schema: "Structured data",
    mentions: "User-referenced retrieval",
    competitors: "Competitor benchmark",
    measurement: "Measurement plan",
  };

  return [
    `## Audit Preset: ${getAuditPreset()}`,
    "",
    presetInstruction(),
    "",
    "## Selected Modules",
    "",
    modules.length
      ? modules.map((name) => `- ${labels[name] || name}`).join("\n")
      : "- No modules selected. Run the full audit unless the site owner gives a narrow scope.",
    "",
    "If a selected module cannot be tested because tool access or private data is missing, mark it as not tested and exclude it from the overall score instead of scoring it zero.",
    "",
  ].join("\n");
}

function presetInstruction() {
  const preset = getAuditPreset();
  if (preset === "Funder") {
    return "Treat this as a funder accuracy audit. Test whether AI assistants accurately describe funding priorities, eligibility, exclusions, geography, application routes, deadlines, grant size, past grantees, and fit to grantseekers. Prioritize false-fit risk, applicant burden, staff time, and public trust.";
  }
  if (preset === "General") {
    return "Treat this as a general public website audit. Test whether AI assistants can identify the organization, retrieve current source-of-truth pages, cite accurate facts, and avoid stale or unsupported summaries.";
  }
  return "Treat this as a nonprofit visibility audit. Test whether AI assistants accurately describe the organization to donors, supporters, journalists, partners, and staff. Prioritize mission clarity, program facts, donation routes, impact evidence, peer comparisons, and reputational risk.";
}

function promptOutput() {
  const base = promptTemplate || fallbackTemplate;
  return `${moduleIntro()}${replaceTokens(base, inputData())}`;
}

function scorecardOutput() {
  const data = inputData();
  return `# GEO Audit Scorecard

Target: ${data.SITE_URL}
Brand: ${data.BRAND_NAME}
Audit depth: ${data.AUDIT_DEPTH}

Use 0 to 100 scores. If a domain cannot be tested, mark it "not tested" and exclude it from the overall score.

| Domain | Weight | Score | Evidence Required | Risk to Flag | Priority |
|---|---:|---:|---|---|---|
| Technical access and crawlability | 15% |  | robots.txt, sitemap, HTTPS, redirects, noindex, canonical, visible HTML, AI crawler rules | AI tools cannot fetch or parse the site | P0 |
| Search and snippet eligibility | Included above |  | indexability, snippet controls, canonical status, Google/Bing eligibility | Search-backed AI systems cannot use the site | P0 |
| Entity clarity | 15% |  | homepage, about, footer, schema, social profiles, directories, search snippets | AI describes the brand incorrectly | P1 |
| Citability and answer readiness | 20% |  | direct answer, definitions, FAQs, source links, summaries, dates, authors, limitations | AI can access pages but does not cite them | P1 |
| Structured data and metadata | 10% |  | Organization, Article, Person, FAQPage, Product, Service, BreadcrumbList, OG tags | Machine clues are thin, stale, or contradictory | P2 |
| Authority and reputation | 15% |  | author credentials, source links, evidence pages, external corroboration, reviews, press | AI treats weak claims as facts or ignores the site | P1 |
| AI output performance | 15% |  | prompt test table, mention rate, citation rate, accuracy rate, source quality | Competitors are mentioned or cited instead | P1 |
| Measurement readiness | 10% |  | GA4, Search Console, server logs, AI referral tracking, prompt testing cadence | Owner cannot tell whether fixes worked | P2 |

## Suggested Overall Grade

- 0 to 19: Blocked.
- 20 to 39: Low visibility.
- 40 to 59: Emerging.
- 60 to 79: Strong.
- 80 to 100: AI-ready.

## Evidence Notes

- Do not use one blended score to hide tradeoffs.
- Separate signal health from output performance.
- Treat llms.txt as a controlled-narrative file unless official platform evidence says otherwise.
- Treat self-reported authority and impact claims skeptically.
`;
}

function measurementOutput() {
  const data = inputData();
  const brand = data.BRAND_NAME;
  const category = data.CATEGORY;
  const competitors = data.COMPETITORS;

  return `# GEO Measurement Plan

Target: ${data.SITE_URL}
Brand: ${brand}
Category: ${category}
Competitors or peers: ${competitors}

## Monthly Prompt Set

Run these in ChatGPT, Gemini, Perplexity, Claude, Copilot, and Google AI Mode when available. Record platform, date, model, citations, answer text, and errors.

| Prompt Group | Prompt |
|---|---|
| Brand summary | What is ${brand}, what does it do, and who does it serve? Cite your sources. |
| Source-restricted | Use only ${data.SITE_URL}. What does ${brand} do, what evidence supports its claims, and what should a skeptical user verify? |
| Category recommendation | What are the best ${category} options for ${data.AUDIENCE}? Cite sources. |
| Comparison | Compare ${brand} with ${competitors || "[competitor names]"}. What are the strengths, weaknesses, and source links? |
| Evidence | What evidence supports ${brand}'s claims? Use recent and direct sources. |
| Risk | What are the criticisms, limitations, or risks of ${brand}? Cite sources and separate facts from opinions. |
| Current facts | Who leads ${brand}, what does it cost, where is it available, and what changed recently? |
| Buyer or funder question | Should ${data.AUDIENCE} consider ${brand} for ${data.PRIMARY_ACTION}? What should they verify first? |
| Content ownership | Which pages from ${data.SITE_URL} are most useful for understanding ${data.TOPICS}? |
| Competitor gap | Which organizations or sites are cited instead of ${brand} for ${category}, and why? |

## Metrics

| Metric | Formula | Cadence | Owner |
|---|---|---|---|
| Mention rate | Prompts mentioning brand / total prompts | Monthly | Marketing or editorial lead |
| Citation rate | Prompts citing target domain / total prompts | Monthly | Marketing or SEO lead |
| Share of voice | Brand mentions / all relevant brand and competitor mentions | Monthly | Marketing lead |
| Accuracy rate | Accurate brand descriptions / total brand mentions | Monthly | Communications lead |
| Intended-source citation rate | Citations to source-of-truth pages / all target-domain citations | Monthly | Content owner |
| AI referral sessions | Sessions from known AI referrers | Monthly | Analytics owner |
| AI referral conversion rate | Conversions from AI referrals / AI referral sessions | Monthly | Analytics owner |
| Branded search lift | Branded query trend in Search Console | Monthly | SEO lead |

## Quarterly Review

1. Re-run the full audit.
2. Compare category scores against the prior quarter.
3. Review which pages were cited by AI tools.
4. Identify competitor pages cited more often than yours.
5. Update the P0-P3 action list.
6. Refresh source-of-truth pages before publishing new claims.

## Regression Triggers

Re-run the audit after redesigns, CMS migrations, robots.txt edits, sitemap changes, schema changes, pricing changes, leadership changes, new product launches, major policy updates, or major content pruning.
`;
}

function executiveOutput() {
  const data = inputData();
  return `# One-Screen GEO Executive Result

Target: ${data.SITE_URL}
Brand: ${data.BRAND_NAME}
Preset: ${data.AUDIT_PRESET}
Audience: ${data.AUDIENCE}

Use this prompt when the reader needs a board-ready or CEO-ready result on one screen.

Audit ${data.SITE_URL} for generative engine optimization, using the ${data.AUDIT_PRESET} preset.

${presetInstruction()}

Return only the following sections:

## Bottom Line
One direct paragraph. State whether AI assistants can find, understand, cite, and accurately represent this website today. Include the most material risk and the highest-leverage fix.

## Score
Give a 0 to 100 GEO score and one sentence explaining the score. If important tests were not possible, say which ones were not tested.

## What AI Gets Right
List up to 3 facts or themes AI tools are likely to represent accurately, with source URLs.

## What AI Gets Wrong or Misses
List up to 5 material errors, omissions, stale facts, unsupported claims, or competitor substitutions. For each one, include the prompt that exposed it and the source URL that should correct it.

## Fix First
Give the 5 highest-priority fixes in order. Label each as content, technical, reputation, or measurement.

## Decision Needed
Name the one decision the site owner has to make before the next audit cycle.

Evidence rules:
Use live web retrieval when available. Link every substantive factual claim. Mark unverified facts as [SOURCE NEEDED]. Do not infer performance from vendor claims or self-reported impact metrics without naming the source.`;
}

function actionsOutput() {
  const data = inputData();
  return `# P0-P3 GEO Action Plan

Target: ${data.SITE_URL}
Brand: ${data.BRAND_NAME}

## P0: Blocking Issues

| Action | Evidence to collect | Why it matters | Verification |
|---|---|---|---|
| Confirm robots.txt does not block intended search and AI crawlers | robots.txt rules for Googlebot, Bingbot, OAI-SearchBot, GPTBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended | Blocked pages cannot be discovered or cited reliably | Fetch robots.txt and retest crawler rules |
| Confirm priority pages are indexable and snippet-eligible | noindex, nosnippet, X-Robots-Tag, canonical, sitemap status | Search-backed AI systems often depend on normal search eligibility | Check page HTML, headers, sitemap, and Search Console if available |
| Ensure primary content appears in initial HTML | visible text before JavaScript execution | Thin or script-only pages are fragile for AI retrieval | Compare rendered page with source or fetched HTML |

## P1: High-Impact Fixes

| Action | Evidence to collect | Why it matters | Verification |
|---|---|---|---|
| Create or update a source-of-truth facts page | About, leadership, pricing, services, policies, contact, current dates | AI tools need one reliable page for brand facts | Re-run brand summary and source-restricted prompts |
| Reconcile conflicting brand claims | audience size, pricing, leadership, location, programs, impact, dates | AI tools often repeat whichever conflicting page they retrieve | Build a claim table and update stale pages |
| Add direct answers to top pages | first 200 to 300 words, definitions, summaries, FAQs | AI systems cite pages that answer clearly and quickly | Test page summaries in AI tools |
| Add evidence for major claims | sources, dates, methods, denominators, case studies, limitations | Unsupported claims create reputation risk | Review citations and source links |

## P2: Medium-Impact Improvements

| Action | Evidence to collect | Why it matters | Verification |
|---|---|---|---|
| Improve structured data | Organization, Article, Person, FAQPage, Product, Service, BreadcrumbList | Machine-readable clues help systems interpret pages | Validate JSON-LD and compare to visible content |
| Build topic hub pages | ${data.TOPICS} | Hubs make expertise easier to detect and cite | Check internal links and AI citations |
| Add author, date, and review signals | author bios, datePublished, dateModified, editorial policy | Trust signals improve defensibility | Audit current top pages |
| Set up AI referral and prompt tracking | GA4, Search Console, server logs, spreadsheet | Fixes need measurement | Review monthly dashboard |

## P3: Monitoring and Optional Assets

| Action | Evidence to collect | Why it matters | Verification |
|---|---|---|---|
| Publish llms.txt only if useful for controlled narrative | /llms.txt, /llms-full.txt, important links | It may help humans and some tools, but should not be sold as a proven ranking factor | Fetch file and check content quality |
| Monitor forums and third-party listings | Reddit, Quora, reviews, directories, social profiles | External descriptions can influence AI summaries | Monthly reputation review |
| Update comparison and alternative pages | competitor citations, user questions | Competitors often win category prompts with comparison content | Re-run competitor prompt set |

## 30-Day Sequence

Week 1: Fix access blockers, publish sitemap reference, identify source-of-truth pages, and build the claim conflict table.

Week 2: Rewrite About or facts page, add direct answers to top pages, update stale metrics, and add citations for major claims.

Week 3: Improve schema, FAQs, summaries, internal links, and author/date signals on priority pages.

Week 4: Run the AI prompt set, compare competitors, capture baseline metrics, and set the next quarter's work list.
`;
}

function renderOutput() {
  const views = {
    brief: promptOutput,
    executive: executiveOutput,
    scorecard: scorecardOutput,
    measurement: measurementOutput,
    actions: actionsOutput,
  };
  const labels = {
    brief: {
      title: "Full Audit Brief",
      help: "Complete audit prompt to paste into a browsing AI tool."
    },
    scorecard: {
      title: "Scorecard Module",
      help: "Focused prompt module for scoring evidence after audit discovery."
    },
    executive: {
      title: "Executive Result",
      help: "One-screen prompt for a board-ready or CEO-ready GEO readout."
    },
    measurement: {
      title: "Measurement Module",
      help: "Focused prompt module for recurring prompt tests, citation tracking, and AI referral measurement."
    },
    actions: {
      title: "Action Plan Module",
      help: "Focused prompt module for converting findings into P0-P3 fixes."
    }
  };
  output.value = views[activeTab]();
  if (outputLabel && outputHelp) {
    outputLabel.textContent = labels[activeTab].title;
    outputHelp.textContent = labels[activeTab].help;
  }
  statusText.textContent = "Ready";
}

function updateReadiness() {
  const checks = Array.from(document.querySelectorAll("[data-readiness]"));
  const checked = checks.filter((input) => input.checked).length;
  const score = Math.round((checked / checks.length) * 100);
  readinessScore.textContent = `${score}%`;
  readinessBar.style.width = `${score}%`;
  if (score >= 80) {
    readinessText.textContent = "Strong starting point. The live audit should focus on output quality and competitors.";
  } else if (score >= 50) {
    readinessText.textContent = "Some foundations are in place. Expect the audit to find source-of-truth and citability gaps.";
  } else {
    readinessText.textContent = "Low self-check score. Start with access, sitemap, source-of-truth pages, and measurement setup.";
  }
}

function saveState() {
  const state = {};
  fields.forEach((id) => {
    state[id] = getValue(id);
  });
  state.auditDepth = getAuditDepth();
  state.auditPreset = getAuditPreset();
  state.modules = getSelectedModules();
  state.readiness = Array.from(document.querySelectorAll("[data-readiness]"))
    .filter((input) => input.checked)
    .map((input) => input.dataset.readiness);
  localStorage.setItem("geoAuditStudio", JSON.stringify(state));
}

function loadState() {
  try {
    const raw = localStorage.getItem("geoAuditStudio");
    if (!raw) return;
    const state = JSON.parse(raw);
    fields.forEach((id) => {
      const el = document.querySelector(`#${id}`);
      if (el && state[id]) el.value = state[id];
    });
    if (state.auditDepth) {
      const depth = document.querySelector(`input[name="auditDepth"][value="${state.auditDepth}"]`);
      if (depth) depth.checked = true;
    }
    if (state.auditPreset) {
      const preset = document.querySelector(`input[name="auditPreset"][value="${state.auditPreset}"]`);
      if (preset) preset.checked = true;
    }
    if (Array.isArray(state.modules)) {
      document.querySelectorAll("[data-module]").forEach((input) => {
        input.checked = state.modules.includes(input.dataset.module);
      });
    }
    if (Array.isArray(state.readiness)) {
      document.querySelectorAll("[data-readiness]").forEach((input) => {
        input.checked = state.readiness.includes(input.dataset.readiness);
      });
    }
  } catch {
    localStorage.removeItem("geoAuditStudio");
  }
}

function loadPreset(name) {
  const values = presetSamples[name];
  if (!values) return;
  Object.entries(values).forEach(([id, value]) => {
    const el = document.querySelector(`#${id}`);
    if (el && value) el.value = value;
  });
  const presetValue = name === "funder" ? "Funder" : "Nonprofit";
  const presetInput = document.querySelector(`input[name="auditPreset"][value="${presetValue}"]`);
  if (presetInput) presetInput.checked = true;
  const full = document.querySelector('input[name="auditDepth"][value="Full"]');
  if (full) full.checked = true;
  updateAll(`${presetValue} preset loaded`);
}

function setSample() {
  Object.entries(samples).forEach(([id, value]) => {
    const el = document.querySelector(`#${id}`);
    if (el) el.value = value;
  });
  document.querySelector('input[name="auditDepth"][value="Full"]').checked = true;
  document.querySelector('input[name="auditPreset"][value="Nonprofit"]').checked = true;
  document.querySelectorAll("[data-module]").forEach((input) => {
    input.checked = true;
  });
  ["robots", "sitemap", "about"].forEach((name) => {
    const input = document.querySelector(`[data-readiness="${name}"]`);
    if (input) input.checked = true;
  });
  updateAll("Sample loaded");
}

function clearForm() {
  fields.forEach((id) => {
    const el = document.querySelector(`#${id}`);
    if (el) el.value = "";
  });
  document.querySelector('input[name="auditDepth"][value="Quick"]').checked = true;
  document.querySelector('input[name="auditPreset"][value="Nonprofit"]').checked = true;
  document.querySelectorAll("[data-module]").forEach((input) => {
    input.checked = true;
  });
  document.querySelectorAll("[data-readiness]").forEach((input) => {
    input.checked = false;
  });
  localStorage.removeItem("geoAuditStudio");
  updateAll("Cleared");
}

function updateAll(message = "Updated") {
  updateReadiness();
  renderOutput();
  saveState();
  statusText.textContent = message;
}

async function copyCurrent() {
  try {
    await navigator.clipboard.writeText(output.value);
    statusText.textContent = "Copied";
  } catch {
    output.select();
    document.execCommand("copy");
    statusText.textContent = "Copied";
  }
}

function download(filename, text) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function slug() {
  const brand = getValue("brandName") || "website";
  return brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "website";
}

function downloadAll() {
  const text = [
    promptOutput(),
    "\n\n---\n\n",
    executiveOutput(),
    "\n\n---\n\n",
    scorecardOutput(),
    "\n\n---\n\n",
    measurementOutput(),
    "\n\n---\n\n",
    actionsOutput(),
  ].join("");
  download(`${slug()}-geo-audit-pack.md`, text);
  statusText.textContent = "Downloaded";
}

function downloadPromptOnly() {
  download(`${slug()}-geo-audit-prompt.md`, promptOutput());
  statusText.textContent = "Full brief downloaded";
}

function setupTabs() {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeTab = tab.dataset.tab;
      tabs.forEach((other) => {
        const isActive = other === tab;
        other.classList.toggle("active", isActive);
        other.setAttribute("aria-selected", String(isActive));
      });
      renderOutput();
    });
  });
}

async function loadTemplate() {
  try {
    const response = await fetch("prompts/generative-engine-optimization-audit-pro-prompt.md");
    if (!response.ok) throw new Error("Template fetch failed");
    promptTemplate = await response.text();
  } catch {
    promptTemplate = fallbackTemplate;
  }
}

document.querySelector("#sampleButton").addEventListener("click", setSample);
document.querySelector("#nonprofitPresetButton").addEventListener("click", () => loadPreset("nonprofit"));
document.querySelector("#funderPresetButton").addEventListener("click", () => loadPreset("funder"));
document.querySelector("#clearButton").addEventListener("click", clearForm);
document.querySelector("#copyButton").addEventListener("click", copyCurrent);
document.querySelector("#copyActiveButton").addEventListener("click", copyCurrent);
document.querySelector("#downloadButton").addEventListener("click", downloadAll);
document.querySelector("#downloadPromptButton").addEventListener("click", downloadPromptOnly);

document.addEventListener("input", (event) => {
  if (event.target.closest("#app")) updateAll();
});

document.addEventListener("change", (event) => {
  if (event.target.closest("#app")) updateAll();
});

setupTabs();
loadState();
loadTemplate().then(() => updateAll("Ready"));
