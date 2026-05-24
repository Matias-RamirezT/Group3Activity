import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://irxtmaovumyvntcoqcid.supabase.co'

const supabaseKey =
  'sb_publishable_JY6OJBPhieEUy1pYiOqSAA_DOFsWjVZ'

export const supabase = createClient(supabaseUrl, supabaseKey)