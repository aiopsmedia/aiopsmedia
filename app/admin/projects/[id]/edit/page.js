import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import ProjectForm from '@/components/admin/project-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Edit Project - AIOpsMedia Admin',
};

export default async function EditProjectPage({ params }) {
  await requireAuth();
  const { id } = await params;

  const [project, clients, managers] = await Promise.all([
    db.project.findUnique({
      where: { id },
      include: {
        client: { select: { companyName: true } },
        manager: { select: { name: true } },
      },
    }),
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

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
          <Link href={`/admin/projects/${id}`}>
            <ArrowLeft className="h-4 w-4" /> Back to Project
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Edit Project</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">Update project details for {project.name}.</p>
      </div>

      <ProjectForm project={project} clients={clients} managers={managers} />
    </div>
  );
}