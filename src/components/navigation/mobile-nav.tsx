'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, X } from 'lucide-react'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-80">
        <nav className="flex flex-col gap-4">
          <Link
            href="/projects"
            onClick={() => setOpen(false)}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600"
          >
            Projects
          </Link>
          <Link
            href="/templates"
            onClick={() => setOpen(false)}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600"
          >
            Templates
          </Link>
          <Link
            href="/pricing"
            onClick={() => setOpen(false)}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600"
          >
            Pricing
          </Link>

          <div className="mt-6 border-t pt-6">
            {session?.user ? (
              <>
                <p className="mb-4 text-sm text-gray-600">
                  Signed in as {session.user.email}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setOpen(false)
                    signOut({ callbackUrl: '/' })
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full">Get started</Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
