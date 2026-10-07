'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    return { error: error.message }
  }

  const redirectTo = formData.get('redirectTo') as string || '/'
  redirect(redirectTo)
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    // Insert into users table
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: data.user.id,
        email: data.user.email,
        name: name || 'Customer',
        phone: phone || '',
        role: 'customer'
      })
      
    if (userError) {
      console.error('Error creating user record:', userError)
    }
  }

  const redirectTo = formData.get('redirectTo') as string || '/'
  redirect(redirectTo)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
