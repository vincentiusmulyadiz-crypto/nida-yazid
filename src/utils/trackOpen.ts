import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CONFIG } from '../data/invitation';

let hasTracked = false;

export async function trackGuestOpen(): Promise<void> {
  if (hasTracked) return;
  if (typeof window === 'undefined') return;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = (urlParams.get('c') || urlParams.get('code') || '').trim() || null;
    const rawTo = (urlParams.get('to') || urlParams.get('guest') || urlParams.get('name') || '').trim();
    const name = rawTo || null;

    if (!code && !name) return;

    const customerId = CONFIG.customerId;
    if (!customerId || customerId === 'PASTE_CUSTOMER_UUID') return;

    hasTracked = true;

    if (isSupabaseConfigured && supabase) {
      await supabase.rpc('record_guest_open', {
        p_customer_id: customerId,
        p_code: code,
        p_name: name,
      });
      return;
    }

    if (CONFIG.supabaseUrl && CONFIG.supabasePublishableKey) {
      await fetch(`${CONFIG.supabaseUrl}/rest/v1/rpc/record_guest_open`, {
        method: 'POST',
        headers: {
          apikey: CONFIG.supabasePublishableKey,
          Authorization: `Bearer ${CONFIG.supabasePublishableKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          p_customer_id: customerId,
          p_code: code,
          p_name: name,
        }),
        keepalive: true,
      });
    }
  } catch (err) {
    // Non-blocking telemetry
  }
}
