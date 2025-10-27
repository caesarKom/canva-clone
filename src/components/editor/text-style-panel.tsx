'use client'

import { useState, useEffect } from 'react'
import { Canvas, FabricText } from 'fabric'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'

interface TextStylePanelProps {
  canvas: Canvas | null
  selectedObject: FabricText | null
}

const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Verdana',
  'Comic Sans MS',
  'Impact',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
]

const FONT_WEIGHTS = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
  { value: '100', label: 'Thin' },
  { value: '300', label: 'Light' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
  { value: '900', label: 'Black' },
]

type FontStyleType = 'normal'|'italic'
type TextAlignType = 'left'|'right'|'center'

export function TextStylePanel({ canvas, selectedObject }: TextStylePanelProps) {
  const [fontSize, setFontSize] = useState(24)
  const [fontFamily, setFontFamily] = useState('Arial')
  const [fontWeight, setFontWeight] = useState('normal')
  const [fontStyle, setFontStyle] = useState<string|FontStyleType>('normal')
  const [underline, setUnderline] = useState(false)
  const [textAlign, setTextAlign] = useState<string| TextAlignType>('left')
  const [lineHeight, setLineHeight] = useState(1.16)
  const [charSpacing, setCharSpacing] = useState(0)

  useEffect(() => {
    if (selectedObject && selectedObject.type === 'i-text') {
      setFontSize(selectedObject.fontSize || 24)
      setFontFamily(selectedObject.fontFamily || 'Arial')
      setFontWeight(selectedObject.fontWeight?.toString() || 'normal')
      setFontStyle(selectedObject.fontStyle || 'normal')
      setUnderline(selectedObject.underline || false)
      setTextAlign(selectedObject.textAlign || 'left')
      setLineHeight(selectedObject.lineHeight || 1.16)
      setCharSpacing(selectedObject.charSpacing || 0)
    }
  }, [selectedObject])

  const updateTextStyle = (property: string, value: any) => {
    if (selectedObject && canvas) {
      selectedObject.set(property as any, value)
      canvas.renderAll()
    }
  }

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0])
    updateTextStyle('fontSize', value[0])
  }

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value)
    updateTextStyle('fontFamily', value)
  }

  const handleFontWeightChange = (value: string) => {
    setFontWeight(value)
    updateTextStyle('fontWeight', value)
  }

  const toggleBold = () => {
    const newWeight = fontWeight === 'bold' ? 'normal' : 'bold'
    setFontWeight(newWeight)
    updateTextStyle('fontWeight', newWeight)
  }

  const toggleItalic = () => {
    const newStyle = fontStyle === 'italic' ? 'normal' : 'italic'
    setFontStyle(newStyle)
    updateTextStyle('fontStyle', newStyle)
  }

  const toggleUnderline = () => {
    const newUnderline = !underline
    setUnderline(newUnderline)
    updateTextStyle('underline', newUnderline)
  }

  const handleTextAlignChange = (align: 'left' | 'center' | 'right') => {
    setTextAlign(align)
    updateTextStyle('textAlign', align)
  }

  const handleLineHeightChange = (value: number[]) => {
    setLineHeight(value[0])
    updateTextStyle('lineHeight', value[0])
  }

  const handleCharSpacingChange = (value: number[]) => {
    setCharSpacing(value[0])
    updateTextStyle('charSpacing', value[0])
  }

  if (!selectedObject || selectedObject.type !== 'i-text') {
    return null
  }

  return (
    <div className="space-y-4 p-4 border-t">
      <h3 className="font-semibold text-sm">Text Styling</h3>

      {/* Font Family */}
      <div>
        <Label className="text-xs">Font Family</Label>
        <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Size */}
      <div>
        <Label className="text-xs">Font Size: {fontSize}px</Label>
        <Slider
          value={[fontSize]}
          onValueChange={handleFontSizeChange}
          min={8}
          max={200}
          step={1}
          className="mt-2"
        />
      </div>

      {/* Font Weight */}
      <div>
        <Label className="text-xs">Font Weight</Label>
        <Select value={fontWeight} onValueChange={handleFontWeightChange}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_WEIGHTS.map((weight) => (
              <SelectItem key={weight.value} value={weight.value}>
                {weight.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Text Decorations */}
      <div>
        <Label className="text-xs mb-2 block">Text Decoration</Label>
        <div className="flex gap-2">
          <Button
            variant={fontWeight === 'bold' ? 'default' : 'outline'}
            size="icon"
            onClick={toggleBold}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={fontStyle === 'italic' ? 'default' : 'outline'}
            size="icon"
            onClick={toggleItalic}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={underline ? 'default' : 'outline'}
            size="icon"
            onClick={toggleUnderline}
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <Label className="text-xs mb-2 block">Text Alignment</Label>
        <div className="flex gap-2">
          <Button
            variant={textAlign === 'left' ? 'default' : 'outline'}
            size="icon"
            onClick={() => handleTextAlignChange('left')}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={textAlign === 'center' ? 'default' : 'outline'}
            size="icon"
            onClick={() => handleTextAlignChange('center')}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={textAlign === 'right' ? 'default' : 'outline'}
            size="icon"
            onClick={() => handleTextAlignChange('right')}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Line Height */}
      <div>
        <Label className="text-xs">Line Height: {lineHeight.toFixed(2)}</Label>
        <Slider
          value={[lineHeight]}
          onValueChange={handleLineHeightChange}
          min={0.5}
          max={3}
          step={0.1}
          className="mt-2"
        />
      </div>

      {/* Character Spacing */}
      <div>
        <Label className="text-xs">Letter Spacing: {charSpacing}</Label>
        <Slider
          value={[charSpacing]}
          onValueChange={handleCharSpacingChange}
          min={-200}
          max={800}
          step={10}
          className="mt-2"
        />
      </div>
    </div>
  )
}
