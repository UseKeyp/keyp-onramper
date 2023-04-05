import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function saveResponse(requestUrl, responseData) {
    try {
        const { data, error } = await supabase
            .from('onramp')
            .insert([
                { requestUrl, responseData },
            ])
        
        console.log("data: ", data)
        console.log("error: ", error)
        return data
    } catch (error) {
        console.log("Error saving response: ", error)
    }
}