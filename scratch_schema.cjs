const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`)
  .then(res => res.json())
  .then(data => {
    console.log(JSON.stringify(data.definitions.rsvps, null, 2));
  })
  .catch(console.error);
