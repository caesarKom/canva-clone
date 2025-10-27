import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Layers, Zap } from "lucide-react"
import Image from "next/image"
import { auth } from "@/lib/auth"

export default async function HomePage() {
  const session = await auth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Design anything you can imagine
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Create stunning graphics, presentations, and designs with our
              powerful online design tool. No design experience required.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {session?.user ? (
                <Link href="/projects">
                <button className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl text-lg transition-soft">
                  My projects
                  <ArrowRight className="h-4 w-4" />
                </button>
                </Link>
              ) : (
                <>
                <Link href="/register">
                <button className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl text-lg transition-soft">
                  Start designing for free
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/login">
                <button className="btn-outline-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl text-lg transition-soft">
                  Sign in
                </button>
              </Link>
              </>
              )}
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-16 flow-root sm:mt-24">
            <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4">
              <div className="rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 shadow-2xl ring-1 ring-gray-900/10">
                <div className="flex flex-row justify-center items-center aspect-auto overflow-hidden">
                  <Image
                    src="/img/hero.png"
                    alt="Hero"
                    width={800}
                    height={800}
                    className="object-cover max-w-[800px] max-h-[800px]"
                  />
                  <Image
                    src="/img/img-hero.png"
                    alt="Hero"
                    width={800}
                    height={800}
                    className="object-cover max-w-[800px] max-h-[800px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to create
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Professional design tools at your fingertips
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Sparkles className="h-5 w-5 flex-none text-blue-600" />
                  Easy to use
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Intuitive drag-and-drop interface that makes design simple
                    for everyone.
                  </p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Layers className="h-5 w-5 flex-none text-blue-600" />
                  Powerful tools
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Professional-grade design tools including shapes, text, and
                    image editing.
                  </p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Zap className="h-5 w-5 flex-none text-blue-600" />
                  Lightning fast
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Real-time collaboration and instant saves keep your work
                    safe and accessible.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to start creating?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Join thousands of designers and create your first project today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {session?.user ? (
                <Link href="/projects">
                <Button size="lg" variant="secondary">
                  My projects
                </Button>
              </Link>
              ):(
                <Link href="/register">
                <Button size="lg" variant="secondary">
                  Get started for free
                </Button>
              </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
