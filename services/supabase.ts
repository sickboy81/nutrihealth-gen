import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock Supabase client if env vars are missing
let supabase: ReturnType<typeof createClient>;

if (!supabaseUrl || !supabaseAnonKey) {
    // Only warn in development
    if (import.meta.env.DEV) {
        console.warn('Supabase environment variables not found. Using mock client. Authentication features will be limited.');
    }
    // Create a mock client with dummy values
    supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
} else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
