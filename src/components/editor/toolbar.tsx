"use client"

import { Button } from "@/components/ui/button"
import { ProjectNameEditor } from "@/components/editor/project-name-editor"
import {
  Square,
  Circle,
  Triangle,
  Type,
  Download,
  Save,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Group,
  Ungroup,
} from "lucide-react"

interface ToolbarProps {
  projectId: string
  projectName: string
  onProjectNameChange?: (newName: string) => void
  onAddRectangle: () => void
  onAddCircle: () => void
  onAddTriangle: () => void
  onAddText: () => void
  onDelete: () => void
  onSave: () => void
  onExport: () => void
  onGenerateWithAI?: () => void
  onGenerateImage?: () => void
  onOpenTemplates?: () => void
  onGroup?: () => void
  onUngroup?: () => void
}

export function Toolbar({
  projectId,
  projectName,
  onProjectNameChange,
  onAddRectangle,
  onAddCircle,
  onAddTriangle,
  onAddText,
  onDelete,
  onSave,
  onExport,
  onGenerateWithAI,
  onGenerateImage,
  onOpenTemplates,
  onGroup,
  onUngroup
}: ToolbarProps) {
  return (
    <div className="border-b bg-white px-4 py-2 flex items-center gap-2">
      <ProjectNameEditor
        initialName={projectName}
        projectId={projectId}
        onNameChange={onProjectNameChange}
      />

      <div className="border-l h-8 mx-2" />

      <Button variant="ghost" size="icon" onClick={onAddRectangle}>
        <Square className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onAddCircle}>
        <Circle className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onAddTriangle}>
        <Triangle className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onAddText}>
        <Type className="h-5 w-5" />
      </Button>

      <div className="border-l h-8 mx-2" />

      <Button variant="ghost" size="icon" onClick={onDelete}>
        <Trash2 className="h-5 w-5" />
      </Button>

      {onGenerateWithAI && (
        <>
          <div className="border-l h-8 mx-2" />
          <Button variant="outline" size="sm" onClick={onGenerateWithAI}>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate with AI
          </Button>
        </>
      )}

      {onGenerateImage && (
        <Button variant="outline" size="sm" onClick={onGenerateImage}>
          <ImageIcon className="h-4 w-4 mr-2" />
          AI Image
        </Button>
      )}

      <Button variant="outline" size="sm" onClick={onOpenTemplates}>
        <FileText className="h-4 w-4 mr-2" />
        Templates
      </Button>

      <div className="border-l h-8 mx-2" />

<Button 
  variant="outline" 
  size="sm" 
  onClick={onGroup}
  title="Group selected objects (Ctrl+G)"
>
  <Group className="h-4 w-4 mr-2" />
  Group
</Button>

<Button 
  variant="outline" 
  size="sm" 
  onClick={onUngroup}
  title="Ungroup (Ctrl+Shift+G)"
>
  <Ungroup className="h-4 w-4 mr-2" />
  Ungroup
</Button>

      <div className="ml-auto flex gap-2">
        <Button variant="outline" size="sm" onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="default" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  )
}
