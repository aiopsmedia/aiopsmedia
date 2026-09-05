'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export async function getDashboardData() {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      revenueAgg,
      expenseAgg,
      pendingRevenue,
      leadCount,
      wonLeads,
      qualifiedLeads,
      projectGroup,
      activeProjects,
      completedProjects,
    ] = await Promise.all([
      db.revenue.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ['PAID', 'PARTIAL'] } },
      }),
      db.expense.aggregate({
        _sum: { amount: true },
        where: { date: { gte: startOfYear, lte: now } },
      }),
      db.revenue.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'PENDING' },
      }),
      db.lead.count(),
      db.lead.count({ where: { status: 'WON' } }),
      db.lead.count({ where: { status: { in: ['QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON'] } } }),
      db.project.groupBy({ by: ['status'], _count: { _all: true } }),
      db.project.count({ where: { status: { in: ['IN_PROGRESS', 'REVIEW'] } } }),
      db.project.count({ where: { status: 'COMPLETED' } }),
    ]);

    const totalRevenue = Number(revenueAgg._sum.totalAmount || 0);
    const totalExpenses = Number(expenseAgg._sum.amount || 0);
    const outstanding = Number(pendingRevenue._sum.totalAmount || 0);
    const totalProjects = projectGroup.reduce((sum, g) => sum + g._count._all, 0);

    return {
      totalRevenue,
      totalExpenses,
      profit: totalRevenue - totalExpenses,
      outstanding,
      leadCount,
      wonLeads,
      qualifiedLeads,
      conversionRate: leadCount > 0 ? Math.round((wonLeads / leadCount) * 1000) / 10 : 0,
      totalProjects,
      activeProjects,
      completedProjects,
    };
  } catch {
    return {
      totalRevenue: 0,
      totalExpenses: 0,
      profit: 0,
      outstanding: 0,
      leadCount: 0,
      wonLeads: 0,
      qualifiedLeads: 0,
      conversionRate: 0,
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
    };
  }
}

export async function getRevenueExpenseSeries() {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const [revenues, expenses] = await Promise.all([
      db.revenue.findMany({
        where: { status: { in: ['PAID', 'PARTIAL'] }, createdAt: { gte: yearStart } },
        select: { totalAmount: true, createdAt: true },
      }),
      db.expense.findMany({
        where: { date: { gte: yearStart } },
        select: { amount: true, date: true },
      }),
    ]);

    const revenueMap = {};
    const expenseMap = {};

    revenues.forEach((r) => {
      const key = new Date(r.createdAt).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      revenueMap[key] = (revenueMap[key] || 0) + Number(r.totalAmount);
    });

    expenses.forEach((e) => {
      const key = new Date(e.date).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      expenseMap[key] = (expenseMap[key] || 0) + Number(e.amount);
    });

    const monthLabels = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthLabels.push(d.toLocaleString('en-IN', { month: 'short', year: '2-digit' }));
    }

    return monthLabels.map((m) => ({
      month: m,
      revenue: revenueMap[m] || 0,
      expenses: expenseMap[m] || 0,
    }));
  } catch {
    return [];
  }
}

export async function getLeadFunnel() {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const groups = await db.lead.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    const statusOrder = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON'];
    const labels = {
      NEW: 'New',
      CONTACTED: 'Contacted',
      QUALIFIED: 'Qualified',
      PROPOSAL: 'Proposal',
      NEGOTIATION: 'Negotiation',
      WON: 'Won',
    };

    const map = {};
    groups.forEach((g) => { map[g.status] = g._count._all; });

    return statusOrder.map((s) => ({
      name: labels[s],
      status: s,
      count: map[s] || 0,
    }));
  } catch {
    return [];
  }
}
