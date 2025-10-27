'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Check, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProjectNameEditorProps {
  initialName: string
  projectId: string
  onNameChange?: (newName: string) => void
}

export function ProjectNameEditor({ initialName, projectId, onNameChange }: ProjectNameEditorProps) {
  const [name, setName] = useState(initialName)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setName(initialName)
  }, [initialName])

  const handleSave = async () => {
    if (!name.trim() || name === initialName) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch(`/api/project/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: name.trim() }),
      })

      if (res.ok) {
        onNameChange?.(name.trim())
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Failed to update project name:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setName(initialName)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
          className="h-8 w-64"
          disabled={isSaving}
        />
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 transition-colors group"
    >
      <span className="font-semibold line-clamp-1">{name}</span>
      <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}
