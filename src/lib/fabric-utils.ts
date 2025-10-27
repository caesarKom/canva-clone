"use client"

// ✅ Fabric.js v6
import {
  Canvas,
  Rect,
  Circle,
  Triangle,
  IText,
  Line,
  FabricImage,
  ActiveSelection,
  FabricObject,
  Group,
} from "fabric"

export const initializeFabric = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  width: number = 800,
  height: number = 600
): Canvas | null => {
  if (!canvasRef.current) return null
console.log('🔧 Creating Fabric canvas:', width, height) // ✅ Debug
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
  const json = canvas.toJSON()
  
  const data = {
    ...json,
    width: canvas.width,
    height: canvas.height,
  }
  console.log('💾 Exporting canvas with dimensions:', data.width, data.height)
  return JSON.stringify(data)
}

export const loadFromJSON = async (canvas: Canvas, jsonData: string): Promise<boolean> => {
  if (!canvas) {
    console.error('❌ Canvas is null')
    return false
  }

  try {
    const data = JSON.parse(jsonData)
    
    // Zachowaj wymiary
    const targetWidth = canvas.width || 800
    const targetHeight = canvas.height || 600
    
    console.log('📦 Loading canvas data...')
    
    // Usuń wymiary z JSON
    delete data.width
    delete data.height
    
    // Sprawdź czy canvas element istnieje
    const canvasElement = canvas.getElement()
    if (!canvasElement) {
      console.warn('⚠️ Canvas element not ready, retrying...')
      await new Promise(resolve => setTimeout(resolve, 100))
      return loadFromJSON(canvas, jsonData)
    }
    
    try {
      // Załaduj dane
      await canvas.loadFromJSON(data)
      
      console.log('✅ JSON loaded successfully')
      
      // Przywróć wymiary
      canvas.set({ width: targetWidth, height: targetHeight })
      
      if (canvasElement) {
        canvasElement.width = targetWidth
        canvasElement.height = targetHeight
      }
      
      canvas.renderAll()
      
      console.log('✅ Canvas ready:', canvas.width, 'x', canvas.height)
      
      return true
      
    } catch (loadError) {
      console.error('❌ Error loading JSON into canvas:', loadError)
      return false
    }
    
  } catch (parseError) {
    console.error('❌ Error parsing JSON:', parseError)
    return false
  }
}

export const exportToPNG = (canvas: Canvas): string => {
  return canvas.toDataURL({
    format: "png",
    quality: 1,
    multiplier: 1
  })
}

// Optional: function to export in higher resolution
export const exportToHighResPNG = (canvas: Canvas, scale: number = 2): string => {
  return canvas.toDataURL({
    format: 'png',
    quality: 1,
    multiplier: scale, // 2 = 2x resolution, 3 = 3x itd.
  })
}

// Group objects
export const groupObjects = (canvas: Canvas) => {
  const activeSelection = canvas.getActiveObject()
  
  if (!activeSelection) {
    console.log('No object selected')
    return
  }

  // Sprawdź czy to multiple selection
  if (activeSelection.type === 'activeSelection') {
    const selection = activeSelection as ActiveSelection
    const selectedObjects = selection.getObjects()
    
    // Usuń active selection
    canvas.discardActiveObject()
    
    // Stwórz grupę z wybranych obiektów
    const group = new Group(selectedObjects, {
      left: activeSelection.left,
      top: activeSelection.top,
    })
    
    // Usuń oryginalne obiekty
    selectedObjects.forEach(obj => canvas.remove(obj))
    
    // Dodaj grupę
    canvas.add(group)
    canvas.setActiveObject(group)
    canvas.renderAll()
    
    console.log('Objects grouped successfully')
  } else {
    console.log('Select multiple objects to group')
  }
}

// Ungroup objects
export const ungroupObjects = (canvas: Canvas) => {
  const activeObject = canvas.getActiveObject()
  
  if (!activeObject || activeObject.type !== 'group') {
    console.log('Select a group to ungroup')
    return
  }

  const group = activeObject as Group
  const items = group.getObjects()

  canvas.remove(group)

  items.forEach(item => {
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
  
  console.log('Group ungrouped successfully')
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
export const alignObjects = (canvas: Canvas, alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
  const activeObject = canvas.getActiveObject()
  if (!activeObject) return

  const canvasWidth = canvas.width || 800
  const canvasHeight = canvas.height || 600

  switch (alignment) {
    case 'left':
      activeObject.set({ left: 0 })
      break
    case 'center':
      activeObject.set({ left: (canvasWidth - (activeObject.width || 0)) / 2 })
      break
    case 'right':
      activeObject.set({ left: canvasWidth - (activeObject.width || 0) })
      break
    case 'top':
      activeObject.set({ top: 0 })
      break
    case 'middle':
      activeObject.set({ top: (canvasHeight - (activeObject.height || 0)) / 2 })
      break
    case 'bottom':
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
    const easedProgress = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2

    const currentValue = startValue + (diff * easedProgress)
    
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

  // Przygotuj wartości startowe
  Object.keys(animations).forEach(key => {
    startValues[key] = (obj as any)[key] || 0
    diffs[key] = animations[key] - startValues[key]
  })

  const startTime = Date.now()

  const step = () => {
    const now = Date.now()
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing
    const easedProgress = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2

    // Update wszystkich properties
    Object.keys(animations).forEach(key => {
      const currentValue = startValues[key] + (diffs[key] * easedProgress)
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

