import { cache } from 'react';
import { db } from '@/lib/db';

const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  ADMIN: [
    'lead.*',
    'client.*',
    'project.*',
    'task.*',
    'employee.*',
    'finance.*',
    'invoice.*',
    'quotation.*',
    'cms.*',
    'media.*',
    'analytics.*',
    'notification.*',
    'settings.*',
  ],
  MANAGER: [
    'lead.read',
    'lead.update',
    'client.read',
    'project.*',
    'task.*',
    'employee.read',
    'finance.read',
  ],
  SALES: ['lead.*', 'client.*', 'quotation.*', 'project.read'],
  FINANCE: ['finance.*', 'invoice.*', 'expense.*', 'budget.*', 'revenue.*'],
  HR: ['employee.*', 'attendance.*', 'leave.*', 'salary.*'],
  EDITOR: ['cms.*', 'blog.*', 'media.*', 'faq.*', 'testimonial.*'],
  EMPLOYEE: ['task.read', 'task.update'],
  VIEWER: ['*.read'],
};

export const hasPermission = cache(async (userId, resource, action) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;

  const rolePerms = ROLE_PERMISSIONS[user.role] || [];

  if (rolePerms.includes('*') || rolePerms.includes(`${resource}.*`))
    return true;
  if (rolePerms.includes(`${resource}.${action}`)) return true;

  const dbPerm = await db.userPermission.findFirst({
    where: {
      userId,
      permission: { resource, action },
    },
  });

  return !!dbPerm;
});

export function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || [];
}
