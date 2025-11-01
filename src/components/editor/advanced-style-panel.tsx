"use client"

import { useState } from "react"
import { Gradient, FabricImage, filters } from "fabric"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEditorStore } from "@/stores/editor-store"
import { Input } from "../ui/input"

export function AdvancedStylePanel() {
  const { canvas, selectedObject, updateCanvasObjects } = useEditorStore()
  const [gradientType, setGradientType] = useState<"linear" | "radial">(
    "linear"
  )
  const [color1, setColor1] = useState("#3b82f6")
  const [color2, setColor2] = useState("#8b5cf6")

  const applyGradient = () => {
    if (!selectedObject || !canvas) return

    const coords =
      gradientType === "linear"
        ? { x1: 0, y1: 0, x2: selectedObject.width || 100, y2: 0 }
        : {
            x1: (selectedObject.width || 100) / 2,
            y1: (selectedObject.height || 100) / 2,
            x2: selectedObject.width || 100,
            y2: (selectedObject.height || 100) / 2,
          }

    const gradient = new Gradient({
      type: gradientType,
      coords: coords,
      colorStops: [
        { offset: 0, color: color1 },
        { offset: 1, color: color2 },
      ],
    })

    selectedObject.set("fill", gradient)
    canvas.renderAll()
  }

  const applyImageFilter = (filterType: string) => {
    if (!selectedObject || selectedObject.type !== "image" || !canvas) return

    const image = selectedObject as FabricImage

    // Remove existing filters
    image.filters = []

    // Apply new filter
    switch (filterType) {
      case "grayscale":
        image.filters?.push(new filters.Grayscale())
        break
      case "sepia":
        image.filters?.push(new filters.Sepia())
        break
      case "invert":
        image.filters?.push(new filters.Invert())
        break
      case "brightness":
        image.filters?.push(new filters.Brightness({ brightness: 0.2 }))
        break
      case "contrast":
        image.filters?.push(new filters.Contrast({ contrast: 0.3 }))
        break
      case "blur":
        image.filters?.push(new filters.Blur({ blur: 0.5 }))
        break
      case "none":
        // No filter
        break
    }

    image.applyFilters()
    canvas.renderAll()
  }

  // ✅ Helper function for property updates
  const updateProperty = (property: string, value: any) => {
    if (!selectedObject || !canvas) return

    selectedObject.set(property as any, value)
    canvas.renderAll()
    updateCanvasObjects()
  }

  function toHex(color: unknown): string {
    if (typeof color !== "string") return "#000000"
    // Already hex
    if (color.startsWith("#")) {
      return color.length === 7 ? color : "#000000"
    }
    // RGB format: rgb(r, g, b) or rgba(r, g, b, a)
    if (color.startsWith("rgb")) {
      const matches = color.match(/\d+/g)
      if (!matches || matches.length < 3) return "#000000"
      const [r, g, b] = matches.map(Number)
      return (
        "#" +
        [r, g, b]
          .map((x) => {
            const hex = x.toString(16)
            return hex.length === 1 ? "0" + hex : hex
          })
          .join("")
      )
    }
    const namedColors: Record<string, string> = {
      black: "#000000",
      white: "#ffffff",
      red: "#ff0000",
      green: "#00ff00",
      blue: "#0000ff",
      yellow: "#ffff00",
      cyan: "#00ffff",
      magenta: "#ff00ff",
      silver: "#c0c0c0",
      gray: "#808080",
      maroon: "#800000",
      olive: "#808000",
      lime: "#00ff00",
      aqua: "#00ffff",
      teal: "#008080",
      navy: "#000080",
      fuchsia: "#ff00ff",
      purple: "#800080",
    }

    return namedColors[color.toLowerCase()] || "#000000"
  }

  if (!selectedObject) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Select an object to edit
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 border-t">
      <h3 className="font-semibold text-sm">Advanced Styling</h3>

      {/* Gradients */}
      <div>
        <Label className="text-xs mb-2 block">Gradient Fill</Label>
        <div className="space-y-3">
          <Select
            value={gradientType}
            onValueChange={(v) => setGradientType(v as any)}
          >
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
      {selectedObject.type === "image" && (
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

      {/* Fill Color */}
      <div>
        <Label className="text-xs">Fill Color</Label>
        <div className="flex gap-2 mt-2 items-center">
          <Input
            type="color"
            disabled={typeof selectedObject.fill === "object"}
            value={toHex(selectedObject.fill)}
            onChange={(e) => updateProperty("fill", e.target.value)}
            className="w-16 h-10 p-1 cursor-pointer"
          />
          {/* info not support */}
          {typeof selectedObject.fill === "object" && (
            <div className="text-xs text-gray-400 mt-1">
              Editable only for solid colors
            </div>
          )}
          {typeof selectedObject.fill === "string" && (
            <Input
              type="text"
              value={(selectedObject.fill as string) || "#000000"}
              onChange={(e) => updateProperty("fill", e.target.value)}
              className="flex-1"
              placeholder="#000000"
            />
          )}
        </div>
      </div>

      {/* Stroke Color */}
      <div>
        <Label className="text-xs">Stroke Color</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="color"
            value={toHex(selectedObject.stroke as string)}
            onChange={(e) => updateProperty("stroke", e.target.value)}
            className="w-16 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={(selectedObject.stroke as string) || "#000000"}
            onChange={(e) => updateProperty("stroke", e.target.value)}
            className="flex-1"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Stroke Width */}
      <div>
        <Label className="text-xs">
          Stroke Width: {selectedObject.strokeWidth || 0}
        </Label>
        <Slider
          value={[selectedObject.strokeWidth || 0]}
          onValueChange={(v) => updateProperty("strokeWidth", v[0])}
          min={0}
          max={20}
          step={1}
          className="mt-2"
        />
      </div>

      {/* Opacity */}
      <div>
        <Label className="text-xs">
          Opacity: {Math.round((selectedObject.opacity || 1) * 100)}%
        </Label>
        <Slider
          value={[(selectedObject.opacity || 1) * 100]}
          onValueChange={(v) => updateProperty("opacity", v[0] / 100)}
          min={0}
          max={100}
          step={1}
          className="mt-2"
        />
      </div>

      {/* Rotation */}
      <div>
        <Label className="text-xs">
          Rotation: {Math.round(selectedObject.angle || 0)}°
        </Label>
        <Slider
          value={[selectedObject.angle || 0]}
          onValueChange={(v) => updateProperty("angle", v[0])}
          min={0}
          max={360}
          step={1}
          className="mt-2"
        />
      </div>

      {/* Position */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">X Position</Label>
          <Input
            type="number"
            value={Math.round(selectedObject.left || 0)}
            onChange={(e) => updateProperty("left", Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">Y Position</Label>
          <Input
            type="number"
            value={Math.round(selectedObject.top || 0)}
            onChange={(e) => updateProperty("top", Number(e.target.value))}
            className="mt-1"
          />
        </div>
      </div>

      {/* Size */}
      {selectedObject.type !== "i-text" && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Width</Label>
            <Input
              type="number"
              value={Math.round(
                (selectedObject.width || 0) * (selectedObject.scaleX || 1)
              )}
              onChange={(e) => {
                if (!selectedObject.width) return
                const newWidth = Number(e.target.value)
                const scale = newWidth / selectedObject.width
                updateProperty("scaleX", scale)
              }}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Height</Label>
            <Input
              type="number"
              value={Math.round(
                (selectedObject.height || 0) * (selectedObject.scaleY || 1)
              )}
              onChange={(e) => {
                if (!selectedObject.height) return
                const newHeight = Number(e.target.value)
                const scale = newHeight / selectedObject.height
                updateProperty("scaleY", scale)
              }}
              className="mt-1"
            />
          </div>

          {/* Border Radius */}
          {selectedObject.type === "rect" && (
            <div>
              <Label className="text-xs">
                Border Radius: {Math.round((selectedObject as any).rx || 0)}
              </Label>
              <Slider
                value={[(selectedObject as any).rx || 0]}
                onValueChange={(v) => {
                  updateProperty("rx", v[0])
                  updateProperty("ry", v[0])
                }}
                min={0}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
