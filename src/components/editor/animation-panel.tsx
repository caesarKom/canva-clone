'use client'

import { useState } from 'react'
import { Canvas, FabricObject } from 'fabric'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Play, RotateCw, MoveHorizontal, MoveVertical, Maximize, Minimize } from 'lucide-react'
import { toast } from 'sonner'

interface AnimationPanelProps {
  canvas: Canvas | null
  selectedObject: FabricObject | null
}

export function AnimationPanel({ canvas, selectedObject }: AnimationPanelProps) {
  const [duration, setDuration] = useState(1000)

  if (!selectedObject) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Select an object to animate
      </div>
    )
  }

  // ✅ Prosty animator używający requestAnimationFrame
  const animateProperty = (
    property: string,
    startValue: number,
    endValue: number,
    onComplete?: () => void
  ) => {
    if (!selectedObject || !canvas) return

    const startTime = Date.now()
    const diff = endValue - startValue

    const step = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-in-out cubic)
      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2

      const currentValue = startValue + (diff * easedProgress)
      
      selectedObject.set(property as any, currentValue)
      canvas.renderAll()

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        onComplete?.()
      }
    }

    requestAnimationFrame(step)
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-sm">Animations</h3>

      <div>
        <Label className="text-xs">Duration: {duration}ms</Label>
        <Slider
          value={[duration]}
          onValueChange={(v) => setDuration(v[0])}
          min={100}
          max={5000}
          step={100}
          className="mt-2"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs block mb-2">Quick Animations</Label>
        
        {/* Move Right */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            const start = selectedObject.left || 0
            animateProperty('left', start, start + 100, () => {
              toast.success('Moved right!')
            })
          }}
        >
          <MoveHorizontal className="h-4 w-4 mr-2" />
          Move Right
        </Button>

        {/* Move Left */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            const start = selectedObject.left || 0
            animateProperty('left', start, start - 100, () => {
              toast.success('Moved left!')
            })
          }}
        >
          <MoveHorizontal className="h-4 w-4 mr-2 rotate-180" />
          Move Left
        </Button>

        {/* Move Down */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            const start = selectedObject.top || 0
            animateProperty('top', start, start + 100, () => {
              toast.success('Moved down!')
            })
          }}
        >
          <MoveVertical className="h-4 w-4 mr-2" />
          Move Down
        </Button>

        {/* Move Up */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            const start = selectedObject.top || 0
            animateProperty('top', start, start - 100, () => {
              toast.success('Moved up!')
            })
          }}
        >
          <MoveVertical className="h-4 w-4 mr-2 rotate-180" />
          Move Up
        </Button>

        {/* Rotate */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            const start = selectedObject.angle || 0
            animateProperty('angle', start, start + 360, () => {
              toast.success('Rotation complete!')
            })
          }}
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Rotate 360°
        </Button>

        {/* Scale Up */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            const startX = selectedObject.scaleX || 1
            const startY = selectedObject.scaleY || 1
            
            animateProperty('scaleX', startX, startX * 1.5)
            animateProperty('scaleY', startY, startY * 1.5, () => {
              toast.success('Scaled up!')
            })
          }}
        >
          <Maximize className="h-4 w-4 mr-2" />
          Scale Up 1.5x
        </Button>

        {/* Scale Down */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            const startX = selectedObject.scaleX || 1
            const startY = selectedObject.scaleY || 1
            
            animateProperty('scaleX', startX, startX * 0.7)
            animateProperty('scaleY', startY, startY * 0.7, () => {
              toast.success('Scaled down!')
            })
          }}
        >
          <Minimize className="h-4 w-4 mr-2" />
          Scale Down 0.7x
        </Button>

        {/* Fade In/Out */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            const start = selectedObject.opacity || 1
            
            // Fade out
            animateProperty('opacity', start, 0, () => {
              // Then fade in
              animateProperty('opacity', 0, 1, () => {
                toast.success('Fade complete!')
              })
            })
          }}
        >
          <Play className="h-4 w-4 mr-2" />
          Fade In/Out
        </Button>

        {/* Pulse */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            const startX = selectedObject.scaleX || 1
            const startY = selectedObject.scaleY || 1
            
            // Scale up
            animateProperty('scaleX', startX, startX * 1.2)
            animateProperty('scaleY', startY, startY * 1.2, () => {
              // Then scale back down
              animateProperty('scaleX', startX * 1.2, startX)
              animateProperty('scaleY', startY * 1.2, startY, () => {
                toast.success('Pulse complete!')
              })
            })
          }}
        >
          <Play className="h-4 w-4 mr-2" />
          Pulse
        </Button>

        {/* Bounce */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            const start = selectedObject.top || 0
            
            // Move down
            animateProperty('top', start, start + 50, () => {
              // Bounce back up
              animateProperty('top', start + 50, start, () => {
                toast.success('Bounce complete!')
              })
            })
          }}
        >
          <MoveVertical className="h-4 w-4 mr-2" />
          Bounce
        </Button>

        {/* Shake */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            const start = selectedObject.left || 0
            const shakeAmount = 20
            
            // Shake right
            animateProperty('left', start, start + shakeAmount, () => {
              // Shake left
              animateProperty('left', start + shakeAmount, start - shakeAmount, () => {
                // Shake right again
                animateProperty('left', start - shakeAmount, start + shakeAmount, () => {
                  // Back to center
                  animateProperty('left', start + shakeAmount, start, () => {
                    toast.success('Shake complete!')
                  })
                })
              })
            })
          }}
        >
          <MoveHorizontal className="h-4 w-4 mr-2" />
          Shake
        </Button>
      </div>

      <div className="rounded-md bg-blue-50 p-3">
        <p className="text-xs text-blue-800">
          💡 Tip: Adjust duration slider for faster or slower animations
        </p>
      </div>
    </div>
  )
}
