import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Droplets, Wind, Zap, ShieldCheck, Banknote, Clock } from 'lucide-react'

import { HeroCarousel } from '@/components/HeroCarousel'

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-50 pt-16 pb-20 px-6 border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Home repairs, <br className="hidden sm:block" />
              <span className="text-indigo-600 relative">
                sorted.
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-amber-400 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 0" fill="transparent" stroke="currentColor" strokeWidth="3" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-lg mx-auto lg:mx-0">
              Book verified plumbers, electricians & AC technicians — same-day service, upfront pricing, no surprises.
            </p>
          </div>
          <div className="w-full max-w-2xl mx-auto lg:max-w-none">
            <HeroCarousel />
          </div>
        </div>
      </section>

      {/* 3 Category Tiles */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Select a Service</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <Link href="/category/plumbing">
            <Card className="group h-full flex flex-col cursor-pointer bg-white border border-slate-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center pb-2 p-8 text-center">
                <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 mb-4">
                  <Droplets className="h-10 w-10 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  Plumbing
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex-1 flex flex-col text-center">
                <p className="text-slate-500 text-sm mb-6">
                  Leaky taps, blocked drains, toilet trouble — our plumbers handle it all, starting from ₹149.
                </p>
                <div className="mt-auto font-semibold text-blue-600 flex items-center justify-center gap-2 group-hover:underline">
                  View Pricing & Book <span>→</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/category/ac-repair">
            <Card className="group h-full flex flex-col cursor-pointer bg-white border border-slate-200 hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-100 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center pb-2 p-8 text-center">
                <div className="h-20 w-20 rounded-full bg-sky-50 flex items-center justify-center group-hover:bg-sky-500 transition-colors duration-300 mb-4">
                  <Wind className="h-10 w-10 text-sky-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  AC Repair & Service
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex-1 flex flex-col text-center">
                <p className="text-slate-500 text-sm mb-6">
                  Not cooling? Making noise? Book AC repair, gas top-up or a full service — starting from ₹199.
                </p>
                <div className="mt-auto font-semibold text-sky-500 flex items-center justify-center gap-2 group-hover:underline">
                  View Pricing & Book <span>→</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/category/electrical">
            <Card className="group h-full flex flex-col cursor-pointer bg-white border border-slate-200 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-100 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center pb-2 p-8 text-center">
                <div className="h-20 w-20 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-300 mb-4">
                  <Zap className="h-10 w-10 text-amber-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Electrical
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex-1 flex flex-col text-center">
                <p className="text-slate-500 text-sm mb-6">
                  Switches, fans, wiring, MCB trips, geysers & more — safe, certified electrical work starting from ₹149.
                </p>
                <div className="mt-auto font-semibold text-amber-500 flex items-center justify-center gap-2 group-hover:underline">
                  View Pricing & Book <span>→</span>
                </div>
              </CardContent>
            </Card>
          </Link>

        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-slate-50 border-t border-slate-100 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="flex flex-col items-center justify-center pt-6 md:pt-0">
              <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <ShieldCheck className="h-7 w-7 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">Verified Professionals</h4>
              <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">Every technician is background-checked and trained.</p>
            </div>
            <div className="flex flex-col items-center justify-center pt-6 md:pt-0">
              <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Banknote className="h-7 w-7 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">Upfront Pricing</h4>
              <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">Know the starting price before you book, no hidden charges.</p>
            </div>
            <div className="flex flex-col items-center justify-center pt-6 md:pt-0">
              <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Clock className="h-7 w-7 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">Same-Day Service</h4>
              <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">Most bookings completed within hours in your city.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
