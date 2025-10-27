import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const original = await prisma.project.findFirst({
    where: { id: id, userId: session.user.id },
  })
  
  if (!original) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const copy = await prisma.project.create({
    data: {
      name: `${original.name} (Copy)`,
      canvasData: original.canvasData!,
      thumbnail: original.thumbnail,
      width: original.width,
      height: original.height,
      userId: session.user.id,
    },
  })
  return NextResponse.json(copy, { status: 201 })
}