import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Providers } from "@/components/providers"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DesignStudio - Create Stunning Designs",
  description:
    "Professional online design tool for creating graphics, presentations, and more",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
