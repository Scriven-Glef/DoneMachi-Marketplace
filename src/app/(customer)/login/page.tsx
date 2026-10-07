'use client'

import { useState } from 'react'
import { login } from '../authActions'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/'
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    const res = await login(formData)
    if (res?.error) {
      setError(res.error)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">Log in to DoneMachi</h1>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
            Log In
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link href={`/register?redirectTo=${encodeURIComponent(redirectTo)}`} className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
