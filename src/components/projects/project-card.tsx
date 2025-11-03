'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Trash2, Copy } from 'lucide-react'

interface ProjectCardProps {
  project: {
    id: string
    name: string
    thumbnail: string | null
    updatedAt: string
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/project/${project.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Failed to delete project')

      toast.success('Project deleted successfully')
      setShowDeleteDialog(false)
      router.refresh()
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDuplicate = async () => {
      const duplicateToast = toast.loading('Duplicating project...')
    try {
      
      const res = await fetch(`/api/project/${project.id}/duplicate`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Failed to duplicate project')

      const newProject = await res.json()
      toast.success('Project duplicated successfully', { id: duplicateToast })
      router.push(`/editor/${newProject.id}`)
    } catch (error) {
      console.error('Error duplicating project:', error)
      toast.error('Failed to duplicate project', { id: duplicateToast })
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow group">
        <Link href={`/editor/${project.id}`}>
          <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
            {project.thumbnail ? (
              <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.thumbnail}
                alt={project.name}
                className="w-full h-full object-fill"
              />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100" />
            )}
          </div>
        </Link>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <Link href={`/editor/${project.id}`} className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{project.name}</h3>
              <p className="text-sm text-gray-500" suppressHydrationWarning>
                {new Date(project.updatedAt).toLocaleDateString()}
              </p>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              {`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
