import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET /api/user/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            projects: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...user,
      projectCount: user._count.projects,
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PATCH /api/user/profile - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, currentPassword, newPassword } = body

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password required' },
          { status: 400 }
        )
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      })

      if (!user?.password) {
        return NextResponse.json(
          { error: 'Password not set' },
          { status: 400 }
        )
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password)
      if (!passwordMatch) {
        return NextResponse.json(
          { error: 'Current password incorrect' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

// DELETE /api/user/profile - Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete all user's projects first
    await prisma.project.deleteMany({
      where: { userId: session.user.id },
    })

    // Delete user account
    await prisma.user.delete({
      where: { id: session.user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
