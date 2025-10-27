"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Square,
  Circle,
  Triangle,
  Type,
  Image as ImageIcon,
  Shapes,
  Palette,
  Upload,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { Canvas, Line, IText } from "fabric"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  canvas: Canvas | null
  onAddShape: (type: "rect" | "circle" | "triangle") => void
  onAddText: () => void
  onAddImage: (file: File) => void
}

export function SidebarApp({
  canvas,
  onAddShape,
  onAddText,
  onAddImage,
}: SidebarProps) {
  const [show, setShow] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onAddImage(file)
    }
  }

  const ModalOverlay = () => (
    <div className="w-12 border-r bg-white flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShow(!show)}
        >
          <ChevronRight className="size-5" />
        </Button>
        <p className="[writing-mode:vertical-lr] text-2xl">TOOLS</p>
      </div>
  );

  const predefinedShapes = [
    {
      name: "Rectangle",
      icon: Square,
      type: "rect" as const,
      color: "#3b82f6",
    },
    { name: "Circle", icon: Circle, type: "circle" as const, color: "#10b981" },
    {
      name: "Triangle",
      icon: Triangle,
      type: "triangle" as const,
      color: "#f59e0b",
    },
  ]

  const predefinedColors = [
    "#000000",
    "#ffffff",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
  ]

  const templates = [
    { name: "Social Post", width: 1080, height: 1080 },
    { name: "Story", width: 1080, height: 1920 },
    { name: "Banner", width: 1200, height: 628 },
    { name: "Presentation", width: 1920, height: 1080 },
  ]

  return (
    <>
     <div className={cn("w-[320px] min-w-[320px] border-r bg-white flex flex-col h-full overflow-hidden transition-[margin-left] ease-in-out duration-500 z-40", show ? "ml-0":"ml-[-320px]")}>
       <div className="flex items-center justify-between px-2 border-b flex-shrink-0">
       <h2 className="font-semibold">Tools</h2>
       <Button
          variant="ghost"
          size="icon"
          onClick={() => setShow(false)}
        >
          <ChevronLeft className="size-5" />
        </Button>
      </div>

        <Tabs defaultValue="design" className="flex-1 flex flex-col h-full">
       <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
         <TabsTrigger value="design" className="gap-1">
             <Sparkles className="h-4 w-4" />
           <span className="hidden sm:inline text-xs">Design</span>
        </TabsTrigger>
         <TabsTrigger value="elements" className="gap-1">
          <Shapes className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Elements</span>
        </TabsTrigger>
         <TabsTrigger value="text" className="gap-1">
           <Type className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Text</span>
         </TabsTrigger>
         <TabsTrigger value="uploads" className="gap-1">
           <Upload className="h-4 w-4" />
           <span className="hidden sm:inline text-xs">Upload</span>
      </TabsTrigger>
       </TabsList>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="flex-1">
           <TabsContent value="design" className="p-4 space-y-4 mt-0">
            <div>
                <h3 className="text-sm font-semibold mb-3">Templates</h3>
               <div className="grid grid-cols-2 gap-2">
                 {templates.map((template) => (
                    <Button
                      key={template.name}
                      variant="outline"
                      className="h-auto flex-col items-start p-3"
                      onClick={() => {
                        if (canvas) {
                          canvas.set({
                            width: template.width,
                            height: template.height
                          })
                          canvas.renderAll()
                        }
                      }}
                    >
                      <div className="w-full aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded mb-2" />
                      <span className="text-xs font-medium">
                        {template.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {template.width} × {template.height}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Quick Colors</h3>
                <div className="grid grid-cols-5 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      className="w-full aspect-square rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        if (canvas) {
                          canvas.backgroundColor = color
                          canvas.renderAll()
                        }
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="elements" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-semibold mb-3">Shapes</h3>
                <div className="grid grid-cols-3 gap-2">
                  {predefinedShapes.map((shape) => {
                    const Icon = shape.icon
                    return (
                      <Button
                        key={shape.name}
                        variant="outline"
                        className="h-auto flex-col gap-2 p-4"
                        onClick={() => onAddShape(shape.type)}
                      >
                        <Icon
                          className="h-8 w-8"
                          style={{ color: shape.color }}
                        />
                        <span className="text-xs">{shape.name}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Lines</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => {
                      if (canvas) {
                        const line = new Line([50, 100, 200, 100], {
                          stroke: "#000000",
                          strokeWidth: 2,
                        })
                        canvas.add(line)
                        canvas.renderAll()
                      }
                    }}
                  >
                    <div className="h-8 w-full border-t-2 border-black" />
                    <span className="text-xs">Line</span>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="text" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-semibold mb-3">Add Text</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4"
                    onClick={() => onAddText()}
                  >
                    <div className="text-left">
                      <div className="font-bold text-2xl">Add a heading</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Large bold text
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4"
                    onClick={() => {
                      if (canvas) {
                        const text = new IText("Add a subheading", {
                          left: 100,
                          top: 100,
                          fontSize: 20,
                          fill: "#000000",
                          fontFamily: "Arial",
                        })
                        canvas.add(text)
                        canvas.setActiveObject(text)
                        canvas.renderAll()
                      }
                    }}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-lg">
                        Add a subheading
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Medium text
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="uploads" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-semibold mb-3">Upload Images</h3>
                <Label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or GIF</p>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Label>
              </div>
            </TabsContent>
          </ScrollArea>
        </div>
      </Tabs>
      </div>
{!show ? <ModalOverlay /> : <></>}
    </>
  )
}
