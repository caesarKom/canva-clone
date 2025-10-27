import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { auth } from '@/lib/auth'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

    // Użyj GPT-4 do wygenerowania struktury designu
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a design assistant that creates Fabric.js canvas JSON structures. 
          Generate a complete design based on the user's description. 
          Return only valid JSON that can be loaded into Fabric.js canvas.
          Include objects like rectangles, circles, text, and their properties (position, size, colors, etc.).`,
        },
        {
          role: 'user',
          content: `Create a ${templateType || 'design'} with the following description: ${prompt}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const canvasData = completion.choices[0]?.message?.content

    if (!canvasData) {
      return NextResponse.json({ error: 'Failed to generate design' }, { status: 500 })
    }

    return NextResponse.json({ canvasData })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate design' },
      { status: 500 }
    )
  }
}
