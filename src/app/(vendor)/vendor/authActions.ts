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

  redirect('/vendor')
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    // Insert into users table immediately
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email,
        name: 'New Vendor',
        phone: 'PENDING-' + data.user.id.substring(0, 8),
        role: 'vendor'
      })
      
      if (userError) {
      console.error('Error creating user record:', userError)
      return { error: `Failed to create user record: ${userError.message}` }
    }
  }

  redirect('/vendor')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/vendor/login')
}
