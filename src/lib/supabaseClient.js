import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  // Fails loudly at build/dev time instead of silently breaking auth calls later.
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Add them to your .env file (see .env.example).'
  )
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey)

// Name of the public Storage bucket showcase uploads are written to.
// Must match the bucket created in supabase/migration.sql.
export const SHOWCASE_BUCKET = 'showcase'
