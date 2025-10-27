'use client'

import { useState, useEffect } from 'react'
import { Canvas, FabricObject } from 'fabric'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Plus, Play, Trash2, Save, Edit2, Copy, Pause, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { ObjectAnimation, AnimationKeyframe } from '@/types/animation'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AnimationBuilderProps {
  canvas: Canvas | null
  selectedObject: FabricObject | null
  onSaveAnimation: (animations: ObjectAnimation[]) => void
  savedAnimations?: ObjectAnimation[]
}

export function AnimationBuilder({ 
  canvas, 
  selectedObject,
  onSaveAnimation,
  savedAnimations = []
}: AnimationBuilderProps) {
  const [animations, setAnimations] = useState<ObjectAnimation[]>(savedAnimations)
  const [editingAnimation, setEditingAnimation] = useState<ObjectAnimation | null>(null)
  const [animationName, setAnimationName] = useState('')
  const [duration, setDuration] = useState(1000)
  const [loop, setLoop] = useState(false)
  const [delay, setDelay] = useState(0)
  const [keyframes, setKeyframes] = useState<AnimationKeyframe[]>([])
  const [selectedKeyframe, setSelectedKeyframe] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playingAnimation, setPlayingAnimation] = useState<string | null>(null)

  // Synchronizuj z saved animations
  useEffect(() => {
    setAnimations(savedAnimations)
  }, [savedAnimations])

  // Pobierz ID obiektu
  const getObjectId = (obj: FabricObject): string => {
    if (!canvas) return ''
    const objects = canvas.getObjects()
    const index = objects.indexOf(obj)
    return `object-${index}`
  }

  // Dodaj keyframe z aktualnym stanem obiektu
  const addKeyframe = () => {
    if (!selectedObject) {
      toast.error('Select an object first')
      return
    }

    const time = keyframes.length === 0 ? 0 : keyframes[keyframes.length - 1].time + 500

    const newKeyframe: AnimationKeyframe = {
      time,
      properties: {
        left: selectedObject.left || 0,
        top: selectedObject.top || 0,
        angle: selectedObject.angle || 0,
        scaleX: selectedObject.scaleX || 1,
        scaleY: selectedObject.scaleY || 1,
        opacity: selectedObject.opacity !== undefined ? selectedObject.opacity : 1,
      },
      easing: 'ease-in-out',
    }

    setKeyframes([...keyframes, newKeyframe])
    toast.success(`Keyframe ${keyframes.length + 1} added at ${time}ms`)
  }

  // Edytuj keyframe
  const updateKeyframe = (index: number, property: string, value: number) => {
    const updated = [...keyframes]
    updated[index].properties[property] = value
    setKeyframes(updated)
  }

  // Usuń keyframe
  const removeKeyframe = (index: number) => {
    setKeyframes(keyframes.filter((_, i) => i !== index))
    setSelectedKeyframe(null)
    toast.success('Keyframe removed')
  }

  // Zastosuj keyframe do obiektu (preview)
  const applyKeyframe = (index: number) => {
    if (!selectedObject) return
    
    const kf = keyframes[index]
    Object.entries(kf.properties).forEach(([key, value]) => {
      selectedObject.set(key as any, value)
    })
    canvas?.renderAll()
    setSelectedKeyframe(index)
  }

  // Zapisz nową animację
  const saveAnimation = () => {
    if (!selectedObject) {
      toast.error('Select an object')
      return
    }

    if (!animationName.trim()) {
      toast.error('Enter animation name')
      return
    }

    if (keyframes.length < 2) {
      toast.error('Add at least 2 keyframes')
      return
    }

    const newAnimation: ObjectAnimation = {
      objectId: getObjectId(selectedObject),
      name: animationName,
      duration,
      loop,
      delay,
      keyframes,
    }

    let updated: ObjectAnimation[]

    if (editingAnimation) {
      // Update existing
      updated = animations.map(a => 
        a.name === editingAnimation.name ? newAnimation : a
      )
      toast.success(`Animation "${animationName}" updated!`)
    } else {
      // Add new
      updated = [...animations, newAnimation]
      toast.success(`Animation "${animationName}" created!`)
    }

    setAnimations(updated)
    onSaveAnimation(updated)
    
    // Reset form
    resetForm()
  }

  // Reset formularz
  const resetForm = () => {
    setAnimationName('')
    setDuration(1000)
    setLoop(false)
    setDelay(0)
    setKeyframes([])
    setEditingAnimation(null)
    setSelectedKeyframe(null)
  }

  // Załaduj animację do edycji
  const loadAnimationForEdit = (animation: ObjectAnimation) => {
    setEditingAnimation(animation)
    setAnimationName(animation.name)
    setDuration(animation.duration)
    setLoop(animation.loop)
    setDelay(animation.delay)
    setKeyframes([...animation.keyframes])
    toast.info(`Editing "${animation.name}"`)
  }

  // Duplikuj animację
  const duplicateAnimation = (animation: ObjectAnimation) => {
    const newAnimation = {
      ...animation,
      name: `${animation.name} (Copy)`,
    }
    const updated = [...animations, newAnimation]
    setAnimations(updated)
    onSaveAnimation(updated)
    toast.success('Animation duplicated')
  }

  // Usuń animację
  const deleteAnimation = (name: string) => {
    const updated = animations.filter(a => a.name !== name)
    setAnimations(updated)
    onSaveAnimation(updated)
    toast.success('Animation deleted')
  }

  // Odtwórz animację
  const playAnimation = (animation: ObjectAnimation) => {
    if (!canvas || isPlaying) return

    const objects = canvas.getObjects()
    const objectIndex = parseInt(animation.objectId.replace('object-', ''))
    const obj = objects[objectIndex]

    if (!obj) {
      toast.error('Object not found on canvas')
      return
    }

    setIsPlaying(true)
    setPlayingAnimation(animation.name)

    let currentKeyframeIndex = 0
    let animationStopped = false

    const animate = () => {
      if (animationStopped || currentKeyframeIndex >= animation.keyframes.length - 1) {
        if (animation.loop && !animationStopped) {
          currentKeyframeIndex = 0
          setTimeout(animate, animation.delay)
        } else {
          setIsPlaying(false)
          setPlayingAnimation(null)
          toast.success('Animation finished')
        }
        return
      }

      const currentKf = animation.keyframes[currentKeyframeIndex]
      const nextKf = animation.keyframes[currentKeyframeIndex + 1]
      const segmentDuration = nextKf.time - currentKf.time

      // Animuj wszystkie właściwości
      Object.keys(nextKf.properties).forEach(prop => {
        const startValue = currentKf.properties[prop]
        const endValue = nextKf.properties[prop]
        
        animateProperty(obj, prop, startValue, endValue, segmentDuration, nextKf.easing || 'ease-in-out')
      })

      currentKeyframeIndex++
      setTimeout(animate, segmentDuration)
    }

    setTimeout(() => {
      if (!animationStopped) {
        animate()
      }
    }, animation.delay)

    // Auto stop function
    return () => {
      animationStopped = true
      setIsPlaying(false)
      setPlayingAnimation(null)
    }
  }

  // Stop animation
  const stopAnimation = () => {
    setIsPlaying(false)
    setPlayingAnimation(null)
    toast.info('Animation stopped')
  }

  // Helper - animuj property
  const animateProperty = (
    obj: FabricObject,
    property: string,
    startValue: number,
    endValue: number,
    duration: number,
    easing: string
  ) => {
    const startTime = Date.now()
    const diff = endValue - startValue

    const easingFunctions: Record<string, (t: number) => number> = {
      'linear': (t) => t,
      'ease-in': (t) => t * t,
      'ease-out': (t) => t * (2 - t),
      'ease-in-out': (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    }

    const easeFn = easingFunctions[easing] || easingFunctions['ease-in-out']

    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeFn(progress)

      obj.set(property as any, startValue + diff * eased)
      canvas?.renderAll()

      if (progress < 1 && !isPlaying) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }

  if (!selectedObject) {
    return (
      <div className="p-4 space-y-4">
        <div className="text-center text-sm text-gray-500 py-8">
          <p className="mb-2">Select an object to create animations</p>
        </div>

        {animations.length > 0 && (
          <div>
            <Label className="text-xs mb-2 block">All Animations ({animations.length})</Label>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {animations.map((anim, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">{anim.name}</div>
                    <div className="text-xs text-gray-500">
                      {anim.duration}ms · {anim.keyframes.length} keyframes
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="create" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 rounded-none border-b flex-shrink-0">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="saved">Saved ({animations.length})</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          {/* CREATE TAB */}
          <TabsContent value="create" className="m-0 p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">
                  {editingAnimation ? 'Edit Animation' : 'New Animation'}
                </h3>
                {editingAnimation && (
                  <Button size="sm" variant="ghost" onClick={resetForm}>
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
              <div>
                <Label className="text-xs">Animation Name</Label>
                <Input
                  value={animationName}
                  onChange={(e) => setAnimationName(e.target.value)}
                  placeholder="e.g. Slide In, Bounce, Fade"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs">Total Duration: {duration}ms</Label>
                <Slider
                  value={[duration]}
                  onValueChange={(v) => setDuration(v[0])}
                  min={100}
                  max={10000}
                  step={100}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-xs">Start Delay: {delay}ms</Label>
                <Slider
                  value={[delay]}
                  onValueChange={(v) => setDelay(v[0])}
                  min={0}
                  max={5000}
                  step={100}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Loop Animation</Label>
                <Switch checked={loop} onCheckedChange={setLoop} />
              </div>
            </div>

            {/* Keyframes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs">Keyframes ({keyframes.length})</Label>
                <Button size="sm" variant="outline" onClick={addKeyframe}>
                  <Plus className="h-3 w-3 mr-1" />
                  Capture
                </Button>
              </div>

              <div className="text-xs text-gray-500 mb-2">
                Position object, then click Capture to add keyframe
              </div>

              {keyframes.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400 border-2 border-dashed rounded">
                  No keyframes yet.<br/>
                  Position your object and click Capture
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-2">
                  {keyframes.map((kf, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`kf-${index}`}
                      className={`border rounded ${selectedKeyframe === index ? 'border-blue-500' : ''}`}
                    >
                      <AccordionTrigger className="px-3 py-2 hover:no-underline">
                        <div className="flex items-center justify-between w-full text-xs">
                          <span className="font-medium">Keyframe {index + 1}</span>
                          <span className="text-gray-500">{kf.time}ms</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-3 pb-3 space-y-2">
                        {/* Time */}
                        <div>
                          <Label className="text-xs">Time: {kf.time}ms</Label>
                          <Slider
                            value={[kf.time]}
                            onValueChange={(v) => {
                              const updated = [...keyframes]
                              updated[index].time = v[0]
                              setKeyframes(updated)
                            }}
                            min={0}
                            max={duration}
                            step={50}
                            className="mt-1"
                          />
                        </div>

                        {/* Easing */}
                        <div>
                          <Label className="text-xs">Easing</Label>
                          <Select
                            value={kf.easing}
                            onValueChange={(v) => {
                              const updated = [...keyframes]
                              updated[index].easing = v as any
                              setKeyframes(updated)
                            }}
                          >
                            <SelectTrigger className="h-8 text-xs mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="linear">Linear</SelectItem>
                              <SelectItem value="ease-in">Ease In</SelectItem>
                              <SelectItem value="ease-out">Ease Out</SelectItem>
                              <SelectItem value="ease-in-out">Ease In-Out</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Properties */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>X: {kf.properties.left?.toFixed(0)}</div>
                          <div>Y: {kf.properties.top?.toFixed(0)}</div>
                          <div>Rotation: {kf.properties.angle?.toFixed(0)}°</div>
                          <div>Scale: {kf.properties.scaleX?.toFixed(2)}</div>
                          <div>Opacity: {kf.properties.opacity?.toFixed(2)}</div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-8 text-xs"
                            onClick={() => applyKeyframe(index)}
                          >
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8"
                            onClick={() => removeKeyframe(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>

            {/* Save Button */}
            <Button 
              className="w-full" 
              onClick={saveAnimation}
              disabled={!animationName.trim() || keyframes.length < 2}
            >
              <Save className="h-4 w-4 mr-2" />
              {editingAnimation ? 'Update Animation' : 'Save Animation'}
            </Button>
          </TabsContent>

          {/* SAVED TAB */}
          <TabsContent value="saved" className="m-0 p-4 space-y-3">
            {animations.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500">
                No saved animations yet
              </div>
            ) : (
              animations.map((anim, index) => (
                <div key={index} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{anim.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {anim.duration}ms · {anim.keyframes.length} keyframes
                        {anim.loop && ' · Loop'}
                        {anim.delay > 0 && ` · Delay ${anim.delay}ms`}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    <Button
                      size="sm"
                      variant="default"
                      className="h-8"
                      onClick={() => playAnimation(anim)}
                      disabled={isPlaying && playingAnimation === anim.name}
                    >
                      {isPlaying && playingAnimation === anim.name ? (
                        <>
                          <Pause className="h-3 w-3 mr-1" />
                          Playing
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Play
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                      onClick={() => loadAnimationForEdit(anim)}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                      onClick={() => duplicateAnimation(anim)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Duplicate
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8"
                      onClick={() => deleteAnimation(anim.name)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}

            {isPlaying && (
              <Button
                variant="outline"
                className="w-full"
                onClick={stopAnimation}
              >
                <Pause className="h-4 w-4 mr-2" />
                Stop All Animations
              </Button>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
