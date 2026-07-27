const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const chapterId = '72932d86-f50e-48b5-b893-25bb36d71eb8'; // Mumbai chapter
  
  console.log(`Querying chapters for ID: ${chapterId}`);
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', chapterId)
    .single();

  console.log('Result data:', data);
  console.log('Error:', error);
}
run();
