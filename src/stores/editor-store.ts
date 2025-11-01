import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { Canvas, FabricObject } from "fabric"
import { ObjectAnimation } from "@/types/animation"

interface Project {
  id: string
  name: string
  width: number
  height: number
  canvasData?: string
  thumbnail?: string
  animations?: string
}

interface EditorState {
  // Canvas
  canvas: Canvas | null
  selectedObject: FabricObject | null
  canvasObjects: FabricObject[]

  // Project
  project: Project | null

  // Dimensions
  canvasWidth: number
  canvasHeight: number
  zoom: number

  // Tools
  currentTool: "select" | "draw" | "text" | "shape"
  isDrawingMode: boolean

  // Animations
  animations: ObjectAnimation[]

  // UI State
  showAIDesignDialog: boolean
  showAIImageDialog: boolean
  showExportDialog: boolean
  isDirty: boolean

  // History
  history: string[]
  historyIndex: number
  autoSaveTime: string

  // Actions
  setCanvas: (canvas: Canvas | null) => void
  setSelectedObject: (obj: FabricObject | null) => void
  updateCanvasObjects: () => void
  setProject: (project: Project | null) => void
  updateProject: (data: Partial<Project>) => void
  setCanvasDimensions: (width: number, height: number) => void
  setZoom: (zoom: number) => void
  setCurrentTool: (tool: EditorState["currentTool"]) => void
  setDrawingMode: (isDrawing: boolean) => void
  setAnimations: (animations: ObjectAnimation[]) => void
  setShowAIDesignDialog: (show: boolean) => void
  setShowAIImageDialog: (show: boolean) => void
  setShowExportDialog: (show: boolean) => void
  markDirty: () => void
  markClean: () => void
  // ✅ History actions
  saveToHistory: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
setAutoSaveTime: (time: string) => void
  reset: () => void
}

export const useEditorStore = create<EditorState>()(
  devtools(
    (set, get) => ({
      // Initial state
      canvas: null,
      selectedObject: null,
      canvasObjects: [],
      project: null,
      canvasWidth: 800,
      canvasHeight: 600,
      zoom: 1,
      currentTool: "select",
      isDrawingMode: false,
      animations: [],
      showAIDesignDialog: false,
      showAIImageDialog: false,
      showExportDialog: false,
      isDirty: false,
      history: [],
      historyIndex: -1,
      autoSaveTime: "OFF",

      // Actions
      setCanvas: (canvas) => {
        if (!canvas) {
          set({ canvas: null, canvasObjects: [], selectedObject: null })
          return
        }

        set({ canvas })

        // ✅ Setup listeners
        const updateObjects = () => {
          try {
            const objects = canvas.getObjects()
            //console.log('📊 Canvas objects updated:', objects.length) // Debug
            set({ canvasObjects: Array.isArray(objects) ? [...objects] : [] })
          } catch (error) {
            console.error("Error updating canvas objects:", error)
            set({ canvasObjects: [] })
          }
        }

        // Initial update
        updateObjects()

        // ✅ Listen to object changes
        canvas.on("object:added", updateObjects)
        canvas.on("object:removed", updateObjects)
        canvas.on("object:modified", updateObjects)

        // ✅ Auto-save to history on modifications
        canvas.on("object:modified", () => {
          get().saveToHistory()
        })
        canvas.on("object:added", () => {
          get().saveToHistory()
        })

        canvas.on("object:removed", () => {
          get().saveToHistory()
        })

        // Selection listeners

        canvas.on("selection:created", (e: any) => {
          set({ selectedObject: e.selected?.[0] || null })
        })

        canvas.on("selection:updated", (e: any) => {
          set({ selectedObject: e.selected?.[0] || null })
        })

        canvas.on("selection:cleared", () => {
          set({ selectedObject: null })
        })

        canvas.renderAll()
      },

      setSelectedObject: (obj) => {
        const { canvas } = get()

        if (!canvas) {
          set({ selectedObject: obj })
          return
        }

        // ✅ If obj is null, clear selection
        if (!obj) {
          canvas.discardActiveObject()
          canvas.renderAll()
          set({ selectedObject: null })
          return
        }

        // ✅ Set active object for canvas
        try {
          canvas.setActiveObject(obj)
          canvas.renderAll()
          set({ selectedObject: obj })
        } catch (error) {
          console.error("Error setting active object:", error)
          set({ selectedObject: obj })
        }
      },

      setProject: (project) =>
        set({
          project,
          canvasWidth: project?.width || 800,
          canvasHeight: project?.height || 600,
          isDirty: false,
          history: [],
          historyIndex: -1,
        }),

      updateProject: (data) =>
        set((state) => ({
          project: state.project ? { ...state.project, ...data } : null,
          isDirty: true,
        })),

      updateCanvasObjects: () => {
        const { canvas } = get()
        if (!canvas) {
          set({ canvasObjects: [] })
          return
        }

        try {
          const objects = canvas.getObjects()
          set({ canvasObjects: Array.isArray(objects) ? [...objects] : [] })
        } catch (error) {
          console.error("Error updating canvas objects:", error)
          set({ canvasObjects: [] })
        }
      },

      setCanvasDimensions: (width, height) => {
        const { canvas } = get()
        if (canvas) {
          canvas.setDimensions({width,height})
          const element = canvas.getElement()
          if (element) {
            element.width = width
            element.height = height
          }
          canvas.renderAll()
        }
        set({
          canvasWidth: width,
          canvasHeight: height,
          isDirty: true,
        })

        get().saveToHistory()
      },

      setZoom: (zoom) => set({ zoom }),

      setCurrentTool: (tool) => set({ currentTool: tool }),

      setDrawingMode: (isDrawing) => {
        const { canvas } = get()
        if (canvas) {
          canvas.isDrawingMode = isDrawing
        }
        set({ isDrawingMode: isDrawing })
      },

      setAnimations: (animations) =>
        set({
          animations,
          isDirty: true,
        }),

      setShowAIDesignDialog: (show) => set({ showAIDesignDialog: show }),
      setShowAIImageDialog: (show) => set({ showAIImageDialog: show }),
      setShowExportDialog: (show) => set({ showExportDialog: show }),

      markDirty: () => set({ isDirty: true }),
      markClean: () => set({ isDirty: false }),

      saveToHistory: () => {
        const { canvas, history, historyIndex } = get()
        if (!canvas) return

        try {
          const json = JSON.stringify(canvas.toJSON())

          // Remove any states after current index (when user did undo then made new change)
          const newHistory = history.slice(0, historyIndex + 1)

          // Add new state
          newHistory.push(json)

          // Limit history to 50 states
          if (newHistory.length > 50) {
            newHistory.shift()
          }

          set({
            history: newHistory,
            historyIndex: newHistory.length - 1,
            isDirty: true,
          })

          //console.log("💾 Saved to history, index:", newHistory.length - 1)
        } catch (error) {
          console.error("Error saving to history:", error)
        }
      },

      undo: () => {
        const { canvas, history, historyIndex } = get()

        if (!canvas || historyIndex <= 0)  return
       
        try {
          const newIndex = historyIndex - 1
          const state = history[newIndex]

          canvas.loadFromJSON(JSON.parse(state)).then(() => {
            canvas.renderAll()
            set({
              historyIndex: newIndex,
              isDirty: true,
            })
            get().updateCanvasObjects()
          })
        } catch (error) {
          console.error("Error during undo:", error)
        }
      },

      redo: () => {
        const { canvas, history, historyIndex } = get()

        if (!canvas || historyIndex >= history.length - 1) return

        try {
          const newIndex = historyIndex + 1
          const state = history[newIndex]

          canvas.loadFromJSON(JSON.parse(state)).then(() => {
            canvas.renderAll()
            set({
              historyIndex: newIndex,
              isDirty: true,
            })
            get().updateCanvasObjects()
          })
        } catch (error) {
          console.error("Error during redo:", error)
        }
      },

      canUndo: () => {
        const { historyIndex } = get()
        return historyIndex > 0
      },

      canRedo: () => {
        const { history, historyIndex } = get()
        return historyIndex < history.length - 1
      },

      setAutoSaveTime: (time) => set({ autoSaveTime: time }),

      reset: () =>
        set({
          canvas: null,
          selectedObject: null,
          canvasObjects: [],
          project: null,
          canvasWidth: 800,
          canvasHeight: 600,
          zoom: 1,
          currentTool: "select",
          isDrawingMode: false,
          animations: [],
          showAIDesignDialog: false,
          showAIImageDialog: false,
          showExportDialog: false,
          isDirty: false,
          history: [],
          historyIndex: -1,
        }),
    }),
    { name: "EditorStore" }
  )
)
