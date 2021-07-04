import { createClient } from '@supabase/supabase-js'

const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzM5NTM2NSwiZXhwIjoxOTM4OTcxMzY1fQ.PaphAebhVmErPfAZp7c1utNWXpxo-rTKEgBAqrFOfyI'
const SUPABASE_URL = 'https://jqtyfhzyrwkebqblqbjq.supabase.co'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export { supabase }
