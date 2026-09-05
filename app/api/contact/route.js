import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactFormSchema } from '@/lib/validations';

const rateLimitMap = new Map();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now - record.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) return false;
  record.count++;
  return true;
}

function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return '127.0.0.1';
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Honeypot check — field should be empty if filled by bot
    if (body.website || body.url || body.companyWebsite) {
      return NextResponse.json({ success: true });
    }

    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const lead = await db.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        service: data.service || null,
        source: 'OTHER',
        status: 'NEW',
        priority: 'MEDIUM',
        notes: `Subject: ${data.subject}\n\n${data.message}`,
      },
    });

    // Notify super admins
    try {
      const superAdmins = await db.user.findMany({
        where: { role: 'SUPER_ADMIN', isActive: true },
        select: { id: true },
      });

      await db.notification.createMany({
        data: superAdmins.map((admin) => ({
          userId: admin.id,
          title: 'New Contact Submission',
          message: `${data.name} submitted a contact form: ${data.subject}`,
          type: 'info',
          link: `/admin/leads`,
        })),
      });
    } catch {}

    // Track analytics event
    try {
      await db.analyticsEvent.create({
        data: {
          event: 'contact_submission',
          metadata: JSON.stringify({
            name: data.name,
            email: data.email,
            subject: data.subject,
            leadId: lead.id,
          }),
          ip,
          userAgent: request.headers.get('user-agent') || null,
        },
      });
    } catch {}

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
