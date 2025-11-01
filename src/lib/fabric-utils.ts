"use client"

// ✅ Fabric.js v6
import {
  Canvas,
  Rect,
  Circle,
  Triangle,
  IText,
  FabricImage,
  ActiveSelection,
  FabricObject,
  Group,
  Path,
} from "fabric"

export const initializeFabric = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  width: number = 800,
  height: number = 600
): Canvas | null => {
  if (!canvasRef.current) return null
  const canvas = new Canvas(canvasRef.current, {
    width,
    height,
    backgroundColor: "#ffffff",
  })

  return canvas
}

export const addRectangle = (canvas: Canvas) => {
  const rect = new Rect({
    left: 100,
    top: 100,
    fill: "#3b82f6",
    width: 200,
    height: 100,
    cornerColor: "#3b82f6",
    cornerSize: 10,
    transparentCorners: false,
  })

  canvas.add(rect)
  canvas.setActiveObject(rect)
  canvas.renderAll()
}

export const addCircle = (canvas: Canvas) => {
  const circle = new Circle({
    left: 150,
    top: 150,
    radius: 75,
    fill: "#10b981",
    cornerColor: "#10b981",
    cornerSize: 10,
    transparentCorners: false,
  })

  canvas.add(circle)
  canvas.setActiveObject(circle)
  canvas.renderAll()
}

export const addTriangle = (canvas: Canvas) => {
  const triangle = new Triangle({
    left: 200,
    top: 100,
    width: 150,
    height: 150,
    fill: "#f59e0b",
    cornerColor: "#f59e0b",
    cornerSize: 10,
    transparentCorners: false,
  })

  canvas.add(triangle)
  canvas.setActiveObject(triangle)
  canvas.renderAll()
}

export const addStar = (canvas: Canvas) => {
  const star = new Path(
    "M12 2 L15 8 L22 9 L17 14 L18 21 L12 18 L6 21 L7 14 L2 9 L9 8 Z",
    { left: 90, top: 80, fill: "#fbbf24", scaleX: 4, scaleY: 4 }
  )
  canvas.add(star)
  canvas.setActiveObject(star)
  canvas.renderAll()
}

export const addArrow = (canvas: Canvas) => {
  const arrow = new Path("M2 12h14M12 6l6 6-6 6", {
    left: 100,
    top: 170,
    fill: "",
    stroke: "#2563eb",
    strokeWidth: 6,
    scaleX: 3,
    scaleY: 3,
  })
  canvas.add(arrow)
  canvas.setActiveObject(arrow)
  canvas.renderAll()
}

export const addCheck = (canvas: Canvas) => {
  const check = new Path("M5 13l4 4L19 7", {
    left: 80,
    top: 240,
    fill: "",
    stroke: "#10b981",
    strokeWidth: 8,
    scaleX: 4,
    scaleY: 4,
    strokeLineCap: "round",
    strokeLineJoin: "round",
  })
  canvas.add(check)
  canvas.setActiveObject(check)
  canvas.renderAll()
}

export const addText = (canvas: Canvas, text: string = "Add a heading") => {
  const textObject = new IText(text, {
    left: 100,
    top: 100,
    fontSize: 32,
    fontWeight: "bold",
    fill: "#000000",
    fontFamily: "Arial",
  })

  canvas.add(textObject)
  canvas.setActiveObject(textObject)
  canvas.renderAll()
}

export const addImageFromFile = (canvas: Canvas, file: File) => {
  const reader = new FileReader()

  reader.onload = (e) => {
    const imgUrl = e.target?.result as string

    FabricImage.fromURL(imgUrl).then((img) => {
      img.scaleToWidth(300)
      img.set({
        left: 100,
        top: 100,
      })
      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()
    })
  }

  reader.readAsDataURL(file)
}

export const deleteObject = (canvas: Canvas) => {
  const activeObject = canvas.getActiveObject()
  if (activeObject) {
    canvas.remove(activeObject)
    canvas.renderAll()
  }
}

export const changeColor = (canvas: Canvas, color: string) => {
  const activeObject = canvas.getActiveObject()
  if (activeObject) {
    activeObject.set("fill", color)
    canvas.renderAll()
  }
}

export const exportToJSON = (canvas: Canvas): string => {
  try {
    const json = canvas.toJSON()

    const data = {
      ...json,
      width: canvas.width,
      height: canvas.height,
    }

    const result = JSON.stringify(data)

    return result
  } catch (error) {
    console.error("❌ Error in exportToJSON:", error)
    return "{}"
  }
}

export const loadFromJSON = async (canvas: Canvas, jsonData: string | object): Promise<boolean> => {
  if (!canvas) return false

  try {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData

    const targetWidth = canvas.width || 800
    const targetHeight = canvas.height || 600

    delete data.width
    delete data.height

    const canvasElement = canvas.getElement()
    if (!canvasElement) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return loadFromJSON(canvas, jsonData)
    }

    await canvas.loadFromJSON(data)
    canvas.set({ width: targetWidth, height: targetHeight })

    canvasElement.width = targetWidth
    canvasElement.height = targetHeight

    canvas.renderAll()

    return true
  } catch (err) {
    console.error('❌ Error loading JSON into canvas:', err)
    return false
  }
}

export const exportToPNG = (canvas: Canvas): string => {
  return canvas.toDataURL({
    format: "png",
    quality: 1,
    multiplier: 1,
  })
}

// Optional: function to export in higher resolution
export const exportToHighResPNG = (
  canvas: Canvas,
  scale: number = 2
): string => {
  return canvas.toDataURL({
    format: "png",
    quality: 1,
    multiplier: scale, // 2 = 2x resolution, 3 = 3x itd.
  })
}

// Group objects
export const groupObjects = (canvas: Canvas) => {
  const activeSelection = canvas.getActiveObject()

  if (!activeSelection) {
    console.log("No object selected")
    return
  }

  // Check if it's multiple selection
  if (activeSelection.type === "activeSelection") {
    const selection = activeSelection as ActiveSelection
    const selectedObjects = selection.getObjects()

    // Delete active selection
    canvas.discardActiveObject()

    // Create a group of selected objects
    const group = new Group(selectedObjects, {
      left: activeSelection.left,
      top: activeSelection.top,
    })

    // Delete original objects
    selectedObjects.forEach((obj) => canvas.remove(obj))

    // Add Group
    canvas.add(group)
    canvas.setActiveObject(group)
    canvas.renderAll()

    console.log("Objects grouped successfully")
  } else {
    console.log("Select multiple objects to group")
  }
}

// Ungroup objects
export const ungroupObjects = (canvas: Canvas) => {
  const activeObject = canvas.getActiveObject()

  if (!activeObject || activeObject.type !== "group") {
    console.log("Select a group to ungroup")
    return
  }

  const group = activeObject as Group
  const items = group.getObjects()

  canvas.remove(group)

  items.forEach((item) => {
    const left = (group.left || 0) + (item.left || 0)
    const top = (group.top || 0) + (item.top || 0)

    item.set({
      left: left,
      top: top,
    })

    canvas.add(item)
  })

  const selection = new ActiveSelection(items, { canvas })
  canvas.setActiveObject(selection)
  canvas.renderAll()

  console.log("Group ungrouped successfully")
}

// Bring to front
export const bringToFront = (canvas: Canvas) => {
  const activeObject = canvas.getActiveObject()
  if (activeObject) {
    canvas.bringObjectToFront(activeObject)
    canvas.renderAll()
  }
}

// Send to back
export const sendToBack = (canvas: Canvas) => {
  const activeObject = canvas.getActiveObject()
  if (activeObject) {
    canvas.sendObjectToBack(activeObject)
    canvas.renderAll()
  }
}

// Bring forward
export const bringForward = (canvas: Canvas) => {
  const activeObject = canvas.getActiveObject()
  if (activeObject) {
    canvas.bringObjectForward(activeObject)
    canvas.renderAll()
  }
}

// Send backward
export const sendBackward = (canvas: Canvas) => {
  const activeObject = canvas.getActiveObject()
  if (activeObject) {
    canvas.sendObjectBackwards(activeObject)
    canvas.renderAll()
  }
}

// Duplicate object
export const duplicateObject = (canvas: Canvas) => {
  const activeObject = canvas.getActiveObject()
  if (!activeObject) return

  activeObject.clone().then((cloned: FabricObject) => {
    cloned.set({
      left: (activeObject.left || 0) + 10,
      top: (activeObject.top || 0) + 10,
    })
    canvas.add(cloned)
    canvas.setActiveObject(cloned)
    canvas.renderAll()
  })
}

// Align objects
export const alignObjects = (
  canvas: Canvas,
  alignment: "left" | "center" | "right" | "top" | "middle" | "bottom"
) => {
  const activeObject = canvas.getActiveObject()
  if (!activeObject) return

  const canvasWidth = canvas.width || 800
  const canvasHeight = canvas.height || 600

  switch (alignment) {
    case "left":
      activeObject.set({ left: 0 })
      break
    case "center":
      activeObject.set({ left: (canvasWidth - (activeObject.width || 0)) / 2 })
      break
    case "right":
      activeObject.set({ left: canvasWidth - (activeObject.width || 0) })
      break
    case "top":
      activeObject.set({ top: 0 })
      break
    case "middle":
      activeObject.set({ top: (canvasHeight - (activeObject.height || 0)) / 2 })
      break
    case "bottom":
      activeObject.set({ top: canvasHeight - (activeObject.height || 0) })
      break
  }

  canvas.renderAll()
}

// Lock/Unlock object
export const toggleLock = (obj: FabricObject) => {
  const isLocked = !obj.selectable
  obj.set({
    selectable: isLocked,
    evented: isLocked,
    lockMovementX: !isLocked,
    lockMovementY: !isLocked,
    lockRotation: !isLocked,
    lockScalingX: !isLocked,
    lockScalingY: !isLocked,
  })
}

export const animateObjectSmooth = (
  obj: FabricObject,
  property: string,
  targetValue: number,
  duration: number = 1000,
  onComplete?: () => void
) => {
  const canvas = obj.canvas
  if (!canvas) return

  const startValue = (obj as any)[property] || 0
  const startTime = Date.now()
  const diff = targetValue - startValue

  const step = () => {
    const now = Date.now()
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (ease-in-out cubic)
    const easedProgress =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2

    const currentValue = startValue + diff * easedProgress

    obj.set(property as any, currentValue)
    canvas.renderAll()

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      onComplete?.()
    }
  }

  requestAnimationFrame(step)
}

// ✅ Multiple properties animation
export const animateObjectMultiple = (
  obj: FabricObject,
  animations: Record<string, number>,
  duration: number = 1000,
  onComplete?: () => void
) => {
  const canvas = obj.canvas
  if (!canvas) return

  const startValues: Record<string, number> = {}
  const diffs: Record<string, number> = {}

  // Prepare starting values
  Object.keys(animations).forEach((key) => {
    startValues[key] = (obj as any)[key] || 0
    diffs[key] = animations[key] - startValues[key]
  })

  const startTime = Date.now()

  const step = () => {
    const now = Date.now()
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing
    const easedProgress =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2

    // Update all properties
    Object.keys(animations).forEach((key) => {
      const currentValue = startValues[key] + diffs[key] * easedProgress
      obj.set(key as any, currentValue)
    })

    canvas.renderAll()

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      onComplete?.()
    }
  }

  requestAnimationFrame(step)
}
