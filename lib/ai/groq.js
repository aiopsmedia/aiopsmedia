const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

export const DEFAULT_MODEL = GROQ_MODEL;
export const GROQ_AVAILABLE = Boolean(GROQ_API_KEY);

/**
 * Call the Groq chat completions API.
 * Falls back to a deterministic local fallback if GROQ_API_KEY is not configured,
 * so the system never breaks when the key is missing.
 */
export async function chatCompletion({ messages, temperature = 0.7, maxTokens = 1024, model = GROQ_MODEL, json = false }) {
  if (!GROQ_API_KEY) {
    return {
      content: fallbackResponse(messages),
      model: 'fallback',
    };
  }

  const payload = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  };

  if (json) {
    payload.response_format = { type: 'json_object' };
  }

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Groq API error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from Groq API');
    }

    return {
      content,
      model: data.model || model,
      usage: data.usage || null,
    };
  } catch (err) {
    // Graceful fallback so UI never breaks
    return {
      content: fallbackResponse(messages),
      model: 'fallback',
      error: err.message,
    };
  }
}

/**
 * Deterministic local fallback used when GROQ_API_KEY is missing or the API fails.
 * Generates a simple but useful answer based on the source context embedded in the
 * system prompt (if RAG context was injected) or a generic response.
 */
function fallbackResponse(messages) {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const query = lastUser?.content || '';

  const system = messages.find((m) => m.role === 'system');
  const contextText = system?.content || '';

  // If RAG context exists, construct a basic answer by finding relevant snippets.
  if (contextText.includes('[End Context]')) {
    const marker = '[Knowledge Base Context]';
    const start = contextText.lastIndexOf(marker);
    const end = contextText.indexOf('[End Context]');
    const context = start >= 0 && end > start + marker.length
      ? contextText.slice(start + marker.length, end)
      : '';
    const paragraphs = context
      .split('\n')
      .map((p) => p.trim().replace(/^\d+\.\s*/, ''))
      .filter((p) => p.length > 40 && !/^(Source|FAQ|Page|Product|Service|Case Study):/i.test(p));

    if (paragraphs.length > 0) {
      const queryWords = query.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
      const scored = paragraphs
        .map((p) => {
          const pLower = p.toLowerCase();
          const score = queryWords.reduce((s, w) => (pLower.includes(w) ? s + 1 : s), 0);
          return { p, score };
        })
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score);

      if (scored.length > 0) {
        const top = scored.slice(0, 2).map((r) => r.p).join(' ');
        return `Based on what we know: ${top}`;
      }
    }
  }

  return (
    `Thanks for reaching out to AIOpsMedia! I don't have a live AI connection right now, but our team covers ` +
    `AI & Automation, Custom Software Development, Web Development, Mobile Apps, and Cloud Solutions. ` +
    `For anything specific, please contact us at info@aiopsmedia.com or +91 6203818011 and we'll get back to you quickly.`
  );
}

/** Convert content into the structured context injected into the LLM system prompt. */
export function buildSystemPrompt(contextChunks) {
  const systemBase = `You are the AI assistant for AIOpsMedia, an AI-first digital agency and product company in Kishanganj, Bihar, India. ` +
    `You help visitors understand our services, products, pricing, and capabilities. Answer in a friendly, concise, helpful tone. ` +
    `If the user greets or asks non-business questions, respond politely. ` +
    `Always answer based ONLY on the [Knowledge Base Context] provided. If the answer isn't in the context, say you're not sure and suggest contacting the team at info@aiopsmedia.com or +91 6203818011. ` +
    `Do not invent services, prices, or facts that are not in the context.`;

  if (!contextChunks || contextChunks.length === 0) {
    return systemBase;
  }

  const contextText = contextChunks
    .map((chunk) => `Source: ${chunk.source}\n${chunk.text}`)
    .join('\n\n');

  return `${systemBase}\n\n[Knowledge Base Context]\n${contextText}\n[End Context]`;
}

export const AI_CONFIG = {
  available: GROQ_AVAILABLE,
  model: GROQ_MODEL,
};