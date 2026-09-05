import { db } from '@/lib/db';

/**
 * RAG knowledge-base retrieval.
 *
 * Builds chunks from the CMS content (services, products, blogs, FAQs,
 * case studies, pages) and scores them against the query using a lightweight
 * BM25-style lexical ranking. The top chunks are injected into the LLM
 * prompt as context (Retrieval Augmented Generation).
 */

function tokenize(text) {
  if (!text) return [];
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'you', 'your', 'our', 'with', 'what', 'how',
  'can', 'get', 'from', 'this', 'that', 'have', 'will', 'about', 'which',
  'they', 'them', 'their', 'there', 'where', 'when', 'who', 'here', 'were',
  'was', 'has', 'had', 'into', 'than', 'then', 'these', 'those', 'its',
  'need', 'want', 'does', 'doing', 'make', 'made', 'know', 'like', 'more',
]);

function bm25Score(queryTokens, docTokens, docLen, avgDocLen, tf = 1.2, k1 = 1.5, b = 0.75) {
  const tokenCounts = new Map();
  docTokens.forEach((t) => tokenCounts.set(t, (tokenCounts.get(t) || 0) + 1));

  let score = 0;
  queryTokens.forEach((qt) => {
    const tfValue = tokenCounts.get(qt) || 0;
    if (tfValue === 0) return;
    const tfNorm = (tfValue * (k1 + 1)) / (tfValue + k1 * (1 - b + b * (docLen / avgDocLen)));
    score += tf * tfNorm;
  });
  return score;
}

async function buildChunks() {
  const chunks = [];

  const [services, products, blogs, faqs, caseStudies, pages] = await Promise.all([
    db.service.findMany({
      where: { isActive: true },
      select: {
        title: true,
        slug: true,
        description: true,
        longDescription: true,
        features: true,
        benefits: true,
        pricing: true,
        ctaText: true,
      },
      orderBy: { order: 'asc' },
    }),
    db.product.findMany({
      where: { isActive: true },
      select: {
        title: true,
        slug: true,
        shortDescription: true,
        description: true,
        features: true,
        specifications: true,
        price: true,
        category: true,
      },
      orderBy: { order: 'asc' },
    }),
    db.blog.findMany({
      where: { isPublished: true },
      select: { title: true, slug: true, excerpt: true, content: true, tags: true },
      orderBy: { publishedAt: 'desc' },
    }),
    db.fAQ.findMany({
      where: { isActive: true },
      select: { question: true, answer: true, category: true },
      orderBy: { order: 'asc' },
    }),
    db.caseStudy.findMany({
      where: { isActive: true },
      select: { title: true, slug: true, client: true, industry: true, challenge: true, solution: true, results: true },
      orderBy: { createdAt: 'desc' },
    }),
    db.page.findMany({
      where: { isPublished: true },
      select: { title: true, slug: true, content: true },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  services.forEach((s) => {
    const text = [s.description, s.longDescription, s.features, s.benefits, s.pricing]
      .filter(Boolean)
      .join('\n');
    chunks.push({
      id: `service-${s.slug}`,
      source: `Service: ${s.title}`,
      link: `/services/${s.slug}`,
      text,
      tokens: tokenize(`${s.title} ${s.description} ${s.features} ${s.benefits}`),
    });
  });

  products.forEach((p) => {
    const text = [p.shortDescription, p.description, p.features, p.specifications]
      .filter(Boolean)
      .join('\n');
    const priceTag = p.price ? `\nPrice: ₹${Number(p.price)}` : '';
    chunks.push({
      id: `product-${p.slug}`,
      source: `Product: ${p.title}`,
      link: `/products/${p.slug}`,
      text: `${text}${priceTag}`,
      tokens: tokenize(`${p.title} ${p.shortDescription} ${p.description} ${p.category}`),
    });
  });

  blogs.forEach((b) => {
    const body = (b.content || '').slice(0, 4000);
    chunks.push({
      id: `blog-${b.slug}`,
      source: `Blog: ${b.title}`,
      link: `/blog/${b.slug}`,
      text: `${b.excerpt || ''}\n${body}`,
      tokens: tokenize(`${b.title} ${b.excerpt} ${body} ${b.tags}`),
    });
  });

  faqs.forEach((f) => {
    chunks.push({
      id: `faq-${f.question.slice(0, 40)}`,
      source: `FAQ: ${f.question}`,
      link: null,
      text: f.answer,
      tokens: tokenize(`${f.question} ${f.answer} ${f.category}`),
    });
  });

  caseStudies.forEach((c) => {
    const text = [c.challenge, c.solution, c.results].filter(Boolean).join('\n');
    chunks.push({
      id: `case-${c.slug}`,
      source: `Case Study: ${c.title}`,
      link: `/case-studies/${c.slug}`,
      text,
      tokens: tokenize(`${c.title} ${c.industry} ${c.challenge} ${c.solution} ${c.results}`),
    });
  });

  pages.forEach((p) => {
    const cleaned = String(p.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!cleaned) return;
    chunks.push({
      id: `page-${p.slug}`,
      source: `Page: ${p.title}`,
      link: `/${p.slug}`,
      text: cleaned.slice(0, 4000),
      tokens: tokenize(`${p.title} ${cleaned.slice(0, 1000)}`),
    });
  });

  return chunks;
}

/**
 * Retrieve the top-k relevant chunks for a query.
 */
export async function retrieve(query, k = 6) {
  const chunks = await buildChunks();
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0 || chunks.length === 0) {
    return [];
  }

  const avgDocLen = chunks.reduce((s, c) => s + c.tokens.length, 0) / Math.max(chunks.length, 1);

  const scored = chunks
    .map((chunk) => ({
      ...chunk,
      score: bm25Score(queryTokens, chunk.tokens, chunk.tokens.length, avgDocLen),
    }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, k).map(({ id, source, link, text }) => ({ id, source, link, text }));
}

/**
 * Convenience wrapper that returns the plain text of retrieved chunks + links,
 * and exposes metadata for the frontend to show citation links.
 */
export async function ragQuery(query, k = 6) {
  const chunks = await retrieve(query, k);
  return {
    chunks,
    context: chunks.map((c) => `[Source: ${c.source}] ${c.text}`).join('\n\n'),
    hasContext: chunks.length > 0,
  };
}