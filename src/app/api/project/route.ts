import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/projects
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const project = await prisma.project.create({
      data: {
        name: body.name || 'Untitled',
        width: body.width || 800,
        height: body.height || 600,
        canvasData: body.canvasData || null,
        userId: session.user.id,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}