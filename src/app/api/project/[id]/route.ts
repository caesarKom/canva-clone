import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const result = await prisma.project.deleteMany({
    where: { id: id, userId: session.user.id },
  })
  if (result.count === 0)
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const project = await prisma.project.findFirst({
    where: { id: id, userId: session.user.id },
  })
  if (!project)
    return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(project)
}


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const updateData: any = {}
    
    if (body.name !== undefined) {
      updateData.name = body.name
    }
    
    if (body.width !== undefined) {
      updateData.width = body.width
    }
    
    if (body.height !== undefined) {
      updateData.height = body.height
    }
    
    if (body.canvasData !== undefined && body.canvasData !== null) {
      updateData.canvasData = body.canvasData
     // console.log('✅ Updating canvasData')
    }
    
    if (body.thumbnail !== undefined) {
      updateData.thumbnail = body.thumbnail
    }
    
    if (body.animations !== undefined) {
      updateData.animations = body.animations
    }

    //console.log('Updating with:', Object.keys(updateData))

    const project = await prisma.project.update({
      where: {
        id: id,
        userId: session.user.id,
      },
      data: updateData,
    })
    
    return NextResponse.json(project)
  } catch (error) {
    console.error('❌ API PATCH error:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}