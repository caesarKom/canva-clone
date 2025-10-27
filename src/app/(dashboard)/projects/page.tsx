import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProjectCard } from '@/components/projects/project-card'
import { prisma } from '@/lib/prisma'

export default async function ProjectsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Projects</h1>
          <Link href="/editor/new">
            <Button>Create New Project</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
