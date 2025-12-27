import { createClient } from '@supabase/supabase-js'

// Leer desde variables de entorno (prefijo VITE_ requerido por Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// Nueva variable para el rol de servicio (Poder total)
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey || !supabaseServiceKey) {
  console.error('Supabase: faltan VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY o VITE_SUPABASE_SERVICE_ROLE_KEY en .env')
}

// Cliente estándar para operaciones normales (Ventas, Inventarios, etc.)
export const supabase = createClient(supabaseUrl, supabaseKey)

// Cliente Administrador modificado para asegurar la creación de IDs únicos
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false // Añadido: Evita que el cliente admin intente leer tu sesión actual
  }
})