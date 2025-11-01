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
  SlashIcon,
  Trash2,
  Star,
  ArrowBigRight,
  Check,
} from "lucide-react"
import { Line, IText, Color } from "fabric"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useEditorStore } from "@/stores/editor-store"
import {
  addArrow,
  addCheck,
  addCircle,
  addImageFromFile,
  addRectangle,
  addStar,
  addText,
  addTriangle,
  groupObjects,
  ungroupObjects,
} from "@/lib/fabric-utils"
import { Separator } from "../ui/separator"

export function SidebarApp() {
  const [show, setShow] = useState(false)
  const { canvas, selectedObject, setCanvasDimensions } = useEditorStore()

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
    {name:"Star", icon:Star,type:"star" as const, color: "#fbbf24"},
    {name:"Arrow", icon:ArrowBigRight,type:"arrow" as const, color: "#2563eb"},
    {name:"Check", icon:Check,type:"check" as const, color: "#10b981"},
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
    "#ffff00",
    "#c0c0c0",
    "#808080",
    "#00ff00",
    '#000080',
  ]

  const templates = [
    { name: "Social Post", width: 1080, height: 1080 },
    { name: "Story", width: 1080, height: 1920 },
    { name: "Banner", width: 1200, height: 628 },
    { name: "Presentation", width: 1920, height: 1080 },
  ]

  const handleQuickColor = (color: string) => {
    if (!canvas || !selectedObject) {
      console.warn("No canvas or selected object")
      return
    }

    selectedObject.set("fill", color)

    canvas.renderAll()
  }

  const handleAddShape = (type: "rect" | "circle" | "triangle"|"star"|"arrow"|"check") => {
    if (!canvas) {
      console.error("Canvas not available!")
      return
    }

    if (type === "rect") addRectangle(canvas)
    else if (type === "circle") addCircle(canvas)
    else if (type === "triangle") addTriangle(canvas)
      else if (type === "star") addStar(canvas)
    else if (type === "arrow") addArrow(canvas)
  else if (type === "check") addCheck(canvas)
  }

  const handleAddText = () => {
    if (!canvas) return
    addText(canvas)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !canvas) return

    addImageFromFile(canvas, file)
  }

  const deleteObject = () => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.remove(activeObject)
      canvas.renderAll()
    }
  }
  const addSymbol = (symbol:string, left:number, top:number, size:number) => {
    if (canvas) {
      const text = new IText(symbol, {left, top, fontSize: size,})
      canvas.add(text)
      canvas.setActiveObject(text)
      canvas.renderAll()
    }
  }

  return (
    <>
      {/* Toggle button when hidden */}
      {!show && (
        <div className="w-12 border-r bg-white flex flex-col items-center py-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShow(true)}
            title="Show Tools Panel"
          >
            <ChevronRight className="size-5 font-bold" />
          </Button>
          <Separator className="mt-4" />
          <div className="grid grid-cols-1 gap-2 mt-10 p-1">
            {predefinedShapes.map((shape) => {
              const Icon = shape.icon
              return (
                <Button
                  key={shape.name}
                  variant="outline"
                  className="h-auto flex-col gap-2 p-2"
                  onClick={() => handleAddShape(shape.type)}
                >
                  <Icon className="h-8 w-8" style={{ color: shape.color }} />
                </Button>
              )
            })}
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-2"
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
              <SlashIcon className="size-6" />
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-2"
              onClick={deleteObject}
            >
              <Trash2 className="size-6" />
            </Button>
          </div>
        </div>
      )}

      {/* Main panel */}
      <div
        className={cn(
          "w-[320px] min-w-[320px] border-r bg-white flex flex-col h-full overflow-hidden transition-all ease-in-out duration-300",
          show ? "translate-x-0" : "-translate-x-full absolute left-0 z-50"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2 border-b flex-shrink-0">
          <div className="w-10" /> {/* Spacer for centering */}
          <h2 className="font-semibold">Tools</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShow(false)}
            title="Hide Properties Panel"
          >
            <ChevronLeft className="size-5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="design"
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b flex-shrink-0">
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
                            setCanvasDimensions(template.width, template.height)
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
                        onClick={() => handleQuickColor(color)}
                        disabled={!selectedObject}
                        className={`w-8 h-8 rounded border-2 transition-all ${
                          selectedObject
                            ? "hover:scale-110 cursor-pointer"
                            : "opacity-30 cursor-not-allowed"
                        } ${
                          color === "#FFFFFF"
                            ? "border-gray-300"
                            : "border-gray-200"
                        }`}
                        style={{ backgroundColor: color }}
                        title={`Apply ${color}`}
                      />
                    ))}
                  </div>

                    {!selectedObject && (
                      <div className="flex justify-center w-full text-xs text-gray-400 text-center mt-2 px-1">
                        Select object
                      </div>
                    )}
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
                          onClick={() => handleAddShape(shape.type)}
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

                <div>
                  <h3 className="text-sm font-semibold mb-3">Groups</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="h-auto flex-col gap-2 p-4"
                      onClick={() => {
                        if (canvas) {
                          groupObjects(canvas)
                        }
                      }}
                    >
                      <span className="text-xs">Group</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col gap-2 p-4"
                      onClick={() => {
                        if (canvas) {
                          ungroupObjects(canvas)
                        }
                      }}
                    >
                      <span className="text-xs">Un Group</span>
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
                      onClick={() => handleAddText()}
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
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto p-4"
                      onClick={() => {
                        if (canvas) {
                          const text = new IText("Add a small text", {
                            left: 100,
                            top: 100,
                            fontSize: 10,
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
                        <div className="font-normal text-sm">
                          Add a small text
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Small text
                        </div>
                      </div>
                    </Button>

        <div className="grid grid-cols-5 gap-1">
          <Button
          variant="outline"
          onClick={() => addSymbol('❤️', 120, 220, 80)}
        >
          <span style={{ fontSize: 22 }} role="img" aria-label="heart">❤️</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => addSymbol('✨', 170, 280, 72)}
        >
          <span style={{ fontSize: 22 }} role="img" aria-label="spark">✨</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => addSymbol('•', 200, 300, 72)}
        >
          <span style={{ fontSize: 22 }} role="img" aria-label="dot">•</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => addSymbol('⟡', 200, 300, 72)}
        >
          <span style={{ fontSize: 22 }} role="img" aria-label="caro">⟡</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => addSymbol('ᩚ', 200, 300, 72)}
        >
          <span style={{ fontSize: 22 }} role="img" aria-label="rect">ᩚ</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => addSymbol('📞', 200, 300, 72)}
        >
          <span style={{ fontSize: 22 }} role="img" aria-label="tel">📞</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => addSymbol('⚠️', 200, 300, 72)}
        >
          <span style={{ fontSize: 22 }} role="img" aria-label="attention">⚠️</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => addSymbol('❌', 200, 300, 72)}
        >
          <span style={{ fontSize: 22 }} role="img" aria-label="cross">❌</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => addSymbol('❞', 160, 100, 72)}
        >
          <span style={{ fontSize: 22 }} role="img" aria-label="quotation marks">❞</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => addSymbol('➢', 200, 300, 72)}
        >
          <span style={{ fontSize: 22 }} role="img" aria-label="arrow-right">➢</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => addSymbol('═══════', 200, 200, 72)}
        >
          <span style={{ fontSize: 15 }} role="img" aria-label="duble line">════</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => addSymbol('━━━', 150, 180, 72)}
        >
          <span style={{ fontSize: 15 }} role="img" aria-label="duble line">━━━</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => addSymbol('🔔', 150, 180, 72)}
        >
          <span style={{ fontSize: 20 }} role="img" aria-label="bell">🔔</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => addSymbol('𝒾', 150, 180, 72)}
        >
          <span style={{ fontSize: 22 }} role="img" aria-label="info">𝒾</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => addSymbol('🖂', 150, 180, 72)}
        >
          <span style={{ fontSize: 22 }} role="img" aria-label="envlope">🖂</span>
        </Button>
        </div>
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
    </>
  )
}
