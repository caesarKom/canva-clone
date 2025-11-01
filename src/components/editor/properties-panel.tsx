"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TextStylePanel } from "@/components/editor/text-style-panel"
import { DrawingToolbar } from "@/components/editor/drawing-toolbar"
import { AdvancedStylePanel } from "@/components/editor/advanced-style-panel"
import { LayersPanel } from "@/components/editor/layers-panel"
import { Separator } from "../ui/separator"
import { ObjectAnimation } from "@/types/animation"
import { AnimationPanelCombined } from "./animation-panel-combined"
import { ChevronLeft, ChevronRight, Layers, Paintbrush, Play, Wrench } from "lucide-react"
import { CanvasSettings } from "./canvas-settings"
import { useState } from "react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { useEditorStore } from "@/stores/editor-store"

interface PropertiesPanelProps {
  handleSaveAnimations: (animation: ObjectAnimation[]) => void
}

export function PropertiesPanel({
  handleSaveAnimations,
}: PropertiesPanelProps) {
  const { canvas, selectedObject, animations } = useEditorStore()
  const [show, setShow] = useState(false)

  return (
    <>
      {/* Toggle button when hidden */}
      {!show && (
        <div className="w-12 border-l bg-white flex flex-col items-center py-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShow(true)}
            title="Show Properties Panel"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Separator className="mt-4" />
          <div className="flex flex-col items-center justify-center h-full">
            <p>P</p>
            <p>R</p>
            <p>O</p>
            <p>P</p>
            <p>E</p>
            <p>R</p>
            <p>T</p>
            <p>I</p>
            <p>E</p>
            <p>S</p>
          </div>
        </div>
      )}

      {/* Main panel */}
      <div 
        className={cn(
          "w-[320px] min-w-[320px] border-l bg-white flex flex-col h-full overflow-hidden transition-transform ease-in-out duration-300",
          show ? "translate-x-0" : "translate-x-full absolute right-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2 border-b flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShow(false)}
            title="Hide Properties Panel"
          >
            <ChevronRight className="size-5" />
          </Button>
          <h2 className="font-semibold">Properties</h2>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="layers" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b flex-shrink-0">
            <TabsTrigger value="layers" className="text-xs">
              <Layers className="h-3 w-3 mr-1" />
              Layers
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs">
              <Paintbrush className="h-3 w-3 mr-1" />
              Style
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-xs">
              <Wrench className="h-3 w-3 mr-1" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="animate" className="text-xs">
              <Play className="h-3 w-3 mr-1" />
              Animate
            </TabsTrigger>
          </TabsList>

          {/* Tab content container */}
          <div className="flex-1 overflow-hidden relative">
            {/* LAYERS */}
            <TabsContent 
              value="layers" 
              className="absolute inset-0 m-0 data-[state=active]:flex data-[state=active]:flex-col"
            >
              <LayersPanel />
            </TabsContent>

            {/* STYLE */}
            <TabsContent 
              value="style" 
              className="absolute inset-0 m-0"
            >
              <div className="h-full overflow-y-auto">
                <div className="p-4 space-y-4">
                  {selectedObject?.type === "i-text" && (
                    <>
                      <TextStylePanel
                        canvas={canvas}
                        selectedObject={selectedObject as any}
                      />
                      <Separator />
                    </>
                  )}
                  <AdvancedStylePanel
                  />
                </div>
              </div>
            </TabsContent>

            {/* TOOLS */}
            <TabsContent 
              value="tools" 
              className="absolute inset-0 m-0"
            >
              <div className="h-full overflow-y-auto">
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Drawing Tools</h3>
                    <DrawingToolbar canvas={canvas} />
                  </div>
                  
                  <Separator />

                  <div>
                    <h3 className="font-semibold text-sm mb-2">Canvas Dimensions</h3>
                    <CanvasSettings />
                  </div>

                  <Separator />

                  <div className="text-center text-sm text-gray-500 py-4">
                    More tools coming soon...
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ANIMATE */}
            <TabsContent 
              value="animate" 
              className="absolute inset-0 m-0"
            >
              <AnimationPanelCombined
                canvas={canvas}
                selectedObject={selectedObject}
                onSaveAnimation={handleSaveAnimations}
                savedAnimations={animations}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  )
}
