import { createClient } from './supabase/server';

export async function getSessionUserId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}
