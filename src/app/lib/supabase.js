// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Add debug logging
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Test connection
supabase.auth.getSession()
  .then(response => console.log('Supabase connection test:', response))
  .catch(error => console.error('Supabase connection error:', error))

// Test the connection and log the result
const testSupabase = async () => {
  try {
    console.log("Supabase initialization:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey
    });

    console.log("Testing Supabase client...");
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Supabase session error:", error);
    } else {
      console.log("Supabase session status:", {
        hasSession: !!session,
        userId: session?.user?.id
      });
    }
  } catch (error) {
    console.error("Supabase test error:", error);
  }
};

testSupabase();

export { testSupabase };

