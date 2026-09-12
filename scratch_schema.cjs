require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  console.log("=== INSPECTING PUBLIC.MEDIA ===");
  const { data: colsData, error: colsError } = await supabase.from('media').select('*').limit(1);
  console.log("Select media:", { data: colsData, error: colsError });
  
  if (colsData && colsData.length > 0) {
    console.log("Media Columns:", Object.keys(colsData[0]));
  } else {
    // If empty, let's try an empty insert to see what fails
    const { error: insertError } = await supabase.from('media').insert({}).select();
    console.log("Empty Insert Error:", insertError);
  }

  console.log("\n=== INSPECTING STORAGE BUCKETS ===");
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  console.log("Buckets:", buckets, "Error:", bucketsError);
}

inspect();
