'use client'

import { useState, useEffect } from 'react'
import { Canvas, PencilBrush, CircleBrush, SprayBrush } from 'fabric'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Paintbrush, Circle, Droplet, Eraser } from 'lucide-react'
import { Input } from '../ui/input'

interface DrawingToolbarProps {
  canvas: Canvas | null
}

export function DrawingToolbar({ canvas }: DrawingToolbarProps) {
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const [brushType, setBrushType] = useState<'pencil' | 'circle' | 'spray'>('pencil')
  const [brushWidth, setBrushWidth] = useState(5)
  const [brushColor, setBrushColor] = useState('#000000')

  // ✅ Sync state with canvas
  useEffect(() => {
    if (canvas) {
      setIsDrawingMode(canvas.isDrawingMode || false)
    }
  }, [canvas])

  const toggleDrawingMode = () => {
    if (!canvas) return
    
    const newMode = !isDrawingMode
    setIsDrawingMode(newMode)
    canvas.isDrawingMode = newMode
    
    if (newMode) {
      initializeBrush()
    } else {
  
      canvas.isDrawingMode = false
    }
    
    canvas.renderAll()
  }

  const initializeBrush = () => {
    if (!canvas) return

    try {
      let brush
      
      switch (brushType) {
        case 'circle':
          brush = new CircleBrush(canvas)
          break
        case 'spray':
          brush = new SprayBrush(canvas)
          break
        case 'pencil':
        default:
          brush = new PencilBrush(canvas)
          break
      }

      brush.color = brushColor
      brush.width = brushWidth
      canvas.freeDrawingBrush = brush
      
      console.log('Brush initialized:', brushType, 'color:', brushColor, 'width:', brushWidth)
    } catch (error) {
      console.error('Error initializing brush:', error)
    }
  }

  const handleBrushTypeChange = (type: 'pencil' | 'circle' | 'spray') => {
    setBrushType(type)
    
    if (canvas && isDrawingMode) {
      let brush
      
      try {
        switch (type) {
          case 'circle':
            brush = new CircleBrush(canvas)
            break
          case 'spray':
            brush = new SprayBrush(canvas)
            break
          case 'pencil':
          default:
            brush = new PencilBrush(canvas)
            break
        }

        brush.color = brushColor
        brush.width = brushWidth
        canvas.freeDrawingBrush = brush
        canvas.renderAll()
      } catch (error) {
        console.error('Error changing brush type:', error)
      }
    }
  }

  const handleBrushWidthChange = (value: number[]) => {
    const newWidth = value[0]
    setBrushWidth(newWidth)
    
    if (canvas?.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = newWidth
    }
  }

  const handleBrushColorChange = (color: string) => {
    setBrushColor(color)
    
    if (canvas?.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Drawing Tools</h3>
        <Button
          variant={isDrawingMode ? 'default' : 'outline'}
          size="sm"
          onClick={toggleDrawingMode}
        >
          <Paintbrush className="h-4 w-4 mr-2" />
          {isDrawingMode ? 'Drawing' : 'Draw'}
        </Button>
      </div>

      {isDrawingMode && (
        <>
          <Separator />
          
          <div>
            <Label className="text-xs mb-2 block">Brush Type</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={brushType === 'pencil' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleBrushTypeChange('pencil')}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <Paintbrush className="h-4 w-4" />
                <span className="text-xs">Pencil</span>
              </Button>
              <Button
                variant={brushType === 'circle' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleBrushTypeChange('circle')}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <Circle className="h-4 w-4" />
                <span className="text-xs">Circle</span>
              </Button>
              <Button
                variant={brushType === 'spray' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleBrushTypeChange('spray')}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <Droplet className="h-4 w-4" />
                <span className="text-xs">Spray</span>
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-xs">Brush Width: {brushWidth}px</Label>
            <Slider
              value={[brushWidth]}
              onValueChange={handleBrushWidthChange}
              min={1}
              max={50}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-xs mb-2 block">Brush Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={brushColor}
                onChange={(e) => handleBrushColorChange(e.target.value)}
                className="w-full h-10 rounded border cursor-pointer"
              />
              <Input
                type="text"
                value={brushColor}
                onChange={(e) => handleBrushColorChange(e.target.value)}
                className="w-24 h-10"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="rounded-md bg-blue-50 p-3">
            <p className="text-xs text-blue-800">
              ✏️ Click and drag on canvas to draw. Press ESC to exit drawing mode.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              if (canvas) {
                canvas.isDrawingMode = false
                setIsDrawingMode(false)
                canvas.renderAll()
              }
            }}
          >
            <Eraser className="h-4 w-4 mr-2" />
            Exit Drawing Mode
          </Button>
        </>
      )}
    </div>
  )
}
