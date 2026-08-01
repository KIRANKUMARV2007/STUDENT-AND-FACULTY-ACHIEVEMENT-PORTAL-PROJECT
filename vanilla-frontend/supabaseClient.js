// We are importing the Supabase client directly from a CDN since we aren't using a bundler.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// =========================================================================
// REPLACE THESE WITH YOUR ACTUAL URL AND ANON KEY IF THEY CHANGE
// You requested to know where to add them: right here!
// =========================================================================
const supabaseUrl = 'https://vxheiccswdxlssftbxhz.supabase.co'
const supabaseAnonKey = 'sb_publishable_oQZCSpp6FyHM1XOFKS-SuA_242Hqo9n'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
