
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xlaodskrpuntxpsuykfd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsYW9kc2tycHVudHhwc3V5a2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MjE2NDksImV4cCI6MjA1Njk5NzY0OX0.AVgcMoLmGn44PLFwP4EB-c9I2QmSZhOZYHzBP4d5PJA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
