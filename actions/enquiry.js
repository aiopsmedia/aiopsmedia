'use server';

import { z } from 'zod';
import { db } from '@/lib/db';

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().max(20).optional().or(z.literal('')),
  company: z.string().max(150).optional().or(z.literal('')),
  service: z.string().max(200).optional().or(z.literal('')),
  budget: z.string().max(50).optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']).optional().default('email'),
  website: z.string().optional().or(z.literal('')),
});

const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 5;

  const record = rateLimitMap.get(ip);
  if (!record || now - record.start > windowMs) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return true;
  }

  record.count++;
  if (record.count > maxRequests) return false;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap) {
    if (now - record.start > 120_000) rateLimitMap.delete(ip);
  }
}, 60_000);

export async function createEnquiry(formData) {
  const ip = formData.get('__ip') || 'unknown';

  if (formData.get('website')) {
    return { success: true };
  }

  if (!checkRateLimit(ip)) {
    return { success: false, error: 'Too many requests. Please try again later.' };
  }

  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || '',
    company: formData.get('company') || '',
    service: formData.get('service') || '',
    budget: formData.get('budget') || '',
    message: formData.get('message'),
    preferredContact: formData.get('preferredContact') || 'email',
  };

  const parsed = contactFormSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { success: false, errors: fieldErrors };
  }

  const data = parsed.data;

  try {
    const lead = await db.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        service: data.service || null,
        budget: data.budget || null,
        source: 'DIRECT',
        status: 'NEW',
        priority: 'MEDIUM',
        notes: `[Contact Form] Preferred: ${data.preferredContact}\n\n${data.message}`,
      },
    });

    try {
      const admins = await db.user.findMany({
        where: { role: { in: ['SUPER_ADMIN', 'ADMIN', 'SALES'] }, isActive: true },
        select: { id: true },
      });

      if (admins.length > 0) {
        await db.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            title: 'New Contact Form Lead',
            message: `${data.name} from ${data.company || 'N/A'} submitted a contact form.`,
            type: 'lead',
            link: `/admin/leads`,
          })),
        });
      }
    } catch {
      // Notifications are non-critical
    }

    try {
      await db.analyticsEvent.create({
        data: {
          event: 'contact_form_submission',
          path: '/contact',
          metadata: JSON.stringify({ leadId: lead.id, name: data.name }),
        },
      });
    } catch {
      // Analytics is non-critical
    }

    return { success: true, leadId: lead.id };
  } catch (error) {
    console.error('[Enquiry] Create error:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
