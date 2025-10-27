import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password, name } = body

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser)
    return NextResponse.json({ error: "User already exists" }, { status: 400 })

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  })

  return NextResponse.json(
    { id: user.id, email: user.email, name: user.name },
    { status: 201 }
  )
}
