// services/supabase.js
require('dotenv').config(); // lit ./api/.env quand il existe
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    if (process.env.NODE_ENV === 'test') {
        // fallback doux pour tests unitaires : renvoie un "stub" minimal
        module.exports = {
            supabase: {
                from: () => ({
                    select: async () => ({ data: [], error: null })
                }),
                // ajoute d'autres méthodes mock si besoin
            }
        };
    } else {
        throw new Error('Missing SUPABASE_URL or SUPABASE_KEY');
    }
} else {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    module.exports = { supabase };
}
