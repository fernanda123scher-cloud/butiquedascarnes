import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Credenciais públicas do Supabase (Publishable Key protegida por RLS no banco)
const DEFAULT_SUPABASE_URL = 'https://dykstzsjnlfzcmqzisbk.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_k439kaYrFd4z1HTc6FrVbg_ZpEYEfLa';

const supabaseUrl = 
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined) ||
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey = 
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined) ||
  DEFAULT_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('SEU_PROJETO') && 
  !supabaseAnonKey.includes('SUA_CHAVE')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
