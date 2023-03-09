import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type {NextApiRequest, NextApiResponse} from 'next';
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
){
    switch(req.method){
        case 'POST': {
            const {credentials} = JSON.parse(req.body);
            console.log(credentials);
            try {
                let supabaseClient = createServerSupabaseClient({
                    req, 
                    res
                })
                let {data, error} = await supabaseClient.auth.signUp({
                    email: credentials.email,
                    password: credentials.password
                    
                })
                console.log(error);
                return res.status(200).json({message: 'Success signup'});
            } catch (error: any) {
                return res.status(400).json({message: error.message})
            }
        }
    }
}