// We are importing the Supabase client directly from a CDN since we aren't using a bundler.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// =========================================================================
// REPLACE THESE WITH YOUR ACTUAL URL AND ANON KEY IF THEY CHANGE
// You requested to know where to add them: right here!
// =========================================================================
const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || window?.ENV?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || window?.ENV?.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
