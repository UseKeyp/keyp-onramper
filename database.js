import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function storeWebhookInDB(requestUrl, body, res) {
    try {
        const { data, error } = await supabase
            .from('onramp')
            .insert([
                { requestUrl, responseData: body },
            ])
        
        if (error) {
            console.log('Error:', error);
            return res.status(500).send({ error: 'Failed to insert webhook data into database' });
        }
        return data
    } catch (error) {
        console.log("Error saving response:", error)
        return res.status(400).send({ error: error.message });
    }
}