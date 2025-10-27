import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
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

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()

  if (!body.canvasData || !body.thumbnail || !body.width || !body.height) {
 
    await prisma.project.update({
      where: { id: id, userId: session.user.id },
      data: {
        name: body.name,
      },
    })

    return NextResponse.json({ success: true })

  } else {

    const updated = await prisma.project.updateMany({
      where: { id: id, userId: session.user.id },
      data: {
        name: body.name,
        canvasData: body.canvasData,
        thumbnail: body.thumbnail,
        animations: body.animations,
        width: body.width,
        height: body.height,
      },
    })

    if (updated.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  }
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
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


