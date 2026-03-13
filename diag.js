/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    const { data: profiles, error: pError } = await supabase.from('profiles').select('id, username');
    console.log('Error profiles:', pError);
    console.log('Profiles:', profiles);

    if (profiles && profiles.length > 0) {
        const { data: designs, error: dError } = await supabase.from('designs').select('id, user_id, title');
        console.log('Error designs:', dError);
        console.log('Designs:', designs);
    }
}
run();
