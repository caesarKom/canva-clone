"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Canvas, FabricImage, FabricObject } from "fabric"
import { CanvasEditor } from "@/components/editor/canvas"
import { Toolbar } from "@/components/editor/toolbar"
import { SidebarApp } from "@/components/editor/sidebar"
import { PropertiesPanel } from "@/components/editor/properties-panel"
import {
  addRectangle,
  addCircle,
  addTriangle,
  addText,
  addImageFromFile,
  deleteObject,
  exportToJSON,
  exportToPNG,
  loadFromJSON,
  groupObjects,
  ungroupObjects,
} from "@/lib/fabric-utils"
import { toast } from "sonner"
import { AIGenerateDialog } from "@/components/editor/ai-generate-dialog"
import { templateData, TemplateId, templateList } from "@/lib/templates"
import { ExportDialog } from "@/components/editor/export-dialog"
import { ObjectAnimation } from "@/types/animation"
import { Loading } from "@/components/loading"

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const canvasRef = useRef<Canvas | null>(null)
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(
    null
  )
  const [project, setProject] = useState<any>(null)

  const [showAIDesignDialog, setShowAIDesignDialog] = useState(false)
  const [showAIImageDialog, setShowAIImageDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [animations, setAnimations] = useState<ObjectAnimation[]>([])
  // ✅ Use ref to prevent double calling
  const isCreatingProject = useRef(false)
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (project?.animations) {
      try {
        const parsed = JSON.parse(project.animations)
        setAnimations(parsed)
      } catch (error) {
        console.error("Failed to parse animations:", error)
      }
    }
  }, [project])

  const createNewProject = useCallback(
    async (templateId?: TemplateId | null) => {
      if (isCreatingProject.current) return
      isCreatingProject.current = true
      
      const template = templateList.find(t => t.id === templateId)
    const width = template?.width || 800
    const height = template?.height || 600

      try {
        // ✅ Get data if exists
        const templateCanvasData =
          templateId && templateData[templateId]
            ? JSON.stringify(templateData[templateId])
            : undefined

        const res = await fetch("/api/project", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: templateId ? `${templateId} - Copy` : "Untitled Project",
            canvasData: templateCanvasData, // ✅ Save data template
            width,
            height,
          }),
        })

        if (!res.ok) throw new Error("Failed to create project")

        const data = await res.json()
        setProject(data)

        // ✅ load template for canvas if exists
        if (templateCanvasData && canvasRef.current) {
          setTimeout(() => {
            if (canvasRef.current) {
              loadFromJSON(canvasRef.current, templateCanvasData)
            }
          }, 500)
        }

        router.replace(`/editor/${data.id}`)

        if (templateId) {
          toast.success(`Template "${templateId}" loaded successfully!`)
        }
      } catch (error) {
        console.error("Error creating project:", error)
        toast.error("Failed to create project")
        isCreatingProject.current = false
      }
    },
    [router]
  )

  const loadProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/project/${params.projectId}`, {
        credentials: "include",
      })

      if (!res.ok) throw new Error("Failed to load project")

      const data = await res.json()
      setProject({ ...data, width: data.width, height: data.height })
    } catch (error) {
      console.error("Error loading project:", error)
      toast.error("Failed to load project")
    }
  }, [params.projectId])

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    if (params.projectId === "new") {
      // ✅ Verify is in URL
      const templateId = searchParams.get("template") as TemplateId | null

      createNewProject(templateId)
    } else {
      loadProject()
    }
  }, [createNewProject, loadProject, params.projectId, searchParams])

  const handleSave = useCallback(
    async (canvasData: string) => {
      if (!project) return

      const thumbnail = canvasRef.current
        ? exportToPNG(canvasRef.current)
        : null

      try {
        await fetch(`/api/project/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            canvasData,
            thumbnail,
            animations: JSON.stringify(animations),
            width: project?.width,
            height: project?.height,
          }),
        })
        toast.success("Project Saved")
      } catch (error) {
        console.error("Error saving project:", error)
        toast.error("Error saving project")
      }
    },
    [animations, project]
  )

  const handleExport = useCallback(() => {
    setShowExportDialog(true)
  }, [])

  const handleAddShape = useCallback((type: "rect" | "circle" | "triangle") => {
    if (!canvasRef.current) return

    if (type === "rect") addRectangle(canvasRef.current)
    else if (type === "circle") addCircle(canvasRef.current)
    else if (type === "triangle") addTriangle(canvasRef.current)
  }, [])

  const handleAddText = useCallback(() => {
    if (canvasRef.current) {
      addText(canvasRef.current)
    }
  }, [])

  const handleSaveAnimations = useCallback(
    async (newAnimations: ObjectAnimation[]) => {
      if (!project) return

      setAnimations(newAnimations)

      try {
        await fetch(`/api/project/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            animations: JSON.stringify(newAnimations),
          }),
        })

        toast.success("Animations saved!")
      } catch (error) {
        console.error("Error saving animations:", error)
        toast.error("Failed to save animations")
      }
    },
    [project]
  )

  const handleAddImage = useCallback((file: File) => {
    if (canvasRef.current) {
      addImageFromFile(canvasRef.current, file)
    }
  }, [])

  const handleDelete = useCallback(() => {
    if (canvasRef.current) {
      deleteObject(canvasRef.current)
    }
  }, [])

  const handleManualSave = useCallback(() => {
    if (canvasRef.current) {
      handleSave(exportToJSON(canvasRef.current))
    }
  }, [handleSave])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleSelectionCreated = (e: any) => {
      setSelectedObject(e.selected?.[0] || null)
    }

    const handleSelectionUpdated = (e: any) => {
      setSelectedObject(e.selected?.[0] || null)
    }

    const handleSelectionCleared = () => {
      setSelectedObject(null)
    }

    canvas.on("selection:created", handleSelectionCreated)
    canvas.on("selection:updated", handleSelectionUpdated)
    canvas.on("selection:cleared", handleSelectionCleared)

    return () => {
      canvas.off("selection:created", handleSelectionCreated)
      canvas.off("selection:updated", handleSelectionUpdated)
      canvas.off("selection:cleared", handleSelectionCleared)
    }
  }, [])

  const handleGenerateWithAI = useCallback(async (prompt: string) => {
    const loadingToast = toast.loading("AI is generating your design...")
    try {
      toast.info("This may take a moment")

      const res = await fetch("/api/ai/generate-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt, templateType: "design" }),
      })

      if (!res.ok) throw new Error("Generation failed")

      const { canvasData } = await res.json()

      if (canvasRef.current && canvasData) {
        loadFromJSON(canvasRef.current, canvasData)
        toast.success("Design generated successfully", { id: loadingToast })
      }
    } catch (error) {
      console.error("AI generation error:", error)
      toast.error("Failed to generate design", { id: loadingToast })
    }
  }, [])

  const handleGenerateImage = useCallback(async (prompt: string) => {
    const loadingToast = toast.loading("AI is generating your image...")
    try {
      toast.info("This may take a moment")

      const res = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt, size: "1024x1024" }),
      })

      if (!res.ok) throw new Error("Image generation failed")

      const { imageUrl } = await res.json()

      if (canvasRef.current && imageUrl) {
        FabricImage.fromURL(imageUrl).then((img) => {
          img.scaleToWidth(400)
          img.set({ left: 100, top: 100 })
          canvasRef.current?.add(img)
          canvasRef.current?.renderAll()
          toast.success("Image generated and added to canvas", {
            id: loadingToast,
          })
        })
      }
    } catch (error) {
      console.error("AI image generation error:", error)
      toast.error("Failed to generate image", { id: loadingToast })
    }
  }, [])

  const handleOpenTemplates = useCallback(() => {
    router.push("/templates")
  }, [router])

  const handleGroup = useCallback(() => {
    if (canvasRef.current) {
      groupObjects(canvasRef.current)
    }
  }, [])

  const handleUngroup = useCallback(() => {
    if (canvasRef.current) {
      ungroupObjects(canvasRef.current)
    }
  }, [])

  const handleSelectFromLayers = useCallback((obj: FabricObject) => {
    setSelectedObject(obj)
  }, [])

  const handleCanvasDimensionsChange = useCallback(
    async (width: number, height: number) => {
      if (!project) return

      try {
        await fetch(`/api/project/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ width, height }),
        })

        setProject({ ...project, width, height })
        toast.success("Canvas size saved")
      } catch (error) {
        console.error("Error saving dimensions:", error)
        toast.error("Failed to save")
      }
    },
    [project]
  )

  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden">
        <Toolbar
          projectId={params.projectId as string}
          projectName={project?.name || "Untitled"}
          onProjectNameChange={(newName) =>
            setProject({ ...project, name: newName })
          }
          onAddRectangle={() => handleAddShape("rect")}
          onAddCircle={() => handleAddShape("circle")}
          onAddTriangle={() => handleAddShape("triangle")}
          onAddText={handleAddText}
          onDelete={handleDelete}
          onSave={handleManualSave}
          onExport={handleExport}
          onGenerateWithAI={() => setShowAIDesignDialog(true)}
          onGenerateImage={() => setShowAIImageDialog(true)}
          onOpenTemplates={handleOpenTemplates}
          onGroup={handleGroup}
          onUngroup={handleUngroup}
        />

        <div className="flex-1 flex overflow-hidden">
          <SidebarApp
            canvas={canvasRef.current}
            onAddShape={handleAddShape}
            onAddText={handleAddText}
            onAddImage={handleAddImage}
          />

          {project ? (
            <CanvasEditor
              projectId={params.projectId as string}
              initialData={project?.canvasData}
              width={project?.width || 800}
              height={project?.height || 600}
              onSave={handleSave}
              canvasRef={canvasRef}
            />
          ) : (
            <Loading />
          )}
          <PropertiesPanel
            canvas={canvasRef.current}
            selectedObject={selectedObject}
            handleSaveAnimations={handleSaveAnimations}
            animations={animations}
            onSelectObject={handleSelectFromLayers}
            project={project}
            handleCanvasDimensionsChange={handleCanvasDimensionsChange}
          />
        </div>
      </div>

      {/* ✅ AI Dialogs */}
      <AIGenerateDialog
        open={showAIDesignDialog}
        onOpenChange={setShowAIDesignDialog}
        title="Generate Design with AI"
        description="Describe the design you want to create and AI will generate it for you."
        onGenerate={handleGenerateWithAI}
        placeholder="Example: Create a modern business card with blue gradients and my name..."
      />

      <AIGenerateDialog
        open={showAIImageDialog}
        onOpenChange={setShowAIImageDialog}
        title="Generate AI Image"
        description="Describe the image you want to generate using DALL-E."
        onGenerate={handleGenerateImage}
        placeholder="Example: A futuristic cityscape at sunset with flying cars..."
      />

      {/* ✅ Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        canvas={canvasRef.current}
        projectName={project?.name || "design"}
      />
    </>
  )
}
