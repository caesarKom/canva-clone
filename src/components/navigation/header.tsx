'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Palette, User, LogOut, FolderOpen, User2Icon } from 'lucide-react'

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Palette className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">DesignStudio</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex md:gap-x-8">
          <Link
            href="/projects"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/templates"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
          >
            Templates
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
          >
            Pricing
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {session.user.name || session.user.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/projects" className="flex items-center gap-2 cursor-pointer">
                    <FolderOpen className="h-4 w-4" />
                    My Projects
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User2Icon className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2 cursor-pointer text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/register">
                <Button>Get started</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
