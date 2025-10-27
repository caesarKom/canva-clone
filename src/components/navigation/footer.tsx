import Link from 'next/link'
import { Palette } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Palette className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">DesignStudio</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Create stunning designs with our powerful online editor.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Product</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/features" className="text-sm text-gray-600 hover:text-gray-900">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-sm text-gray-600 hover:text-gray-900">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} DesignStudio. All rights reserved.
          </p>
          <p className="text-center text-sm text-gray-500 mt-1">
            Made with <span className='animate-pulse'>❤️</span> by Cezary Komorowski.
          </p>
        </div>
      </div>
    </footer>
  )
}
