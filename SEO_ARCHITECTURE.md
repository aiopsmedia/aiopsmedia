# SEO Architecture — AiOpsMedia

## Site Structure
- Root: `/` (x-default) — global
- Markets: `/usa` (en-US), `/uk` (en-GB), `/uae` (en-AE), `/uae/dubai` (local UAE)
- Services: `/services` + `/services/[slug]` (15 slugs)
- Industries: `/industries` + `/industries/[slug]` (9)
- Case Studies: `/case-studies` + `/case-studies/[slug]` (5 illustrative)
- Blog hub: `/blog` + `/blog/[slug]` (20 seed posts)
- Conversion: `/contact`, `/estimate`, `/book-consultation`, `/pricing`, `/technology`, `/careers`, `/resources`, `/search`
- Legal: `/privacy-policy`, `/terms-conditions`, `/cookies-policy`, `/refund-policy`, `/disclaimer`, `/data-protection`, `/accessibility`
- Utility: `/sitemap.xml`, `/robots.txt`, `/health` (api)

## URL Rules
Lowercase, hyphenated, no query param for indexable pages. Market services: `/usa/[service]` etc. Industries: `/industries/real-estate`.

## Hreflang
- `en-US` ↔ `/usa`, `en-GB` ↔ `/uk`, `en-AE` ↔ `/uae`, `x-default` ↔ `/`
- Only among equivalent market hubs. Service pages have self-referencing canonical; hreflang among market-service equivalents where content is truly equivalent, else no hreflang (avoid mis-mapping).
- Implemented via `generateHreflangAlternates()` in `lib/market-hreflang.js` added to `generateMetadata` alternates.

## Canonical Strategy
Every indexable page has self-referencing canonical via `lib/seo.js` `alternates.canonical`. No duplicate params indexed (`/search?q=` is noindex).

## Indexing Strategy
- Index: `/`, `/services/*`, `/industries/*`, `/usa`, `/uk`, `/uae`, `/usa/*`, `/uk/*`, `/uae/*`, `/blog`, `/blog/*`, `/case-studies/*`, `/pricing`, `/technology`, `/about`, `/contact`, `/resources`.
- Noindex: `/admin/*`, `/login`, `/api/*`, `/search` (query pages), drafts.
- Sitemap includes only indexable, published content (200 OK). `app/sitemap.js` extended to include industries, markets, landing.

## Schema Strategy
- `Organization` + `WebSite` + `SearchAction` on home; `LocalBusiness` on global.
- `Service` on `/services/[slug]` (provider AiOpsMedia)
- `BreadcrumbList` on every hierarchical page
- `FAQPage` where FAQ visible
- `Article` for blog (`headline`, `datePublished`, `author`, `publisher`)
- `WebPage` for legal/resources
- No fake `AggregateRating`, `Review`, awards.

## Internal Linking & Clusters
- Cluster 1 AI: Pillar `/services/ai-development` → blogs `how-much-does-ai-development-cost`, `how-to-choose-ai-development-company`, `how-to-build-ai-agent`
- Cluster 2 CRM: Pillar `/services/crm-development` → `crm-vs-erp`, `custom-crm-vs-off-the-shelf`, `how-much-does-crm-cost`, `from-spreadsheet-to-crm`
- Cluster 3 Automation: Pillar `/services/ai-automation` → `what-automate-first`, `10-business-processes`, `ai-automation-small-business`
- Cluster 4 Real Estate: Pillar `/industries/real-estate` → `/services/real-estate-erp`, blog `real-estate-ai-crm-automation`
- Every page links naturally to related services/industries/blogs + contact CTA.

## Content Quality
- Human-written helpful, 1500–2500w pillars, 1000–1500 short guides, no keyword stuffing, no Lorem.
- All stats/case studies labeled illustrative until verified. No fabricated testimonials/clients.

## Performance & Analytics
- Next/Image, lazy loading, server components, no huge JS, font optimized.
- Consent-gated GA4; legitimate events: `page_view`, `contact_form_start`, `consultation_click`, `estimate_completed`, `case_study_view`, `blog_view`.
