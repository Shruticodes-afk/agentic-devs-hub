const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const columns = ['response', 'reply', 'answer', 'ai_message'];
  for (const col of columns) {
     const { error } = await supabase.from('chat_logs').select(`id, ${col}`).limit(1);
     if (!error || error.code !== '42703') {
         console.log("FOUND COLUMN:", col);
     }
  }
}
run();
