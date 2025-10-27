'use client'

import { useState } from 'react'
import { Canvas, FabricObject } from 'fabric'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, RotateCw, MoveHorizontal, MoveVertical, 
  Maximize, Minimize, Zap 
} from 'lucide-react'
import { toast } from 'sonner'
import { AnimationBuilder } from '@/components/editor/animation-builder'
import { ObjectAnimation } from '@/types/animation'

interface AnimationPanelCombinedProps {
  canvas: Canvas | null
  selectedObject: FabricObject | null
  onSaveAnimation: (animations: ObjectAnimation[]) => void
  savedAnimations?: ObjectAnimation[]
}

export function AnimationPanelCombined({ 
  canvas, 
  selectedObject,
  onSaveAnimation,
  savedAnimations = []
}: AnimationPanelCombinedProps) {
  const [duration, setDuration] = useState(1000)

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
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2

      selectedObject.set(property as any, startValue + diff * easedProgress)
      canvas.renderAll()

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        onComplete?.()
      }
    }

    requestAnimationFrame(step)
  }

  // Quick animations (dla szybkiego testowania)
  const quickAnimations = [
    {
      name: 'Move Right',
      icon: MoveHorizontal,
      action: () => {
        const start = selectedObject?.left || 0
        animateProperty('left', start, start + 100, () => toast.success('Done!'))
      }
    },
    {
      name: 'Move Left',
      icon: MoveHorizontal,
      iconClass: 'rotate-180',
      action: () => {
        const start = selectedObject?.left || 0
        animateProperty('left', start, start - 100, () => toast.success('Done!'))
      }
    },
    {
      name: 'Move Down',
      icon: MoveVertical,
      action: () => {
        const start = selectedObject?.top || 0
        animateProperty('top', start, start + 100, () => toast.success('Done!'))
      }
    },
    {
      name: 'Move Up',
      icon: MoveVertical,
      iconClass: 'rotate-180',
      action: () => {
        const start = selectedObject?.top || 0
        animateProperty('top', start, start - 100, () => toast.success('Done!'))
      }
    },
    {
      name: 'Rotate 360°',
      icon: RotateCw,
      action: () => {
        const start = selectedObject?.angle || 0
        animateProperty('angle', start, start + 360, () => toast.success('Done!'))
      }
    },
    {
      name: 'Scale Up',
      icon: Maximize,
      action: () => {
        const startX = selectedObject?.scaleX || 1
        const startY = selectedObject?.scaleY || 1
        animateProperty('scaleX', startX, startX * 1.5)
        animateProperty('scaleY', startY, startY * 1.5, () => toast.success('Done!'))
      }
    },
    {
      name: 'Scale Down',
      icon: Minimize,
      action: () => {
        const startX = selectedObject?.scaleX || 1
        const startY = selectedObject?.scaleY || 1
        animateProperty('scaleX', startX, startX * 0.7)
        animateProperty('scaleY', startY, startY * 0.7, () => toast.success('Done!'))
      }
    },
    {
      name: 'Fade In/Out',
      icon: Play,
      action: () => {
        animateProperty('opacity', 1, 0, () => {
          animateProperty('opacity', 0, 1, () => toast.success('Done!'))
        })
      }
    },
    {
      name: 'Pulse',
      icon: Zap,
      action: () => {
        const startX = selectedObject?.scaleX || 1
        const startY = selectedObject?.scaleY || 1
        animateProperty('scaleX', startX, startX * 1.2)
        animateProperty('scaleY', startY, startY * 1.2, () => {
          animateProperty('scaleX', startX * 1.2, startX)
          animateProperty('scaleY', startY * 1.2, startY, () => toast.success('Done!'))
        })
      }
    },
    {
      name: 'Shake',
      icon: MoveHorizontal,
      action: () => {
        const start = selectedObject?.left || 0
        animateProperty('left', start, start + 10, () => {
          animateProperty('left', start + 10, start - 10, () => {
            animateProperty('left', start - 10, start, () => toast.success('Done!'))
          })
        })
      }
    },
  ]

  return (
    <Tabs defaultValue="quick" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="quick">
          <Zap className="h-3 w-3 mr-1" />
          Quick
        </TabsTrigger>
        <TabsTrigger value="builder">
          <Play className="h-3 w-3 mr-1" />
          Builder
        </TabsTrigger>
      </TabsList>

      {/* QUICK ANIMATIONS TAB */}
      <TabsContent value="quick" className="mt-0">
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="p-4 space-y-4">
            {!selectedObject ? (
              <div className="text-center py-8 text-sm text-gray-500">
                Select an object to animate
              </div>
            ) : (
              <>
                <div>
                  <Label className="text-xs">Animation Speed: {duration}ms</Label>
                  <Slider
                    value={[duration]}
                    onValueChange={(v) => setDuration(v[0])}
                    min={100}
                    max={3000}
                    step={100}
                    className="mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs block mb-2">Quick Animations</Label>
                  {quickAnimations.map((anim, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={anim.action}
                    >
                      <anim.icon className={`h-4 w-4 mr-2 ${anim.iconClass || ''}`} />
                      {anim.name}
                    </Button>
                  ))}
                </div>

                <div className="rounded-md bg-blue-50 p-3">
                  <p className="text-xs text-blue-800">
                    ⚡ Quick animations for testing. Use Builder tab for custom sequences.
                  </p>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </TabsContent>

      {/* ANIMATION BUILDER TAB */}
      <TabsContent value="builder" className="mt-0">
        <AnimationBuilder
          canvas={canvas}
          selectedObject={selectedObject}
          onSaveAnimation={onSaveAnimation}
          savedAnimations={savedAnimations}
        />
      </TabsContent>
    </Tabs>
  )
}
