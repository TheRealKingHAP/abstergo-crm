import { Query } from "@/hooks/useData";
import clientPromise from "@/lib/mongodb";
import { Employee } from "@/models/Employee";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Collection, Db, MongoClient, SortDirection } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
){
    switch(req.method){
        case 'GET': {
            //Verify logged in user
            const supabaseClient = createServerSupabaseClient({req, res});
            let {data:{session}} = await supabaseClient.auth.getSession();
            if(!session){
              return res.status(401).json({message:'Sorry you are not logged in'});
            }
            let client: MongoClient = await clientPromise;
            let db: Db = client.db(process.env.MONGODB_DB ?? '');
            let {sort_by, sort_order, search_by, search} = req.query;
            
            let collection: Collection = db.collection(process.env.MONGODB_EMPLOYEES_COLLECTION ?? '');
            if(search && search_by){
              //Add mongoDb data query
              let regex = new RegExp('.*'+search+'.*', 'i')
              const data: Employee[] = (await collection.find({[search_by as string]: regex},{projection: {_id: 0}}).sort({[sort_by as string]: sort_order as SortDirection}).toArray()) as Employee[]
              const totalDocs: number = await collection.countDocuments({[search_by as string]: regex})
              if(data.length <= 0){
                return res.status(400).json({message: 'Lo sentimos parece que hubo un error al obtener la información'})
              }
              return res.status(200).json({data});
            }
            //Add mongoDb data query if user is not searching with text      
            const data: Employee[] = (await collection.find({},{projection: {_id: 0}}).sort({[sort_by as string]: sort_order as SortDirection}).toArray()) as Employee[]
            if(data.length <= 0){
                return res.status(400).json({message: 'Lo sentimos parece que hubo un error al obtener la información'})
            }
            return res.status(200).json({data, message:'Se ha creado el archivo correctamente'});
        }
        default: {
            return res.status(400).json({message: 'Lo sentimos hubo un error en el servidor'});
        }
    }
}