import { NextResponse } from 'next/server';
import { chatCompletion, buildSystemPrompt } from '@/lib/ai/groq';
import { ragQuery } from '@/lib/ai/rag';

const MAX_HISTORY = 10;

// Simple in-memory rate limiter (per deployment instance). Guards the public,
// paid Groq endpoint from abuse. For multi-instance deployments pair this with
// a CDN/edge rate limit.
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 30;
const rateLimits = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const record = rateLimits.get(ip);
  if (!record || now - record.start > WINDOW_MS) {
    rateLimits.set(ip, { start: now, count: 1 });
    return { allowed: true };
  }
  record.count += 1;
  if (record.count > MAX_PER_WINDOW) {
    return { allowed: false, retryAfter: Math.ceil((record.start + WINDOW_MS - now) / 1000) };
  }
  return { allowed: true };
}

function clientIp(request) {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request) {
  try {
    const ip = clientIp(request);
    const { allowed, retryAfter } = rateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: `Too many requests. Try again in ${retryAfter}s.` },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    const body = await request.json();
    const query = typeof body.message === 'string' ? body.message.trim() : '';
    const history = Array.isArray(body.history) ? body.history.slice(-MAX_HISTORY) : [];

    if (!query) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // 1. RETRIEVE — pull relevant knowledge-base chunks
    const { chunks, context } = await ragQuery(query, 6);

    // 2. AUGMENT — build the system prompt with retrieved context
    const systemPrompt = buildSystemPrompt(chunks);

    // 3. GENERATE — call Groq with history + new message
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((h) => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: String(h.content).slice(0, 4000) })),
      { role: 'user', content: query.slice(0, 4000) },
    ];

    const result = await chatCompletion({ messages, temperature: 0.6, maxTokens: 1024 });

    return NextResponse.json({
      message: result.content,
      model: result.model,
      links: chunks.filter((c) => c.link).map((c) => ({ label: c.source, href: c.link })),
      sourceCount: chunks.length,
    });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}