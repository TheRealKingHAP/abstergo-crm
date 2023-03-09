import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse<any>
){
    switch(req.method){
        case 'GET': {
            try {
                const supabaseServerClient = createServerSupabaseClient({
                    req,
                    res
                });
                const {data: {session}, } = await supabaseServerClient.auth.getSession()
                if(!session){
                    throw Error('Sorry you are not logged in');
                }
                return res.status(200).json({name: session.user?.email ?? ''})

            } catch (error: any) {
                return res.status(401).json(error.message)
            }
        }
        default:
            return res.status(400).json({message: 'Sorry there was an error'})
    }
}