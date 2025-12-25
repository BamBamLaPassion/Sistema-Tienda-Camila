import { createClient } from '@supabase/supabase-js'

// URL de tu nuevo proyecto
const supabaseUrl = 'https://hfntvugyodwpjxetujcj.supabase.co'

// Tu clave anon public completa
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmbnR2dWd5b2R3cGp4ZXR1amNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NjM4MzcsImV4cCI6MjA4MjIzOTgzN30.u3ftrPP2N1-F9_nEdhzHKxgQ3pbT1eWGri0ZOC09fNk'

export const supabase = createClient(supabaseUrl, supabaseKey)