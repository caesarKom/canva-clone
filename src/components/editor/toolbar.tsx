"use client"

import { Button } from "@/components/ui/button"
import { ProjectNameEditor } from "@/components/editor/project-name-editor"
import {
  Download,
  Save,
  Sparkles,
  Image as ImageIcon,
  Undo2,
  Redo2,
} from "lucide-react"
import { useEditorStore } from "@/stores/editor-store"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

interface ToolbarProps {
  projectId: string
  projectName: string
  onProjectNameChange?: (newName: string) => void
  onSave: () => void
  onExport: () => void
  onGenerateWithAI?: () => void
  onGenerateImage?: () => void
}

export function Toolbar({
  projectId,
  projectName,
  onProjectNameChange,
  onSave,
  onExport,
  onGenerateWithAI,
  onGenerateImage,
}: ToolbarProps) {
  const { undo, redo, canUndo, canRedo, autoSaveTime, setAutoSaveTime } = useEditorStore()

  return (
    <div className="border-b bg-white px-4 py-2 flex items-center gap-2">
      <ProjectNameEditor
        initialName={projectName}
        projectId={projectId}
        onNameChange={onProjectNameChange}
      />
      <div className="border-l h-8 mx-2" />
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={!canUndo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={!canRedo()}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>

      {onGenerateWithAI && (
        <>
          <div className="border-l h-8 mx-2" />
          <Button variant="outline" size="sm" onClick={onGenerateWithAI} className="bg-linear-to-r from-blue-300 to-blue-500 text-white">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate with AI
          </Button>
        </>
      )}

      {onGenerateImage && (
        <Button variant="outline" size="sm" onClick={onGenerateImage} className="bg-linear-to-r from-yellow-300 to-yellow-500 text-white">
          <ImageIcon className="h-4 w-4 mr-2" />
          AI Image
        </Button>
      )}

      <div className="border-l h-8 mx-2" />

      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Auto Save</span>
        <Select
          value={autoSaveTime}
          onValueChange={(v) => setAutoSaveTime(v as any)}
        >
          <SelectTrigger className="w-25">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="OFF">Off</SelectItem>
            <SelectItem value="1">1 min.</SelectItem>
            <SelectItem value="2">2 min.</SelectItem>
            <SelectItem value="3">3 min.</SelectItem>
            <SelectItem value="5">5 min.</SelectItem>
            <SelectItem value="10">10 min.</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
