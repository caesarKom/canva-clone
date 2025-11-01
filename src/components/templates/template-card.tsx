"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StaticCanvas } from 'fabric'
import { templateData, TemplateType } from '@/lib/templates'

interface TemplateCardProps {
  template: TemplateType
  categoryIcon?: string
}

export function TemplateCard({ template, categoryIcon }: TemplateCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!canvasRef.current) return

    const generatePreview = async () => {
      try {
        setIsLoading(true)

        const data = templateData[template.id]
        if (!data) {
          console.warn('No template data for:', template.id)
          setIsLoading(false)
          return
        }

        const canvas = new StaticCanvas()
        canvas.setDimensions({width:template.width, height:template.height})

        await canvas.loadFromJSON(data)

        const scale = 0.25 // 25% original size
        const dataUrl = canvas.toDataURL({
          format: 'png',
          quality: 0.8,
          multiplier: scale,
        })

        setPreviewUrl(dataUrl)
        setIsLoading(false)

        canvas.dispose()
      } catch (error) {
        console.error('Error generating preview:', error)
        setIsLoading(false)
      }
    }

    generatePreview()
  }, [template])

  return (
    <Link
      href={`/editor/new?template=${template.id}`}
      className="group block"
    >
      <div className="bg-white rounded-lg shadow hover:shadow-xl transition-all overflow-hidden">
        {/* Preview Image */}
        <div className="aspect-video bg-gray-100 relative overflow-hidden">
          {isLoading ? (
            // Loading state
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
                <div className="text-xs text-gray-500">Loading preview...</div>
              </div>
            </div>
          ) : previewUrl ? (
            // Preview image
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={template.name}
                className="w-full h-full object-fill"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <Button 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  size="lg"
                >
                  Use Template
                </Button>
              </div>
            </>
          ) : (
            // Fallback
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">{categoryIcon}</div>
                <div className="text-sm font-mono text-gray-600">
                  {template.width} × {template.height}
                </div>
              </div>
            </div>
          )}

          {/* Hidden canvas for rendering */}
          <canvas
            ref={canvasRef}
            className="hidden"
          />
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold mb-1 truncate">{template.name}</h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {template.description || 'Professional template'}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
              {template.category}
            </span>
            <span className="text-xs text-gray-500">
              {template.width}×{template.height}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
