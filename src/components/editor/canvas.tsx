'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { Canvas } from 'fabric'
import { initializeFabric, exportToJSON, loadFromJSON } from '@/lib/fabric-utils'

interface CanvasEditorProps {
  projectId: string
  initialData?: string
   width?: number 
  height?: number
  onSave?: (data: string) => void
  canvasRef?: React.RefObject<Canvas | null>
}

export function CanvasEditor({ projectId, initialData, onSave, canvasRef, width=800,height=600 }: CanvasEditorProps) {
  const localCanvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<Canvas | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)

  const handleSave = useCallback(() => {
  if (fabricRef.current && onSave) {
    const data = exportToJSON(fabricRef.current)
    console.log('Saving canvas data:', JSON.parse(data)) // ✅ Debug
    onSave(data)
  }
}, [onSave])

  useEffect(() => {
  if (!localCanvasRef.current) return;
console.log('🎨 Initializing canvas with dimensions:', width, height) // ✅ Debug
  const canvas = initializeFabric(localCanvasRef, width, height);
  if (!canvas) return;

  fabricRef.current = canvas;
  if (canvasRef) canvasRef.current = canvas;

  // 🔒 BLOCADE – Fabric dont clered after unmount
  let alive = true;
  const originalClear = canvas.clear.bind(canvas);
  canvas.clear = function () {
    if (!alive) return this; // ← not clear, no error
    return originalClear();
  };

  // ✅ Async initialization
  const initializeCanvas = async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
      
      if (initialData && alive) {
        try {
          console.log('📦 Loading initial data...')
          await loadFromJSON(canvas, initialData)
        } catch (error) {
          console.error("Failed to load canvas data:", error)
        }
      }
    }

  initializeCanvas()

  const interval = setInterval(handleSave, 60_000);

  return () => {
    alive = false;          
    clearInterval(interval);
    canvas.dispose();   
    if (canvasRef?.current) canvasRef.current = null;
  };
}, [initialData, handleSave, canvasRef, width, height]);

// Auto-fit canvas to viewport
  useEffect(() => {
    if (!containerRef.current || !width || !height) return

    const container = containerRef.current
    const containerWidth = container.clientWidth - 64 // padding
    const containerHeight = container.clientHeight - 64

    const scaleX = containerWidth / width
    const scaleY = containerHeight / height
    const autoZoom = Math.min(scaleX, scaleY, 1) // Max 100%

    setZoom(autoZoom)
  }, [width, height])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.1))
  }

  const handleZoomReset = () => {
    setZoom(1)
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
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease',
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
            className="p-2 hover:bg-gray-100 rounded text-sm font-medium"
            title="Zoom In"
          >
            +
          </button>
          <div className="text-xs text-center py-1 px-2 text-gray-600">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded text-sm font-medium"
            title="Zoom Out"
          >
            −
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
          {width} × {height}
        </div>
      </div>
    </div>
  )
}
