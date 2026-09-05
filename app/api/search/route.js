import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ leads: [], projects: [], employees: [], clients: [], services: [], blog: [] });
    }

    const limit = 8;

    const [leads, projects, employees, clients, services, blog] = await Promise.all([
      db.lead.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { company: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
            { phone: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, email: true, company: true },
        orderBy: { updatedAt: 'desc' },
        take: limit,
      }),
      db.project.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, client: { select: { companyName: true } } },
        orderBy: { updatedAt: 'desc' },
        take: limit,
      }),
      db.employee.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
            { designation: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, email: true, designation: true },
        orderBy: { updatedAt: 'desc' },
        take: limit,
      }),
      db.client.findMany({
        where: {
          OR: [
            { companyName: { contains: q, mode: 'insensitive' } },
            { contactPerson: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, companyName: true, email: true },
        orderBy: { updatedAt: 'desc' },
        take: limit,
      }),
      db.service.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true },
        orderBy: { updatedAt: 'desc' },
        take: limit,
      }),
      db.blog.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { excerpt: { contains: q, mode: 'insensitive' } },
            { tags: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true },
        orderBy: { updatedAt: 'desc' },
        take: limit,
      }),
    ]);

    return NextResponse.json({ leads, projects, employees, clients, services, blog });
  } catch {
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}