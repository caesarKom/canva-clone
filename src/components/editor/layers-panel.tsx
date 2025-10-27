'use client'

import { useState, useEffect } from 'react'
import { Canvas, FabricObject, util } from 'fabric'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Eye, EyeOff, Lock, Unlock, Trash2, Copy } from 'lucide-react'

interface LayersPanelProps {
  canvas: Canvas | null
  selectedObject: FabricObject | null
  onSelectObject: (obj: FabricObject) => void
}

export function LayersPanel({ canvas, selectedObject, onSelectObject }: LayersPanelProps) {
  const [objects, setObjects] = useState<FabricObject[]>([])

  useEffect(() => {
    if (!canvas) return

    const updateObjects = () => {
      const canvasObjects = canvas.getObjects()
      setObjects([...canvasObjects].reverse()) // Reverse to show top objects first
    }

    updateObjects()

    canvas.on('object:added', updateObjects)
    canvas.on('object:removed', updateObjects)
    canvas.on('object:modified', updateObjects)

    return () => {
      canvas.off('object:added', updateObjects)
      canvas.off('object:removed', updateObjects)
      canvas.off('object:modified', updateObjects)
    }
  }, [canvas])

  const getObjectName = (obj: FabricObject) => {
    if (obj.type === 'i-text' || obj.type === 'text') {
      const text = (obj as any).text || ''
      return `Text: ${text.substring(0, 20)}${text.length > 20 ? '...' : ''}`
    }
    return `${obj.type?.charAt(0).toUpperCase()}${obj.type?.slice(1)}` || 'Object'
  }

  const handleSelectObject = (obj: FabricObject) => {
    if (canvas) {
      canvas.setActiveObject(obj)
      canvas.renderAll()
      onSelectObject(obj)
    }
  }

  const handleToggleVisibility = (obj: FabricObject) => {
    obj.visible = !obj.visible
    canvas?.renderAll()
    setObjects([...objects])
  }

  const handleToggleLock = (obj: FabricObject) => {
    obj.selectable = !obj.selectable
    obj.evented = !obj.evented
    canvas?.renderAll()
    setObjects([...objects])
  }

  const handleDeleteObject = (obj: FabricObject) => {
    if (canvas) {
      canvas.remove(obj)
      canvas.renderAll()
    }
  }

  const handleDuplicateObject = (obj: FabricObject, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!canvas) return
    
    canvas.setActiveObject(obj)
    obj.clone().then((cloned: FabricObject) => {
      cloned.set({
        left: (obj.left || 0) + 10,
        top: (obj.top || 0) + 10,
      })
      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      canvas.renderAll()
    })
  }
 

  const handleMoveLayer = (obj: FabricObject, direction: 'up' | 'down' | 'top' | 'bottom') => {
    if (!canvas) return

    switch (direction) {
      case 'up':
        canvas.bringObjectForward(obj)
        break
      case 'down':
        canvas.sendObjectBackwards(obj)
        break
      case 'top':
        canvas.bringObjectToFront(obj)
        break
      case 'bottom':
        canvas.sendObjectToBack(obj)
        break
    }

    canvas.renderAll()
    setObjects([...canvas.getObjects()].reverse())
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm">Layers</h3>
        <p className="text-xs text-gray-500 mt-1">{objects.length} objects</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {objects.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              No objects on canvas
            </div>
          ) : (
            objects.map((obj, index) => (
              <div
                key={index}
                className={`group flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer ${
                  selectedObject === obj ? 'bg-blue-50 hover:bg-blue-100' : ''
                }`}
                onClick={() => handleSelectObject(obj)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {getObjectName(obj)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round(obj.left || 0)}, {Math.round(obj.top || 0)}
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleVisibility(obj)
                    }}
                  >
                    {obj.visible ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleLock(obj)
                    }}
                  >
                    {obj.selectable ? (
                      <Unlock className="h-3 w-3" />
                    ) : (
                      <Lock className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      handleDuplicateObject(obj, e)
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteObject(obj)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {selectedObject && (
        <div className="p-2 border-t">
          <div className="text-xs font-medium mb-2">Layer Order</div>
          <div className="grid grid-cols-4 gap-1">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleMoveLayer(selectedObject, 'top')}
            >
              Front
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleMoveLayer(selectedObject, 'up')}
            >
              Up
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleMoveLayer(selectedObject, 'down')}
            >
              Down
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleMoveLayer(selectedObject, 'bottom')}
              
            >
              Back
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
