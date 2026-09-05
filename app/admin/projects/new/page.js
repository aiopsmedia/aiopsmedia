import Link from 'next/link';
import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import ProjectForm from '@/components/admin/project-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'New Project - AIOpsMedia Admin',
};

export default async function NewProjectPage() {
  await requireAuth();

  const [clients, managers] = await Promise.all([
    db.client.findMany({
      select: { id: true, companyName: true },
      orderBy: { companyName: 'asc' },
    }),
    db.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
          <Link href="/admin/projects">
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Create Project</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">Set up a new client project.</p>
      </div>

      <ProjectForm clients={clients} managers={managers} />
    </div>
  );
}