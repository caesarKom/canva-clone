import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from "@google/genai";
import { auth } from '@/lib/auth'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, templateType } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const completion = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [
        
         `You are a design assistant that creates Fabric.js canvas JSON structures. 
          Generate a complete design based on the user's description. 
          Return only valid JSON that can be loaded into Fabric.js canvas.
          Include objects like rectangles, circles, text, and their properties (position, size, colors, etc.).`,
     
          `Create a ${templateType || 'design'} with the following description: ${prompt}`,
      
      ],
       config: {
        responseMimeType: 'application/json',
      },
    })

    const canvasDataText = completion.text

    if (!canvasDataText) {
      return NextResponse.json({ error: 'Failed to generate design' }, { status: 500 })
    }

    return NextResponse.json({ canvasDataText: canvasDataText })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate design' },
      { status: 500 }
    )
  }
}
