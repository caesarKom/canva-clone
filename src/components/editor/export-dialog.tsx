'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Download, FileImage, FileType } from 'lucide-react'
import { Canvas } from 'fabric'
import jsPDF from 'jspdf'

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  canvas: Canvas | null
  projectName: string
}

type ExportFormat = 'png' | 'jpg' | 'svg' | 'pdf' | 'json'

export function ExportDialog({ open, onOpenChange, canvas, projectName }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('png')
  const [quality, setQuality] = useState<number>(1)

  const handleExport = () => {
    if (!canvas) return

    const fileName = `${projectName.replace(/\s+/g, '-').toLowerCase()}`

    switch (format) {
      case 'png':
        exportPNG(canvas, fileName, quality)
        break
      case 'jpg':
        exportJPG(canvas, fileName, quality)
        break
      case 'svg':
        exportSVG(canvas, fileName)
        break
      case 'pdf':
        exportPDF(canvas, fileName)
        break
      case 'json':
        exportJSON(canvas, fileName)
        break
    }

    onOpenChange(false)
  }

  const exportPNG = (canvas: Canvas, fileName: string, multiplier: number) => {
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: multiplier,
    })
    downloadFile(dataURL, `${fileName}.png`)
  }

  const exportJPG = (canvas: Canvas, fileName: string, multiplier: number) => {
    const dataURL = canvas.toDataURL({
      format: 'jpeg',
      quality: 0.9,
      multiplier: multiplier,
    })
    downloadFile(dataURL, `${fileName}.jpg`)
  }

  const exportSVG = (canvas: Canvas, fileName: string) => {
    const svg = canvas.toSVG()
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    downloadFile(url, `${fileName}.svg`)
    URL.revokeObjectURL(url)
  }

  const exportPDF = (canvas: Canvas, fileName: string) => {
    const imgData = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    })

    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    })

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(`${fileName}.pdf`)
  }

  const exportJSON = (canvas: Canvas, fileName: string) => {
    const json = JSON.stringify(canvas.toJSON(), null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    downloadFile(url, `${fileName}.json`)
    URL.revokeObjectURL(url)
  }

  const downloadFile = (url: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Design</DialogTitle>
          <DialogDescription>
            Choose the format and quality for your export
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4" />
                    PNG (Best quality)
                  </div>
                </SelectItem>
                <SelectItem value="jpg">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4" />
                    JPG (Smaller size)
                  </div>
                </SelectItem>
                <SelectItem value="svg">
                  <div className="flex items-center gap-2">
                    <FileType className="h-4 w-4" />
                    SVG (Vector)
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileType className="h-4 w-4" />
                    PDF (Document)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileType className="h-4 w-4" />
                    JSON (Editable)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(format === 'png' || format === 'jpg') && (
            <div className="space-y-2">
              <Label>Quality</Label>
              <Select value={quality.toString()} onValueChange={(v) => setQuality(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Standard (1x)</SelectItem>
                  <SelectItem value="2">High (2x)</SelectItem>
                  <SelectItem value="3">Ultra (3x)</SelectItem>
                  <SelectItem value="4">Print (4x)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
