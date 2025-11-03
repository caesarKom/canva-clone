"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { Canvas } from "fabric"
import {
  initializeFabric,
  exportToJSON,
  loadFromJSON,
} from "@/lib/fabric-utils"
import { useEditorStore } from "@/stores/editor-store"
import { Maximize2, ZoomIn, ZoomOut } from "lucide-react"

interface CanvasEditorProps {
  projectId: string
  initialData?: string
  onSave?: (data: string) => void
}

export function CanvasEditor({
  initialData,
  onSave,
  projectId,
}: CanvasEditorProps) {
  const localCanvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<Canvas | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  const {
    canvas,
    zoom,
    setZoom,
    canvasWidth,
    canvasHeight,
    updateCanvasObjects,
    saveToHistory,
    autoSaveTime,
  } = useEditorStore()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSave = useCallback(() => {
    if (fabricRef.current && onSave) {
      const data = exportToJSON(fabricRef.current)
      onSave(data)
    }
  }, [onSave])

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

    if (autoSaveTime !== "OFF") {
      const time = Number(autoSaveTime)

      interval = setInterval(() => {
        handleSave()
      }, time * 60_000)
    } 

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [autoSaveTime, handleSave])

  useEffect(() => {
    if (!isMounted || !localCanvasRef.current) return

    const fabricCanvas = initializeFabric(
      localCanvasRef,
      canvasWidth,
      canvasHeight
    )
    if (!fabricCanvas) return

    fabricRef.current = fabricCanvas

    useEditorStore.getState().setCanvas(fabricCanvas)

    let alive = true
    const originalClear = fabricCanvas.clear.bind(fabricCanvas)
    fabricCanvas.clear = function () {
      if (!alive) return this
      return originalClear()
    }

    // Load initial data
    if (initialData) {
      setTimeout(async () => {
        if (!alive) return

        try {
          await loadFromJSON(fabricCanvas, initialData)

          setTimeout(() => {
            if (alive) {
              updateCanvasObjects()
              saveToHistory()
            }
          }, 100)
        } catch (error) {
          console.error("Failed to load canvas data:", error)
        }
      }, 100)
    }

    return () => {
      alive = false
      fabricCanvas.dispose()
      useEditorStore.getState().setCanvas(null)
      useEditorStore.getState().saveToHistory()
      fabricRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, isMounted])

    const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 2))
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.1))
  const handleZoomReset = () => setZoom(1)

  const handleFitToScreen = () => {
    if (!containerRef.current) return

    const container = containerRef.current
    const containerWidth = container.clientWidth - 5
    const containerHeight = container.clientHeight - 5

    const scaleX = containerWidth / canvasWidth
    const scaleY = containerHeight / canvasHeight
    const fitZoom = Math.min(scaleX, scaleY, 1)

    setZoom(fitZoom)
  }

  // Auto-fit canvas to viewport
  // useEffect(() => {
  //   if (!containerRef.current || !canvasWidth || !canvasHeight) return

  //   const container = containerRef.current
  //   const containerWidth = container.clientWidth - 64 // padding
  //   const containerHeight = container.clientHeight - 64

  //   const scaleX = containerWidth / canvasWidth
  //   const scaleY = containerHeight / canvasHeight
  //   const autoZoom = Math.min(scaleX, scaleY, 1) // Max 100%

  //   setZoom(autoZoom)
  // }, [canvasWidth, canvasHeight, setZoom])

  useEffect(() => {
    if (!fabricRef.current) return
    
    const canvas = fabricRef.current
      canvas.setDimensions({ width: canvasWidth, height: canvasHeight })
      const element = canvas.getElement()

      if (element) {
        element.width = canvasWidth
        element.height = canvasHeight
      }
      canvas.renderAll()
      handleFitToScreen()
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasWidth, canvasHeight])

  if (!isMounted) {
    return (
      <div className="flex-1 bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="size-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Loading canvas...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-gray-100 overflow-auto relative"
    >
      {/* Scrollable canvas area */}
      <div className="min-h-full p-8 flex items-center justify-center">
        <div
          className="shadow-2xl bg-white"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
            transition: "transform 0.2s ease",
          }}
        >
          <canvas ref={localCanvasRef} />
        </div>
      </div>

      {/* Controls overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        {/* Zoom controls */}
        <div className="bg-white rounded shadow-lg p-2 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded transition-colors flex justify-center"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <div className="text-xs text-center py-1 px-2 text-gray-600 font-medium">
            {Math.round(zoom * 100)}%
          </div>

          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded transition-colors flex justify-center"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <div className="border-t my-1" />

          <button
            onClick={handleFitToScreen}
            className="p-2 hover:bg-gray-100 rounded transition-colors flex justify-center"
            title="Fit to Screen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          <button
            onClick={handleZoomReset}
            className="p-2 hover:bg-gray-100 rounded text-xs"
            title="Reset Zoom"
          >
            100%
          </button>
        </div>

        {/* Dimension indicator */}
        <div className="bg-white px-3 py-2 rounded shadow-lg text-xs text-gray-600">
          {canvasWidth} × {canvasHeight}
          <div className="text-gray-400 text-[10px] mt-0.5 text-center">
            {canvas?.getObjects().length || 0} objects
          </div>
        </div>
      </div>
    </div>
  )
}
