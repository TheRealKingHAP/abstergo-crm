import { createClient } from "@supabase/supabase-js";
import SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient";

export const supabase: SupabaseClient = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');