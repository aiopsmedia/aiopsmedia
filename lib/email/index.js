import { APP_NAME, APP_URL } from '@/config/constants';
import { formatCurrency, formatDate } from '@/lib/utils';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'AIOpsMedia <noreply@aiopsmedia.com>';
const isEmailEnabled = !!RESEND_API_KEY;

export async function sendEmail({ to, subject, html, text }) {
  if (!isEmailEnabled) {
    console.log('[Email] Skipping - no RESEND_API_KEY configured.', { to, subject });
    return { success: true, mocked: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Email] Resend API error:', data);
      return { success: false, error: data.message || 'Failed to send email' };
    }

    return { success: true, id: data.id };
  } catch (error) {
    console.error('[Email] Send error:', error);
    return { success: false, error: error.message };
  }
}

function emailWrapper(content) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px 24px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 24px; margin: 0; font-weight: 700; }
    .body { padding: 32px 24px; color: #3f3f46; line-height: 1.6; font-size: 15px; }
    .body h2 { color: #18181b; font-size: 20px; margin-top: 0; }
    .body p { margin: 12px 0; }
    .btn { display: inline-block; background: #6366f1; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 16px 0; }
    .info-box { background: #f4f4f5; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .info-box p { margin: 6px 0; }
    .info-box strong { color: #18181b; }
    .footer { background: #18181b; padding: 24px; text-align: center; color: #a1a1aa; font-size: 13px; }
    .footer a { color: #a78bfa; text-decoration: none; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #f4f4f5; padding: 10px 12px; text-align: left; font-size: 13px; color: #71717a; border-bottom: 1px solid #e4e4e7; }
    td { padding: 10px 12px; border-bottom: 1px solid #e4e4e7; font-size: 14px; }
    .total-row td { font-weight: 700; border-top: 2px solid #18181b; font-size: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${APP_NAME}</h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      <p><a href="${APP_URL}">${APP_URL}</a></p>
    </div>
  </div>
</body>
</html>`;
}

export const emailTemplates = {
  newLead(lead) {
    const content = `
      <h2>New Lead Received</h2>
      <p>A new lead has been submitted through the website.</p>
      <div class="info-box">
        <p><strong>Name:</strong> ${lead.name}</p>
        ${lead.email ? `<p><strong>Email:</strong> ${lead.email}</p>` : ''}
        ${lead.phone ? `<p><strong>Phone:</strong> ${lead.phone}</p>` : ''}
        ${lead.company ? `<p><strong>Company:</strong> ${lead.company}</p>` : ''}
        ${lead.service ? `<p><strong>Service Interested In:</strong> ${lead.service}</p>` : ''}
        ${lead.budget ? `<p><strong>Budget:</strong> ${lead.budget}</p>` : ''}
        ${lead.source ? `<p><strong>Source:</strong> ${lead.source}</p>` : ''}
      </div>
      ${lead.notes ? `<p><strong>Notes:</strong> ${lead.notes}</p>` : ''}
      <p>
        <a href="${APP_URL}/admin/leads" class="btn">View in Dashboard</a>
      </p>
    `;
    return emailWrapper(content);
  },

  newContact(contact) {
    const content = `
      <h2>New Contact Form Submission</h2>
      <p>A new message has been received from the contact form.</p>
      <div class="info-box">
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
        ${contact.company ? `<p><strong>Company:</strong> ${contact.company}</p>` : ''}
        ${contact.subject ? `<p><strong>Subject:</strong> ${contact.subject}</p>` : ''}
        ${contact.service ? `<p><strong>Service:</strong> ${contact.service}</p>` : ''}
      </div>
      <p><strong>Message:</strong></p>
      <p>${(contact.message || '').replace(/\n/g, '<br>')}</p>
      <p>
        <a href="mailto:${contact.email}" class="btn">Reply to ${contact.name}</a>
      </p>
    `;
    return emailWrapper(content);
  },

  invoiceEmail(invoice) {
    const items = invoice.items || [];
    const client = invoice.client || {};

    const itemRows = items
      .map(
        (item) => `
        <tr>
          <td>${item.description}</td>
          <td style="text-align:center">${item.quantity}</td>
          <td style="text-align:right">${formatCurrency(item.rate)}</td>
          <td style="text-align:right">${formatCurrency(item.amount)}</td>
        </tr>`
      )
      .join('');

    const content = `
      <h2>Invoice ${invoice.invoiceNumber}</h2>
      <p>Dear ${client.contactPerson || client.companyName || 'Client'},</p>
      <p>Please find your invoice details below.</p>

      <div class="info-box">
        <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
        ${client.companyName ? `<p><strong>Client:</strong> ${client.companyName}</p>` : ''}
        ${invoice.dueDate ? `<p><strong>Due Date:</strong> ${formatDate(invoice.dueDate)}</p>` : ''}
        <p><strong>Status:</strong> ${invoice.status}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align:center">Qty</th>
            <th style="text-align:right">Rate</th>
            <th style="text-align:right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
          <tr>
            <td colspan="3" style="text-align:right"><strong>Subtotal</strong></td>
            <td style="text-align:right">${formatCurrency(invoice.subtotal)}</td>
          </tr>
          ${
            invoice.discount > 0
              ? `<tr>
                  <td colspan="3" style="text-align:right"><strong>Discount</strong></td>
                  <td style="text-align:right">-${formatCurrency(invoice.discount)}</td>
                </tr>`
              : ''
          }
          ${
            invoice.taxAmount > 0
              ? `<tr>
                  <td colspan="3" style="text-align:right"><strong>Tax (${invoice.taxRate}%)</strong></td>
                  <td style="text-align:right">${formatCurrency(invoice.taxAmount)}</td>
                </tr>`
              : ''
          }
          <tr class="total-row">
            <td colspan="3" style="text-align:right">Total</td>
            <td style="text-align:right">${formatCurrency(invoice.total)}</td>
          </tr>
        </tbody>
      </table>

      ${invoice.notes ? `<p><strong>Notes:</strong> ${invoice.notes}</p>` : ''}
      ${invoice.terms ? `<p><strong>Terms:</strong> ${invoice.terms}</p>` : ''}
    `;
    return emailWrapper(content);
  },

  quotationEmail(quotation) {
    const items = quotation.items || [];
    const client = quotation.client || {};

    const itemRows = items
      .map(
        (item) => `
        <tr>
          <td>${item.description}</td>
          <td style="text-align:center">${item.quantity}</td>
          <td style="text-align:right">${formatCurrency(item.rate)}</td>
          <td style="text-align:right">${formatCurrency(item.amount)}</td>
        </tr>`
      )
      .join('');

    const content = `
      <h2>Quotation ${quotation.quotationNumber}</h2>
      <p>Dear ${client.contactPerson || client.companyName || 'Client'},</p>
      <p>Thank you for your interest. Please find our quotation below.</p>

      <div class="info-box">
        <p><strong>Quotation Number:</strong> ${quotation.quotationNumber}</p>
        ${client.companyName ? `<p><strong>Client:</strong> ${client.companyName}</p>` : ''}
        ${quotation.validUntil ? `<p><strong>Valid Until:</strong> ${formatDate(quotation.validUntil)}</p>` : ''}
        <p><strong>Status:</strong> ${quotation.status}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align:center">Qty</th>
            <th style="text-align:right">Rate</th>
            <th style="text-align:right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
          <tr>
            <td colspan="3" style="text-align:right"><strong>Subtotal</strong></td>
            <td style="text-align:right">${formatCurrency(quotation.subtotal)}</td>
          </tr>
          ${
            quotation.discount > 0
              ? `<tr>
                  <td colspan="3" style="text-align:right"><strong>Discount</strong></td>
                  <td style="text-align:right">-${formatCurrency(quotation.discount)}</td>
                </tr>`
              : ''
          }
          ${
            quotation.taxAmount > 0
              ? `<tr>
                  <td colspan="3" style="text-align:right"><strong>Tax (${quotation.taxRate}%)</strong></td>
                  <td style="text-align:right">${formatCurrency(quotation.taxAmount)}</td>
                </tr>`
              : ''
          }
          <tr class="total-row">
            <td colspan="3" style="text-align:right">Total</td>
            <td style="text-align:right">${formatCurrency(quotation.total)}</td>
          </tr>
        </tbody>
      </table>

      ${quotation.notes ? `<p><strong>Notes:</strong> ${quotation.notes}</p>` : ''}
      ${quotation.terms ? `<p><strong>Terms:</strong> ${quotation.terms}</p>` : ''}

      <p>
        <a href="mailto:${APP_URL}" class="btn">Accept Quotation</a>
      </p>
    `;
    return emailWrapper(content);
  },
};
