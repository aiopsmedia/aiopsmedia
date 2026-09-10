'use server';

import { z } from 'zod';
import { db } from '@/lib/db';

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().max(30).optional().or(z.literal('')),
  company: z.string().max(150).optional().or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
  service: z.string().max(200).optional().or(z.literal('')),
  budget: z.string().max(50).optional().or(z.literal('')),
  projectType: z.string().max(100).optional().or(z.literal('')),
  industry: z.string().max(100).optional().or(z.literal('')),
  timeline: z.string().max(50).optional().or(z.literal('')),
  integrations: z.string().max(500).optional().or(z.literal('')),
  users: z.string().max(50).optional().or(z.literal('')),
  project: z.string().max(5000).optional().or(z.literal('')),
  date: z.string().max(100).optional().or(z.literal('')),
  time: z.string().max(100).optional().or(z.literal('')),
  timezone: z.string().max(100).optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000).optional().or(z.literal('')),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']).optional().default('email'),
  website: z.string().optional().or(z.literal('')),
  formType: z.string().optional().or(z.literal('')),
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
    name: formData.get('name') || '',
    email: formData.get('email') || '',
    phone: formData.get('phone') || '',
    company: formData.get('company') || '',
    country: formData.get('country') || '',
    service: formData.get('service') || '',
    budget: formData.get('budget') || '',
    projectType: formData.get('projectType') || '',
    industry: formData.get('industry') || '',
    timeline: formData.get('timeline') || '',
    integrations: formData.get('integrations') || '',
    users: formData.get('users') || '',
    project: formData.get('project') || '',
    date: formData.get('date') || '',
    time: formData.get('time') || '',
    timezone: formData.get('timezone') || '',
    message: formData.get('message') || formData.get('project') || '',
    preferredContact: formData.get('preferredContact') || 'email',
    formType: formData.get('formType') || '',
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

  // Ensure message present for validation
  if (!data.message || data.message.trim().length < 10) {
    if (data.project && data.project.trim().length >= 10) data.message = data.project;
    else return { success: false, errors: { message: 'Message/project must be at least 10 characters' } };
  }

  try {
    const location = data.country ? `${data.country}` : null;
    const notesParts = [];
    if (data.formType) notesParts.push(`[Form: ${data.formType}]`);
    if (data.country) notesParts.push(`Country: ${data.country}`);
    if (data.projectType) notesParts.push(`Project Type: ${data.projectType}`);
    if (data.industry) notesParts.push(`Industry: ${data.industry}`);
    if (data.timeline) notesParts.push(`Timeline: ${data.timeline}`);
    if (data.integrations) notesParts.push(`Integrations: ${data.integrations}`);
    if (data.users) notesParts.push(`Users: ${data.users}`);
    if (data.date || data.time || data.timezone) notesParts.push(`Preferred: ${data.date || ''} ${data.time || ''} ${data.timezone || ''}`.trim());
    notesParts.push(`Preferred contact: ${data.preferredContact}`);
    notesParts.push('');
    notesParts.push(data.message || data.project || '');
    const lead = await db.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        location: location,
        service: data.service || data.projectType || null,
        budget: data.budget || null,
        source: 'DIRECT',
        status: 'NEW',
        priority: 'MEDIUM',
        notes: notesParts.join('\n'),
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
