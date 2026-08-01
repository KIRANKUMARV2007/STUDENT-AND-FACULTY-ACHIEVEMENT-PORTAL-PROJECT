import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vxheiccswdxlssftbxhz.supabase.co';
const supabaseKey = 'sb_publishable_oQZCSpp6FyHM1XOFKS-SuA_242Hqo9n';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDepts() {
  const { data, error } = await supabase.from('departments').insert([
    { id: '9a3ee120-5308-430c-b213-36ef364cd23c', name: 'Computer Science and Engineering' },
    { id: '04a9e1bd-6c73-4557-9ac8-e72e38369ef9', name: 'Information Technology' }
  ]).select();
  if (error) {
    console.error('Insert Error:', error);
  } else {
    console.log('Inserted Departments:', data);
  }
}

checkDepts();
