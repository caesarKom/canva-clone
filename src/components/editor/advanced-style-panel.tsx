'use client'

import { useState } from 'react'
import { Canvas, FabricObject, Gradient, FabricImage, filters } from 'fabric'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AdvancedStylePanelProps {
  canvas: Canvas | null
  selectedObject: FabricObject | null
}

export function AdvancedStylePanel({ canvas, selectedObject }: AdvancedStylePanelProps) {
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear')
  const [color1, setColor1] = useState('#3b82f6')
  const [color2, setColor2] = useState('#8b5cf6')

  const applyGradient = () => {
    if (!selectedObject || !canvas) return

    const coords = gradientType === 'linear'
      ? { x1: 0, y1: 0, x2: selectedObject.width || 100, y2: 0 }
      : { x1: (selectedObject.width || 100) / 2, y1: (selectedObject.height || 100) / 2, x2: selectedObject.width || 100, y2: (selectedObject.height || 100) / 2 }

    const gradient = new Gradient({
      type: gradientType,
      coords: coords,
      colorStops: [
        { offset: 0, color: color1 },
        { offset: 1, color: color2 },
      ],
    })

    selectedObject.set('fill', gradient)
    canvas.renderAll()
  }

  const applyImageFilter = (filterType: string) => {
    if (!selectedObject || selectedObject.type !== 'image' || !canvas) return

    const image = selectedObject as FabricImage

    // Remove existing filters
    image.filters = []

    // Apply new filter
    switch (filterType) {
      case 'grayscale':
        image.filters?.push(new filters.Grayscale())
        break
      case 'sepia':
        image.filters?.push(new filters.Sepia())
        break
      case 'invert':
        image.filters?.push(new filters.Invert())
        break
      case 'brightness':
        image.filters?.push(new filters.Brightness({ brightness: 0.2 }))
        break
      case 'contrast':
        image.filters?.push(new filters.Contrast({ contrast: 0.3 }))
        break
      case 'blur':
        image.filters?.push(new filters.Blur({ blur: 0.5 }))
        break
      case 'none':
        // No filter
        break
    }

    image.applyFilters()
    canvas.renderAll()
  }

  if (!selectedObject) {
    return null
  }

  return (
    <div className="space-y-4 p-4 border-t">
      <h3 className="font-semibold text-sm">Advanced Styling</h3>

      {/* Gradients */}
      <div>
        <Label className="text-xs mb-2 block">Gradient Fill</Label>
        <div className="space-y-3">
          <Select value={gradientType} onValueChange={(v) => setGradientType(v as any)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="radial">Radial</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Color 1</Label>
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-full h-10 rounded border cursor-pointer mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Color 2</Label>
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-full h-10 rounded border cursor-pointer mt-1"
              />
            </div>
          </div>

          <Button onClick={applyGradient} className="w-full" size="sm">
            Apply Gradient
          </Button>
        </div>
      </div>

      <Separator />

      {/* Image Filters */}
      {selectedObject.type === 'image' && (
        <div>
          <Label className="text-xs mb-2 block">Image Filters</Label>
          <Select onValueChange={applyImageFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="grayscale">Grayscale</SelectItem>
              <SelectItem value="sepia">Sepia</SelectItem>
              <SelectItem value="invert">Invert</SelectItem>
              <SelectItem value="brightness">Brightness</SelectItem>
              <SelectItem value="contrast">Contrast</SelectItem>
              <SelectItem value="blur">Blur</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
