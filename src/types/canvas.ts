import { Canvas, FabricObject } from 'fabric'

export interface CanvasElement {
  id: string
  type: 'rect' | 'circle' | 'triangle' | 'text' | 'image'
  properties: Record<string, any>
}

export interface Project {
  id: string
  name: string
  thumbnail: string | null
  canvasData: any
  width: number
  height: number
  createdAt: Date
  updatedAt: Date
}

export interface EditorState {
  canvas: Canvas | null
  selectedElement: FabricObject | null
  activeColor: string
  activeFontSize: number
}
