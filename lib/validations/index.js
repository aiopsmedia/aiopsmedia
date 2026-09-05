import { z } from 'zod';

// ─── Login ────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// ─── Lead ─────────────────────────────────────────────
export const leadSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(20, 'Phone must be at most 20 characters')
    .optional()
    .or(z.literal('')),
  whatsapp: z
    .string()
    .max(20, 'WhatsApp must be at most 20 characters')
    .optional()
    .or(z.literal('')),
  company: z
    .string()
    .max(150, 'Company must be at most 150 characters')
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  industry: z
    .string()
    .max(100, 'Industry must be at most 100 characters')
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .max(200, 'Location must be at most 200 characters')
    .optional()
    .or(z.literal('')),
  service: z
    .string()
    .max(200, 'Service must be at most 200 characters')
    .optional()
    .or(z.literal('')),
  source: z.enum([
    'ORGANIC_SEARCH',
    'LINKEDIN',
    'COLD_EMAIL',
    'WHATSAPP',
    'REFERRAL',
    'INSTAGRAM',
    'FACEBOOK',
    'DIRECT',
    'GOOGLE_BUSINESS',
    'OTHER',
  ]).optional().default('OTHER'),
  budget: z
    .string()
    .max(50, 'Budget must be at most 50 characters')
    .optional()
    .or(z.literal('')),
  status: z.enum([
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'PROPOSAL',
    'NEGOTIATION',
    'WON',
    'LOST',
    'CLOSED',
  ]).optional().default('NEW'),
  priority: z.enum([
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT',
  ]).optional().default('MEDIUM'),
  notes: z
    .string()
    .max(2000, 'Notes must be at most 2000 characters')
    .optional()
    .or(z.literal('')),
  followUpDate: z
    .string()
    .optional()
    .or(z.literal('')),
  assignedToId: z
    .string()
    .optional()
    .or(z.literal('')),
});

// ─── Client ───────────────────────────────────────────
export const clientSchema = z.object({
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .max(200, 'Company name must be at most 200 characters'),
  contactPerson: z
    .string()
    .max(100, 'Contact person must be at most 100 characters')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(20, 'Phone must be at most 20 characters')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(500, 'Address must be at most 500 characters')
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  industry: z
    .string()
    .max(100, 'Industry must be at most 100 characters')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .max(2000, 'Notes must be at most 2000 characters')
    .optional()
    .or(z.literal('')),
  leadId: z.string().optional().or(z.literal('')),
});

// ─── Project ──────────────────────────────────────────
export const projectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(200, 'Project name must be at most 200 characters'),
  slug: z
    .string()
    .max(200, 'Slug must be at most 200 characters')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(5000, 'Description must be at most 5000 characters')
    .optional()
    .or(z.literal('')),
  clientId: z.string().optional().or(z.literal('')),
  managerId: z.string().optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  deadline: z.string().optional().or(z.literal('')),
  status: z.enum([
    'PLANNING',
    'IN_PROGRESS',
    'ON_HOLD',
    'REVIEW',
    'COMPLETED',
    'CANCELLED',
  ]).optional().default('PLANNING'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional().default('MEDIUM'),
  budget: z.coerce.number().min(0, 'Budget must be a positive number').optional(),
  revenue: z.coerce.number().min(0, 'Revenue must be a positive number').optional(),
  paymentStatus: z.enum(['PENDING', 'PARTIAL', 'PAID', 'REFUNDED', 'CANCELLED']).optional().default('PENDING'),
  progress: z.coerce.number().min(0).max(100).optional().default(0),
});

// ─── Task ─────────────────────────────────────────────
export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(300, 'Title must be at most 300 characters'),
  description: z
    .string()
    .max(5000, 'Description must be at most 5000 characters')
    .optional()
    .or(z.literal('')),
  projectId: z.string().min(1, 'Project is required'),
  assigneeId: z.string().optional().or(z.literal('')),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional().default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional().default('MEDIUM'),
  dueDate: z.string().optional().or(z.literal('')),
  estimatedHours: z.coerce.number().min(0).optional(),
  actualHours: z.coerce.number().min(0).optional(),
  order: z.coerce.number().min(0).optional().default(0),
});

// ─── Employee ─────────────────────────────────────────
export const employeeSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .max(20, 'Phone must be at most 20 characters')
    .optional()
    .or(z.literal('')),
  designation: z
    .string()
    .max(100, 'Designation must be at most 100 characters')
    .optional()
    .or(z.literal('')),
  department: z.enum([
    'MANAGEMENT',
    'HR',
    'OPERATIONS',
    'DEVELOPMENT',
    'DESIGN',
    'MARKETING',
    'SALES',
    'AI_AUTOMATION',
    'FINANCE',
  ]).optional().default('OPERATIONS'),
  joiningDate: z.string().optional().or(z.literal('')),
  salary: z.coerce.number().min(0, 'Salary must be a positive number').optional(),
  employmentStatus: z.enum([
    'ACTIVE',
    'INACTIVE',
    'ON_NOTICE',
    'TERMINATED',
    'RESIGNED',
  ]).optional().default('ACTIVE'),
  address: z
    .string()
    .max(500, 'Address must be at most 500 characters')
    .optional()
    .or(z.literal('')),
  emergencyContact: z
    .string()
    .max(200, 'Emergency contact must be at most 200 characters')
    .optional()
    .or(z.literal('')),
  skills: z
    .string()
    .max(1000, 'Skills must be at most 1000 characters')
    .optional()
    .or(z.literal('')),
  userId: z.string().optional().or(z.literal('')),
});

// ─── Invoice Item ─────────────────────────────────────
const invoiceItemSchema = z.object({
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be at most 500 characters'),
  quantity: z.coerce.number().min(0.01, 'Quantity must be greater than 0').default(1),
  rate: z.coerce.number().min(0, 'Rate must be a positive number'),
  amount: z.coerce.number().min(0, 'Amount must be a positive number').optional(),
});

// ─── Invoice ──────────────────────────────────────────
export const invoiceSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  projectId: z.string().optional().or(z.literal('')),
  invoiceNumber: z
    .string()
    .min(1, 'Invoice number is required')
    .max(50, 'Invoice number must be at most 50 characters'),
  subtotal: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).optional().default(0),
  taxRate: z.coerce.number().min(0).max(100).optional().default(18),
  taxAmount: z.coerce.number().min(0).optional().default(0),
  total: z.coerce.number().min(0),
  status: z.enum(['PENDING', 'PARTIAL', 'PAID', 'REFUNDED', 'CANCELLED']).optional().default('PENDING'),
  dueDate: z.string().optional().or(z.literal('')),
  notes: z
    .string()
    .max(2000, 'Notes must be at most 2000 characters')
    .optional()
    .or(z.literal('')),
  terms: z
    .string()
    .max(2000, 'Terms must be at most 2000 characters')
    .optional()
    .or(z.literal('')),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
});

// ─── Quotation Item ───────────────────────────────────
const quotationItemSchema = z.object({
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be at most 500 characters'),
  quantity: z.coerce.number().min(0.01, 'Quantity must be greater than 0').default(1),
  rate: z.coerce.number().min(0, 'Rate must be a positive number'),
  amount: z.coerce.number().min(0, 'Amount must be a positive number').optional(),
});

// ─── Quotation ────────────────────────────────────────
export const quotationSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  projectId: z.string().optional().or(z.literal('')),
  quotationNumber: z
    .string()
    .min(1, 'Quotation number is required')
    .max(50, 'Quotation number must be at most 50 characters'),
  subtotal: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).optional().default(0),
  taxRate: z.coerce.number().min(0).max(100).optional().default(18),
  taxAmount: z.coerce.number().min(0).optional().default(0),
  total: z.coerce.number().min(0),
  status: z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED']).optional().default('DRAFT'),
  validUntil: z.string().optional().or(z.literal('')),
  notes: z
    .string()
    .max(2000, 'Notes must be at most 2000 characters')
    .optional()
    .or(z.literal('')),
  terms: z
    .string()
    .max(2000, 'Terms must be at most 2000 characters')
    .optional()
    .or(z.literal('')),
  items: z.array(quotationItemSchema).min(1, 'At least one item is required'),
});

// ─── Expense ──────────────────────────────────────────
export const expenseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  category: z.enum([
    'SOFTWARE',
    'HARDWARE',
    'MARKETING',
    'SALARY',
    'OFFICE',
    'TRAVEL',
    'FOOD',
    'CLOUD',
    'HOSTING',
    'SUBSCRIPTIONS',
    'TAXES',
    'OTHER',
  ]).optional().default('OTHER'),
  projectId: z.string().optional().or(z.literal('')),
  employeeId: z.string().optional().or(z.literal('')),
  date: z.string().optional().or(z.literal('')),
  paymentMethod: z
    .string()
    .max(50, 'Payment method must be at most 50 characters')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .max(2000, 'Notes must be at most 2000 characters')
    .optional()
    .or(z.literal('')),
});

// ─── Blog ─────────────────────────────────────────────
export const blogSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(300, 'Title must be at most 300 characters'),
  slug: z
    .string()
    .max(300, 'Slug must be at most 300 characters')
    .optional()
    .or(z.literal('')),
  excerpt: z
    .string()
    .max(500, 'Excerpt must be at most 500 characters')
    .optional()
    .or(z.literal('')),
  content: z
    .string()
    .max(100000, 'Content is too long')
    .optional()
    .or(z.literal('')),
  coverImage: z.string().optional().or(z.literal('')),
  authorId: z.string().optional().or(z.literal('')),
  categoryId: z.string().optional().or(z.literal('')),
  serviceId: z.string().optional().or(z.literal('')),
  tags: z
    .string()
    .max(1000, 'Tags must be at most 1000 characters')
    .optional()
    .or(z.literal('')),
  seoTitle: z
    .string()
    .max(200, 'SEO title must be at most 200 characters')
    .optional()
    .or(z.literal('')),
  metaDescription: z
    .string()
    .max(300, 'Meta description must be at most 300 characters')
    .optional()
    .or(z.literal('')),
  focusKeyword: z
    .string()
    .max(200, 'Focus keyword must be at most 200 characters')
    .optional()
    .or(z.literal('')),
  canonicalUrl: z.string().optional().or(z.literal('')),
  ogTitle: z
    .string()
    .max(200, 'OG title must be at most 200 characters')
    .optional()
    .or(z.literal('')),
  ogDescription: z
    .string()
    .max(300, 'OG description must be at most 300 characters')
    .optional()
    .or(z.literal('')),
  ogImage: z.string().optional().or(z.literal('')),
  isPublished: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  publishedAt: z.string().optional().or(z.literal('')),
  scheduledAt: z.string().optional().or(z.literal('')),
});

// ─── Service ──────────────────────────────────────────
export const serviceSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  slug: z
    .string()
    .max(200, 'Slug must be at most 200 characters')
    .optional()
    .or(z.literal('')),
  icon: z
    .string()
    .max(100, 'Icon must be at most 100 characters')
    .optional()
    .or(z.literal('')),
  image: z.string().optional().or(z.literal('')),
  description: z
    .string()
    .max(2000, 'Description must be at most 2000 characters')
    .optional()
    .or(z.literal('')),
  longDescription: z
    .string()
    .max(50000, 'Long description is too long')
    .optional()
    .or(z.literal('')),
  features: z
    .string()
    .max(10000, 'Features is too long')
    .optional()
    .or(z.literal('')),
  benefits: z
    .string()
    .max(5000, 'Benefits must be at most 5000 characters')
    .optional()
    .or(z.literal('')),
  process: z
    .string()
    .max(5000, 'Process must be at most 5000 characters')
    .optional()
    .or(z.literal('')),
  pricing: z
    .string()
    .max(2000, 'Pricing must be at most 2000 characters')
    .optional()
    .or(z.literal('')),
  ctaText: z
    .string()
    .max(100, 'CTA text must be at most 100 characters')
    .optional()
    .or(z.literal(''))
    .default('Get a Free Consultation'),
  ctaLink: z.string().optional().or(z.literal('')),
  isActive: z.boolean().optional().default(true),
  order: z.coerce.number().min(0).optional().default(0),
  seoTitle: z
    .string()
    .max(200, 'SEO title must be at most 200 characters')
    .optional()
    .or(z.literal('')),
  seoDescription: z
    .string()
    .max(300, 'SEO description must be at most 300 characters')
    .optional()
    .or(z.literal('')),
  seoKeywords: z
    .string()
    .max(500, 'SEO keywords must be at most 500 characters')
    .optional()
    .or(z.literal('')),
});

// ─── Product ──────────────────────────────────────────
export const productSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  slug: z
    .string()
    .max(200, 'Slug must be at most 200 characters')
    .optional()
    .or(z.literal('')),
  serviceId: z.string().optional().or(z.literal('')),
  shortDescription: z
    .string()
    .max(500, 'Short description must be at most 500 characters')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(50000, 'Description is too long')
    .optional()
    .or(z.literal('')),
  price: z.coerce.number().min(0).optional(),
  originalPrice: z.coerce.number().min(0).optional(),
  discount: z.coerce.number().min(0).max(100).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewCount: z.coerce.number().min(0).optional().default(0),
  image: z.string().optional().or(z.literal('')),
  images: z.string().max(10000).optional().or(z.literal('')),
  screenshots: z.string().max(10000).optional().or(z.literal('')),
  videos: z.string().max(5000).optional().or(z.literal('')),
  features: z.string().max(10000).optional().or(z.literal('')),
  specifications: z.string().max(10000).optional().or(z.literal('')),
  category: z
    .string()
    .max(100, 'Category must be at most 100 characters')
    .optional()
    .or(z.literal('')),
  ctaText: z
    .string()
    .max(100, 'CTA text must be at most 100 characters')
    .optional()
    .or(z.literal(''))
    .default('Request Demo'),
  ctaLink: z.string().optional().or(z.literal('')),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  order: z.coerce.number().min(0).optional().default(0),
  seoTitle: z
    .string()
    .max(200, 'SEO title must be at most 200 characters')
    .optional()
    .or(z.literal('')),
  seoDescription: z
    .string()
    .max(300, 'SEO description must be at most 300 characters')
    .optional()
    .or(z.literal('')),
  seoKeywords: z
    .string()
    .max(500, 'SEO keywords must be at most 500 characters')
    .optional()
    .or(z.literal('')),
});

// ─── Contact Form ─────────────────────────────────────
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .max(20, 'Phone must be at most 20 characters')
    .optional()
    .or(z.literal('')),
  company: z
    .string()
    .max(150, 'Company must be at most 150 characters')
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(300, 'Subject must be at most 300 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be at most 5000 characters'),
  service: z
    .string()
    .max(200, 'Service must be at most 200 characters')
    .optional()
    .or(z.literal('')),
});

// ─── Site Setting ─────────────────────────────────────
export const siteSettingSchema = z.object({
  key: z
    .string()
    .min(1, 'Key is required')
    .max(100, 'Key must be at most 100 characters'),
  value: z.string().optional().or(z.literal('')),
  group: z
    .string()
    .max(50, 'Group must be at most 50 characters')
    .optional()
    .or(z.literal('')),
  type: z.enum(['text', 'json', 'image', 'boolean']).optional().default('text'),
});

// ─── Testimonial ──────────────────────────────────────
export const testimonialSchema = z.object({
  clientName: z
    .string()
    .min(1, 'Client name is required')
    .max(100, 'Client name must be at most 100 characters'),
  company: z
    .string()
    .max(150, 'Company must be at most 150 characters')
    .optional()
    .or(z.literal('')),
  designation: z
    .string()
    .max(100, 'Designation must be at most 100 characters')
    .optional()
    .or(z.literal('')),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .max(2000, 'Content must be at most 2000 characters'),
  rating: z.coerce.number().min(1).max(5).optional(),
  image: z.string().optional().or(z.literal('')),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  isDemo: z.boolean().optional().default(false),
  order: z.coerce.number().min(0).optional().default(0),
});

// ─── FAQ ──────────────────────────────────────────────
export const faqSchema = z.object({
  question: z
    .string()
    .min(1, 'Question is required')
    .max(500, 'Question must be at most 500 characters'),
  answer: z
    .string()
    .min(1, 'Answer is required')
    .max(5000, 'Answer must be at most 5000 characters'),
  category: z
    .string()
    .max(100, 'Category must be at most 100 characters')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean().optional().default(true),
  order: z.coerce.number().min(0).optional().default(0),
});

// ─── Password Change ──────────────────────────────────
export const passwordChangeSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .max(100, 'New password must be at most 100 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ─── Attendance ───────────────────────────────────────
export const attendanceSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE', 'WORK_FROM_HOME']).default('PRESENT'),
  checkIn: z.string().optional().or(z.literal('')),
  checkOut: z.string().optional().or(z.literal('')),
  notes: z
    .string()
    .max(500, 'Notes must be at most 500 characters')
    .optional()
    .or(z.literal('')),
});

// ─── Leave ────────────────────────────────────────────
export const leaveSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  type: z.enum(['SICK', 'CASUAL', 'EARNED', 'UNPAID', 'MATERNITY', 'PATERNITY', 'OTHER']).default('CASUAL'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  days: z.coerce.number().min(1, 'At least 1 day is required'),
  reason: z
    .string()
    .max(1000, 'Reason must be at most 1000 characters')
    .optional()
    .or(z.literal('')),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// ─── User ─────────────────────────────────────────────
export const userSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  role: z.enum([
    'SUPER_ADMIN',
    'ADMIN',
    'MANAGER',
    'SALES',
    'FINANCE',
    'HR',
    'EDITOR',
    'EMPLOYEE',
    'VIEWER',
  ]).default('EMPLOYEE'),
  isActive: z.boolean().optional().default(true),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be at most 100 characters')
    .optional(),
});
