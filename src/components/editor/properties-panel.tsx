"use client"

import { Canvas, FabricObject } from "fabric"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

interface PropertiesPanelProps {
  canvas: Canvas | null
  selectedObject: FabricObject | null
  onSelectObject?: (obj: FabricObject) => void
  handleSaveAnimations: (animation: ObjectAnimation[]) => void
  animations: ObjectAnimation[]
  project: any
  handleCanvasDimensionsChange: (width: number, height: number) => void
}

export function PropertiesPanel({
  canvas,
  selectedObject,
  onSelectObject,
  handleSaveAnimations,
  animations,
  project,
  handleCanvasDimensionsChange,
}: PropertiesPanelProps) {
  const [show, setShow] = useState(false)

  const ModalOverlay = () => (
    <div className="w-12 border-r bg-white flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShow(!show)}
        >
          
          <ChevronLeft className="size-5" />
        </Button>
      </div>
  );


  return (
    <>
    {!show ? <ModalOverlay /> : <></>}
    <div className={cn("w-[320px] min-w-[320px] border-l bg-white flex flex-col h-full overflow-hidden transition-[margin-right] ease-in-out duration-500 z-40", show ? "mr-0":"mr-[-320px]")}>
           <div className="flex items-center justify-between px-2 border-b flex-shrink-0">
           <Button
              variant="ghost"
              size="icon"
              onClick={() => setShow(false)}
            >
              <ChevronRight className="size-5" />
            </Button>
           <h2 className="font-semibold">Tools</h2>
          </div>
      <Tabs defaultValue="layers" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 rounded-none border-b flex-shrink-0">
          <TabsTrigger value="layers">
            <Layers className="h-3 w-3 mr-1" />
            Layers
          </TabsTrigger>
          <TabsTrigger value="style">
            <Paintbrush className="h-3 w-3 mr-1" />
            Style
          </TabsTrigger>
          <TabsTrigger value="tools">
            <Wrench className="h-3 w-3 mr-1" />
            Tools
          </TabsTrigger>
          <TabsTrigger value="animate">
            <Play className="h-3 w-3 mr-1" />
            Animate
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          {/* LAYERS */}
          <TabsContent value="layers" className="h-full m-0">
            <LayersPanel
              canvas={canvas}
              selectedObject={selectedObject}
              onSelectObject={onSelectObject!}
            />
          </TabsContent>

          {/* STYLE */}
          <TabsContent value="style" className="h-full m-0">
            <ScrollArea className="h-full">
              {selectedObject?.type === "i-text" && (
                <TextStylePanel
                  canvas={canvas}
                  selectedObject={selectedObject as any}
                />
              )}
              <AdvancedStylePanel
                canvas={canvas}
                selectedObject={selectedObject}
              />
            </ScrollArea>
          </TabsContent>

          {/* TOOLS */}
          <TabsContent value="tools" className="h-full m-0">
            <ScrollArea className="h-full">
              <DrawingToolbar canvas={canvas} />
              <Separator className="my-4" />

              <div className="flex justify-between items-center p-4">
                <h3 className="font-semibold text-sm">Dimensions canva</h3>
                <CanvasSettings
                  canvas={canvas}
                  currentWidth={project?.width || 800}
                  currentHeight={project?.height || 600}
                  onDimensionsChange={handleCanvasDimensionsChange}
                />
              </div>
              <Separator className="my-4" />
              <div className="p-4 text-center text-sm text-gray-500">
                More tools coming soon...
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="animate" className="h-full m-0">
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
