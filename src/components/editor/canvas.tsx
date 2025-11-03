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
  console.log('🎨 CanvasEditor render:', { 
    projectId, 
    hasInitialData: !!initialData,
    initialDataLength: initialData?.length 
  })

  const localCanvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<Canvas | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasLoadedData = useRef(false)
  const loadAttempts = useRef(0)
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const [isMounted, setIsMounted] = useState(false)
  const [isCanvasReady, setIsCanvasReady] = useState(false)

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
    console.log('✅ Component mounted')
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

  // ✅ FIX: Initialize canvas with delay to ensure ref is ready
  useEffect(() => {
    console.log('🔄 Init effect triggered:', { 
      isMounted, 
      hasRef: !!localCanvasRef.current,
      projectId 
    })

    if (!isMounted) {
      console.log('⏳ Not mounted yet')
      return
    }

    // ✅ Clear any previous timeout
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current)
      
    }

    // ✅ Give React time to attach the ref
    initTimeoutRef.current = setTimeout(() => {
      if (!localCanvasRef.current) {
        console.error('❌ Canvas ref still not available after timeout!')
        return
      }

      console.log('🎨 Initializing canvas for project:', projectId)

      const fabricCanvas = initializeFabric(
        localCanvasRef,
        canvasWidth,
        canvasHeight
      )
      
      if (!fabricCanvas) {
        console.error('❌ Failed to initialize canvas')
        return
      }

      fabricRef.current = fabricCanvas
      useEditorStore.getState().setCanvas(fabricCanvas)

      let alive = true
      const originalClear = fabricCanvas.clear.bind(fabricCanvas)
      fabricCanvas.clear = function () {
        if (!alive) return this
        return originalClear()
      }

      setIsCanvasReady(true)
      console.log('✅ Canvas initialized and ready')

      return () => {
        console.log('🧹 Cleaning up canvas')
        alive = false
        setIsCanvasReady(false)
        hasLoadedData.current = false
        loadAttempts.current = 0
        fabricCanvas.dispose()
        useEditorStore.getState().setCanvas(null)
        useEditorStore.getState().saveToHistory()
        fabricRef.current = null
      }
    }, 100) // ✅ 100ms delay

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
        initTimeoutRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, isMounted])

  // Load initial data AFTER canvas is ready
  useEffect(() => {
    console.log('🔍 Load data effect triggered:', {
      isCanvasReady,
      hasFabricRef: !!fabricRef.current,
      hasInitialData: !!initialData,
      hasLoadedData: hasLoadedData.current,
      loadAttempts: loadAttempts.current,
      initialDataLength: initialData?.length
    })

    if (!isCanvasReady) {
      console.log('⏳ Canvas not ready yet')
      return
    }

    if (!fabricRef.current) {
      console.log('⏳ Fabric ref not available')
      return
    }

    if (!initialData) {
      console.log('ℹ️ No initial data to load')
      return
    }

    if (hasLoadedData.current) {
      console.log('✅ Data already loaded, skipping')
      return
    }

    if (loadAttempts.current > 3) {
      console.error('❌ Too many load attempts, aborting')
      return
    }

    loadAttempts.current++
    const fabricCanvas = fabricRef.current

    console.log(`📥 Attempt ${loadAttempts.current}: Loading initial data...`, {
      projectId,
      dataLength: initialData.length,
      canvasReady: isCanvasReady
    })

    hasLoadedData.current = true

    setTimeout(() => {
      if (!fabricCanvas || !fabricRef.current) {
        console.error('❌ Canvas disposed before data could load')
        hasLoadedData.current = false
        return
      }

      console.log('🔄 Calling loadFromJSON...')

      loadFromJSON(fabricCanvas, initialData)
        .then(() => {
          console.log('✅ Canvas data loaded successfully!')
          console.log('📊 Objects on canvas:', fabricCanvas.getObjects().length)
          
          setTimeout(() => {
            if (fabricRef.current) {
              updateCanvasObjects()
              saveToHistory()
              console.log('✅ Canvas objects updated and saved to history')
            }
          }, 150)
        })
        .catch((error) => {
          console.error('❌ Failed to load canvas data:', error)
          hasLoadedData.current = false
          loadAttempts.current--
        })
    }, 300)
  }, [isCanvasReady, initialData, projectId, updateCanvasObjects, saveToHistory])

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 2))
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.1))
  const handleZoomReset = () => setZoom(1)

  const handleFitToScreen = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const containerWidth = container.clientWidth - 5
    const containerHeight = container.clientHeight - 5

    const scaleX = containerWidth / canvasWidth
    const scaleY = containerHeight / canvasHeight
    const fitZoom = Math.min(scaleX, scaleY, 1)

    setZoom(fitZoom)
  }, [canvasWidth, canvasHeight, setZoom])

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
  }, [canvasWidth, canvasHeight, handleFitToScreen])

  if (!isMounted) {
    return (
      <div className="flex-1 bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="size-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Initializing editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-gray-100 overflow-auto relative"
      suppressHydrationWarning
    >
      <div className="min-h-full p-8 flex items-center justify-center">
        <div
          className="shadow-2xl bg-white"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
            transition: "transform 0.2s ease",
          }}
        >
          <canvas ref={localCanvasRef} suppressHydrationWarning />
        </div>
      </div>

      {/* Debug info overlay 
      <div className="absolute top-4 left-4 bg-black/80 text-white p-3 rounded text-xs font-mono max-w-xs z-50">
        <div>Mounted: {isMounted ? '✅' : '❌'}</div>
        <div>Canvas Ref: {localCanvasRef.current ? '✅' : '❌'}</div>
        <div>Canvas Ready: {isCanvasReady ? '✅' : '❌'}</div>
        <div>Has Data: {initialData ? '✅' : '❌'}</div>
        <div>Data Loaded: {hasLoadedData.current ? '✅' : '❌'}</div>
        <div>Load Attempts: {loadAttempts.current}</div>
        <div>Objects: {canvas?.getObjects().length || 0}</div>
      </div>
*/}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
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
