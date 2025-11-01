"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings } from "lucide-react"
import { toast } from "sonner"
import { useEditorStore } from "@/stores/editor-store"

export function CanvasSettings() {

  const {canvas, canvasWidth, canvasHeight, setCanvasDimensions} = useEditorStore()
  const [open, setOpen] = useState(false)
  const [width, setWidth] = useState(canvasWidth)
  const [height, setHeight] = useState(canvasHeight)


  const handleApply = () => {
    if (!canvas) {
      toast.error("Canvas not available")
      return
    }

    try {
      setCanvasDimensions(width,height)

      toast.success("Canvas size updated")
      setOpen(false)
    } catch (error) {
      console.error("Error updating canvas size:", error)
      toast.error("Failed to update canvas size")
    }
  }

  const presets = [
    { name: 'Square', width: 800, height: 800 },
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Post', width: 1200, height: 630 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'A4 Portrait', width: 794, height: 1123 },
    { name: 'A4 Landscape', width: 1123, height: 794 },
    { name: 'Presentation 16:9', width: 1920, height: 1080 },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          {canvasWidth}×{canvasHeight}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Canvas Size</DialogTitle>
          <DialogDescription>Change canvas dimensions</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Width (px)</Label>
              <Input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                min={100}
                max={5000}
              />
            </div>
            <div>
              <Label className="text-xs">Height (px)</Label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                min={100}
                max={5000}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Presets</Label>
            {presets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => {
                  setWidth(preset.width)
                  setHeight(preset.height)
                }}
              >
                {preset.name} ({preset.width}×{preset.height})
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
