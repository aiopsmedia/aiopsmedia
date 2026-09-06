import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// In-memory rate limiter keyed by IP + form slug.
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 10;
const rateLimits = new Map();

function rateLimit(ip, slug) {
  const key = `${slug}:${ip}`;
  const now = Date.now();
  const record = rateLimits.get(key);
  if (!record || now - record.start > WINDOW_MS) {
    rateLimits.set(key, { start: now, count: 1 });
    return { allowed: true };
  }
  record.count += 1;
  return {
    allowed: record.count <= MAX_PER_WINDOW,
    retryAfter: Math.ceil((record.start + WINDOW_MS - now) / 1000),
  };
}

function clientIp(request) {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request, { params }) {
  const slug = params?.slug;
  if (!slug) {
    return NextResponse.json({ error: 'Form slug is required' }, { status: 400 });
  }

  try {
    const form = await db.form.findUnique({ where: { slug } });
    if (!form || !form.isActive) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    const ip = clientIp(request);
    const { allowed, retryAfter } = rateLimit(ip, slug);
    if (!allowed) {
      return NextResponse.json(
        { error: `Too many requests. Try again in ${retryAfter}s.` },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    const body = await request.json();
    const fields = Array.isArray(form.fields) ? form.fields : [];
    const data = {};

    for (const field of fields) {
      const value = body[field.key];
      const raw = Array.isArray(value)
        ? value.map((v) => String(v).trim())
        : String(value ?? '').trim();

      if (field.required && (!raw || (Array.isArray(raw) && raw.length === 0))) {
        return NextResponse.json(
          { error: `${field.label} is required` },
          { status: 422 }
        );
      }

      if (field.type === 'email' && raw && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
        return NextResponse.json(
          { error: `Please enter a valid email for ${field.label}` },
          { status: 422 }
        );
      }

      if (field.type === 'number') {
        const num = Number(Array.isArray(raw) ? raw[0] : raw);
        if (field.required && Number.isNaN(num)) {
          return NextResponse.json({ error: `${field.label} must be a number` }, { status: 422 });
        }
        data[field.key] = Number.isNaN(num) ? '' : num;
        continue;
      }

      data[field.key] = Array.isArray(raw) ? raw : raw;
    }

    const submission = await db.formSubmission.create({
      data: {
        formId: form.id,
        data,
        ip,
        userAgent: (request.headers.get('user-agent') || '').slice(0, 300),
      },
    });

    try {
      await db.analyticsEvent.create({
        data: {
          event: 'form_submission',
          path: `/forms/${slug}`,
          metadata: JSON.stringify({ formId: form.id, submissionId: submission.id }),
          ip,
          userAgent: (request.headers.get('user-agent') || '').slice(0, 300),
        },
      });
    } catch {}

    try {
      const admins = await db.user.findMany({
        where: { role: { in: ['SUPER_ADMIN', 'ADMIN'] }, isActive: true },
        select: { id: true },
      });
      if (admins.length > 0) {
        await db.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            title: `New ${form.name} submission`,
            message: `A new submission was received for "${form.name}".`,
            type: 'lead',
            link: `/admin/forms/${form.id}`,
          })),
        });
      }
    } catch {}

    try {
      revalidatePath(`/forms/${slug}`);
    } catch {}

    return NextResponse.json({
      success: true,
      message: form.successMessage || 'Thanks! Your submission has been received.',
      redirectUrl: form.redirectUrl || null,
      id: submission.id,
    });
  } catch (err) {
    console.error('[forms] submission error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}