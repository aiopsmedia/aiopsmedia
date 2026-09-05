import { NextResponse } from 'next/server';
import { chatCompletion, buildSystemPrompt } from '@/lib/ai/groq';
import { ragQuery } from '@/lib/ai/rag';

const MAX_HISTORY = 10;

export async function POST(request) {
  try {
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