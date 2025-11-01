"use client"

import { useEffect, useRef, useCallback } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Canvas, FabricImage } from "fabric"
import { CanvasEditor } from "@/components/editor/canvas"
import { Toolbar } from "@/components/editor/toolbar"
import { SidebarApp } from "@/components/editor/sidebar"
import { PropertiesPanel } from "@/components/editor/properties-panel"
import { exportToJSON, exportToPNG, loadFromJSON } from "@/lib/fabric-utils"
import { toast } from "sonner"
import { AIGenerateDialog } from "@/components/editor/ai-generate-dialog"
import { templateData, TemplateId, templateList } from "@/lib/templates"
import { ExportDialog } from "@/components/editor/export-dialog"
import { ObjectAnimation } from "@/types/animation"
import { Loading } from "@/components/loading"
import { useEditorStore } from "@/stores/editor-store"

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const canvasRef = useRef<Canvas | null>(null)

  const {
    canvas,
    project,
    animations,
    showAIDesignDialog,
    showAIImageDialog,
    showExportDialog,
    setProject,
    updateProject,
    setAnimations,
    setShowAIDesignDialog,
    setShowAIImageDialog,
    setShowExportDialog,
    markClean,
    reset,
    updateCanvasObjects,
  } = useEditorStore()

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
  }, [project, setAnimations])

  const createNewProject = useCallback(
    async (templateId?: TemplateId | null) => {
      if (isCreatingProject.current) return
      isCreatingProject.current = true

      const template = templateList.find((t) => t.id === templateId)
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
        if (templateCanvasData && canvas) {
          setTimeout(() => {
            if (canvas) {
              loadFromJSON(canvas, templateCanvasData)
              // Force update objects list
              setTimeout(() => {
                updateCanvasObjects()
              }, 200)
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
    [canvas, router, setProject, updateCanvasObjects]
  )

  const loadProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/project/${params.projectId}`, {
        credentials: "include",
      })

      if (!res.ok) throw new Error("Failed to load project")

      const data = await res.json()
      setProject(data)

      // Load animations
      if (data.animations) {
        try {
          const parsedAnimations = JSON.parse(data.animations)
          setAnimations(parsedAnimations)
        } catch (error) {
          console.error("Failed to parse animations:", error)
        }
      }
    } catch (error) {
      console.error("Error loading project:", error)
      toast.error("Failed to load project")
    }
  }, [params.projectId, setProject, setAnimations])

  const handleSave = useCallback(
    async (canvasData: string) => {
      if (!project || !canvasData) return

      const canvas = useEditorStore.getState().canvas
      const thumbnail = canvas ? exportToPNG(canvas) : null

      const parsed = JSON.parse(canvasData)

      try {
        const res = await fetch(`/api/project/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            canvasData: canvasData,
            thumbnail,
            animations: JSON.stringify(animations),
            width: parsed.width,
            height: parsed.height,
          }),
        })

        if (!res.ok) {
          throw new Error("Failed to save project")
        }

        markClean()
        toast.success("Project saved successfully")
      } catch (error) {
        console.error("❌ Error saving project:", error)
        toast.error("Failed to save project")
      }
    },
    [project, animations, markClean]
  )

  const handleManualSave = useCallback(() => {
    if (canvas) {
      const data = exportToJSON(canvas)
      handleSave(data)
    } else {
      console.error("Canvas not available for save!")
      toast.error("Canvas not ready")
    }
  }, [canvas, handleSave])

  const handleExport = useCallback(() => {
    setShowExportDialog(true)
  }, [setShowExportDialog])

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
    [project, setAnimations]
  )

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

    const data = await res.json()

    const canvasData = data.canvasDataText

    console.log('canvasData:', canvasData, 'typeof:', typeof canvasData)

    if (!canvasRef.current) throw new Error("canvasRef is not ready")

    // Jeśli canvasData jest stringiem JSON => parsuj, jeśli obiektem - użyj bez parsowania
    let parsedCanvasData
    if (typeof canvasData === 'string') {
      parsedCanvasData = JSON.parse(canvasData)
    } else if (typeof canvasData === 'object' && canvasData !== null) {
      parsedCanvasData = canvasData
    } else {
      throw new Error("Nieznany typ danych canvasData")
    }

    // Wywołaj ładowanie na canvasie z właściwym obiektem
    await loadFromJSON(canvasRef.current, parsedCanvasData)

    toast.success("Design generated successfully", { id: loadingToast })
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

  const handleProjectNameChange = useCallback(
    async (newName: string) => {
      if (!project) return

      updateProject({ name: newName })

      try {
        await fetch(`/api/project/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: newName }),
        })
      } catch (error) {
        console.error("Error updating project name:", error)
        toast.error("Failed to update project name")
      }
    },
    [project, updateProject]
  )

  // Initialize
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

    return () => {
      reset()
    }
  }, [createNewProject, loadProject, params.projectId, reset, searchParams])

  // ✅ Sync canvas from store to ref (for manual save)
  useEffect(() => {
    if (canvas) {
      canvasRef.current = canvas
    } else {
      canvasRef.current = null
    }
  }, [canvas])

  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden">
        <Toolbar
          projectId={params.projectId as string}
          projectName={project?.name || "Untitled"}
          onProjectNameChange={handleProjectNameChange}
          onSave={handleManualSave}
          onExport={handleExport}
          onGenerateWithAI={() => setShowAIDesignDialog(true)}
          onGenerateImage={() => setShowAIImageDialog(true)}
        />

        <div className="flex-1 flex overflow-hidden">
          <SidebarApp />

          {project ? (
            <CanvasEditor
              projectId={params.projectId as string}
              initialData={project?.canvasData}
              onSave={handleSave}
            />
          ) : (
            <Loading />
          )}
          <PropertiesPanel handleSaveAnimations={handleSaveAnimations} />
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
        projectName={project?.name || "design"}
      />
    </>
  )
}
