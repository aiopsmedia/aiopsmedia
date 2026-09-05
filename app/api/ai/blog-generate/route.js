import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { chatCompletion } from '@/lib/ai/groq';
import { ragQuery } from '@/lib/ai/rag';

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const focusKeyword = typeof body.focusKeyword === 'string' ? body.focusKeyword.trim() : '';

    const topic = title || focusKeyword;
    if (!topic) {
      return NextResponse.json({ error: 'Title or focus keyword is required' }, { status: 400 });
    }

    // Pull relevant context for an on-brand, factual draft
    const { chunks } = await ragQuery(topic, 5);

    const systemPrompt =
      `You are the senior content writer for AIOpsMedia, an AI-first digital agency and product company. ` +
      `Write a high-quality, SEO-optimized blog article about the given topic. ` +
      `Use relevant context from the knowledge base when it applies (do not invent facts). ` +
      `Return your answer as strictly valid JSON with the following shape: ` +
      `{"content": "...full article in markdown with h2/h3 headings, bullet points, intro and conclusion...", ` +
      `"excerpt": "...one sentence summary...", ` +
      `"metaDescription": "...150-160 char meta description...", ` +
      `"tags": "comma, separated, tags"}` +
      `\n\n[Knowledge Base Context]\n${chunks.map((c) => `[${c.source}] ${c.text}`).join('\n\n') || 'No specific context available.'}\n[End Context]`;

    const result = await chatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Topic: ${topic}\nFocus keyword: ${focusKeyword || 'not specified'}` },
      ],
      temperature: 0.7,
      maxTokens: 3000,
      json: true,
    });

    let parsed;
    try {
      const jsonStr = result.content.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json({
        error: 'AI returned malformed content. Try again.',
        content: result.content,
      }, { status: 422 });
    }

    // Persist the generated draft so the editor can recover it even mid-session.
    try {
      const user = await db.user.findUnique({ where: { id: session.user.id }, select: { id: true } });
      await db.auditLog.create({
        data: {
          userId: user?.id || null,
          action: 'ai_generate',
          resource: 'blog',
          metadata: JSON.stringify({ topic, focusKeyword, model: result.model }),
        },
      });
    } catch {}

    return NextResponse.json({
      content: parsed.content || parsed.body || '',
      excerpt: parsed.excerpt || '',
      metaDescription: parsed.metaDescription || '',
      tags: parsed.tags || '',
      title: title || parsed.title || '',
      model: result.model,
    });
  } catch {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}