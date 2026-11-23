import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CONFIG } from '../data/invitation';

export const isSupabaseConfigured: boolean = Boolean(
  CONFIG.supabaseUrl &&
  CONFIG.supabasePublishableKey &&
  !CONFIG.supabaseUrl.includes('XXXX') &&
  CONFIG.supabasePublishableKey !== 'PASTE_PUBLISHABLE_KEY' &&
  CONFIG.customerId &&
  CONFIG.customerId !== 'PASTE_CUSTOMER_UUID'
);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(CONFIG.supabaseUrl, CONFIG.supabasePublishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    client = null;
  }
}

export const supabase: SupabaseClient | null = client;
