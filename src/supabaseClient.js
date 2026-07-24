// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nowtwomjiwqzblhkpifr.supabase.co";
const supabaseAnonKey = "sb_publishable_yf_gf1mEqnW2qmzS8l4y3w_48ZkwQ9W";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
