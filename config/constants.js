export const APP_NAME = 'AIOpsMedia';
export const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiopsmedia.com';
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '916203818011';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const EMAIL_FROM = process.env.EMAIL_FROM || 'AIOpsMedia <noreply@aiopsmedia.com>';

// ─── Roles ────────────────────────────────────────────
export const ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'MANAGER',
  'SALES',
  'FINANCE',
  'HR',
  'EDITOR',
  'EMPLOYEE',
  'VIEWER',
];

export const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  SALES: 'Sales',
  FINANCE: 'Finance',
  HR: 'HR',
  EDITOR: 'Editor',
  EMPLOYEE: 'Employee',
  VIEWER: 'Viewer',
};

// ─── Lead ─────────────────────────────────────────────
export const LEAD_STATUSES = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL',
  'NEGOTIATION',
  'WON',
  'LOST',
  'CLOSED',
];

export const LEAD_STATUS_LABELS = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  PROPOSAL: 'Proposal',
  NEGOTIATION: 'Negotiation',
  WON: 'Won',
  LOST: 'Lost',
  CLOSED: 'Closed',
};

export const LEAD_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export const LEAD_PRIORITY_LABELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export const LEAD_SOURCES = [
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
];

export const LEAD_SOURCE_LABELS = {
  ORGANIC_SEARCH: 'Organic Search',
  LINKEDIN: 'LinkedIn',
  COLD_EMAIL: 'Cold Email',
  WHATSAPP: 'WhatsApp',
  REFERRAL: 'Referral',
  INSTAGRAM: 'Instagram',
  FACEBOOK: 'Facebook',
  DIRECT: 'Direct',
  GOOGLE_BUSINESS: 'Google Business',
  OTHER: 'Other',
};

// ─── Projects ─────────────────────────────────────────
export const PROJECT_STATUSES = [
  'PLANNING',
  'IN_PROGRESS',
  'ON_HOLD',
  'REVIEW',
  'COMPLETED',
  'CANCELLED',
];

export const PROJECT_STATUS_LABELS = {
  PLANNING: 'Planning',
  IN_PROGRESS: 'In Progress',
  ON_HOLD: 'On Hold',
  REVIEW: 'Review',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const PROJECT_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

// ─── Tasks ────────────────────────────────────────────
export const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

export const TASK_STATUS_LABELS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  DONE: 'Done',
};

export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export const TASK_PRIORITY_LABELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

// ─── Payment ──────────────────────────────────────────
export const PAYMENT_STATUSES = ['PENDING', 'PARTIAL', 'PAID', 'REFUNDED', 'CANCELLED'];

export const PAYMENT_STATUS_LABELS = {
  PENDING: 'Pending',
  PARTIAL: 'Partial',
  PAID: 'Paid',
  REFUNDED: 'Refunded',
  CANCELLED: 'Cancelled',
};

// ─── Quotation ────────────────────────────────────────
export const QUOTATION_STATUSES = ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'];

export const QUOTATION_STATUS_LABELS = {
  DRAFT: 'Draft',
  SENT: 'Sent',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
};

// ─── Departments ──────────────────────────────────────
export const DEPARTMENTS = [
  'MANAGEMENT',
  'HR',
  'OPERATIONS',
  'DEVELOPMENT',
  'DESIGN',
  'MARKETING',
  'SALES',
  'AI_AUTOMATION',
  'FINANCE',
];

export const DEPARTMENT_LABELS = {
  MANAGEMENT: 'Management',
  HR: 'Human Resources',
  OPERATIONS: 'Operations',
  DEVELOPMENT: 'Development',
  DESIGN: 'Design',
  MARKETING: 'Marketing',
  SALES: 'Sales',
  AI_AUTOMATION: 'AI & Automation',
  FINANCE: 'Finance',
};

// ─── Employment ───────────────────────────────────────
export const EMPLOYMENT_STATUSES = [
  'ACTIVE',
  'INACTIVE',
  'ON_NOTICE',
  'TERMINATED',
  'RESIGNED',
];

export const EMPLOYMENT_STATUS_LABELS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  ON_NOTICE: 'On Notice',
  TERMINATED: 'Terminated',
  RESIGNED: 'Resigned',
};

export const ATTENDANCE_STATUSES = [
  'PRESENT',
  'ABSENT',
  'HALF_DAY',
  'LEAVE',
  'WORK_FROM_HOME',
];

export const ATTENDANCE_STATUS_LABELS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  HALF_DAY: 'Half Day',
  LEAVE: 'Leave',
  WORK_FROM_HOME: 'Work From Home',
};

// ─── Leave ────────────────────────────────────────────
export const LEAVE_TYPES = ['SICK', 'CASUAL', 'EARNED', 'UNPAID', 'MATERNITY', 'PATERNITY', 'OTHER'];

export const LEAVE_TYPE_LABELS = {
  SICK: 'Sick Leave',
  CASUAL: 'Casual Leave',
  EARNED: 'Earned Leave',
  UNPAID: 'Unpaid Leave',
  MATERNITY: 'Maternity Leave',
  PATERNITY: 'Paternity Leave',
  OTHER: 'Other',
};

export const LEAVE_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

export const LEAVE_STATUS_LABELS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
};

// ─── Expense ──────────────────────────────────────────
export const EXPENSE_CATEGORIES = [
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
];

export const EXPENSE_CATEGORY_LABELS = {
  SOFTWARE: 'Software',
  HARDWARE: 'Hardware',
  MARKETING: 'Marketing',
  SALARY: 'Salary',
  OFFICE: 'Office',
  TRAVEL: 'Travel',
  FOOD: 'Food & Beverages',
  CLOUD: 'Cloud Services',
  HOSTING: 'Hosting',
  SUBSCRIPTIONS: 'Subscriptions',
  TAXES: 'Taxes',
  OTHER: 'Other',
};

// ─── Documents ────────────────────────────────────────
export const DOCUMENT_TYPES = [
  'QUOTATION',
  'INVOICE',
  'BILL',
  'OFFER_LETTER',
  'PAYSLIP',
  'RECEIPT',
  'PROPOSAL',
  'OTHER',
];

export const DOCUMENT_TYPE_LABELS = {
  QUOTATION: 'Quotation',
  INVOICE: 'Invoice',
  BILL: 'Bill',
  OFFER_LETTER: 'Offer Letter',
  PAYSLIP: 'Payslip',
  RECEIPT: 'Receipt',
  PROPOSAL: 'Proposal',
  OTHER: 'Other',
};

// ─── Navigation ───────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Services', href: '/services', children: [
    { label: 'AI Development', href: '/services/ai-development' },
    { label: 'AI Agents', href: '/services/ai-agents' },
    { label: 'AI Automation', href: '/services/ai-automation' },
    { label: 'Custom Software', href: '/services/custom-software-development' },
    { label: 'CRM Development', href: '/services/crm-development' },
    { label: 'ERP Development', href: '/services/erp-development' },
    { label: 'Web & E-commerce', href: '/services/web-development' },
    { label: 'View All Services', href: '/services' },
  ]},
  { label: 'Solutions', href: '/services', children: [
    { label: 'Real Estate ERP', href: '/services/real-estate-erp' },
    { label: 'School ERP', href: '/services/school-erp' },
    { label: 'Business Automation', href: '/services/business-process-automation' },
    { label: 'E-commerce', href: '/services/ecommerce-development' },
    { label: 'SEO & Marketing', href: '/services/seo' },
  ]},
  { label: 'Industries', href: '/industries', children: [
    { label: 'Real Estate', href: '/industries/real-estate' },
    { label: 'Education', href: '/industries/education' },
    { label: 'Healthcare', href: '/industries/healthcare' },
    { label: 'E-commerce', href: '/industries/ecommerce' },
    { label: 'Hospitality', href: '/industries/hospitality' },
    { label: 'Professional Services', href: '/industries/professional-services' },
    { label: 'Startups', href: '/industries/startups' },
    { label: 'Small Business', href: '/industries/small-business' },
    { label: 'All Industries', href: '/industries' },
  ]},
  { label: 'Markets', href: '#markets', children: [
    { label: 'USA', href: '/usa' },
    { label: 'UK', href: '/uk' },
    { label: 'UAE', href: '/uae' },
    { label: 'Dubai', href: '/uae/dubai' },
  ]},
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Insights', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const ADMIN_NAV_LINKS = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: 'LayoutDashboard',
  },
  {
    label: 'CRM',
    children: [
      { label: 'Leads', href: '/admin/leads', icon: 'Users' },
      { label: 'Clients', href: '/admin/clients', icon: 'Building2' },
    ],
  },
  {
    label: 'Projects',
    children: [
      { label: 'All Projects', href: '/admin/projects', icon: 'FolderKanban' },
      { label: 'Tasks', href: '/admin/tasks', icon: 'CheckSquare' },
    ],
  },
  {
    label: 'Finance',
    children: [
      { label: 'Invoices', href: '/admin/invoices', icon: 'FileText' },
      { label: 'Quotations', href: '/admin/quotations', icon: 'FileSpreadsheet' },
      { label: 'Expenses', href: '/admin/expenses', icon: 'Receipt' },
    ],
  },
  {
    label: 'HR',
    children: [
      { label: 'Employees', href: '/admin/employees', icon: 'Users' },
      { label: 'Attendance', href: '/admin/attendance', icon: 'Calendar' },
      { label: 'Leaves', href: '/admin/leaves', icon: 'CalendarOff' },
    ],
  },
  {
    label: 'Content',
    children: [
      { label: 'Blog', href: '/admin/cms/blog', icon: 'PenLine' },
      { label: 'Services', href: '/admin/cms/services', icon: 'Layers' },
      { label: 'Products', href: '/admin/cms/products', icon: 'Package' },
      { label: 'Testimonials', href: '/admin/cms/testimonials', icon: 'Star' },
      { label: 'FAQs', href: '/admin/cms/faqs', icon: 'HelpCircle' },
    ],
  },
  {
    label: 'Settings',
    children: [
      { label: 'Site Settings', href: '/admin/cms/settings', icon: 'Settings' },
      { label: 'Media Library', href: '/admin/media', icon: 'Image' },
    ],
  },
];

export const STATUS_COLOR_MAP = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800',
  QUALIFIED: 'bg-purple-100 text-purple-800',
  PROPOSAL: 'bg-indigo-100 text-indigo-800',
  NEGOTIATION: 'bg-orange-100 text-orange-800',
  WON: 'bg-green-100 text-green-800',
  LOST: 'bg-red-100 text-red-800',
  CLOSED: 'bg-gray-100 text-gray-800',
  PLANNING: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  ON_HOLD: 'bg-orange-100 text-orange-800',
  REVIEW: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  TODO: 'bg-gray-100 text-gray-800',
  DONE: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  PARTIAL: 'bg-orange-100 text-orange-800',
  PAID: 'bg-green-100 text-green-800',
  REFUNDED: 'bg-blue-100 text-blue-800',
  DRAFT: 'bg-gray-100 text-gray-800',
  SENT: 'bg-blue-100 text-blue-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-orange-100 text-orange-800',
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  ON_NOTICE: 'bg-orange-100 text-orange-800',
  TERMINATED: 'bg-red-100 text-red-800',
  RESIGNED: 'bg-yellow-100 text-yellow-800',
  PRESENT: 'bg-green-100 text-green-800',
  ABSENT: 'bg-red-100 text-red-800',
  HALF_DAY: 'bg-yellow-100 text-yellow-800',
  LEAVE: 'bg-blue-100 text-blue-800',
  WORK_FROM_HOME: 'bg-purple-100 text-purple-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED_LEAVE: 'bg-red-100 text-red-800',
  CANCELLED_LEAVE: 'bg-gray-100 text-gray-800',
};
