// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from '@/lib/mongodb';
import { Employee } from '@/models/Employee';
import { UserInput } from '@/models/UserInput';
import validateForm from '@/utils/validateForm';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Collection, Db, MongoClient, ObjectId, Sort, SortDirection } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  //We create the client to verify if the user is logged in
  let supabaseClient = createServerSupabaseClient({
    req: req,
    res: res
  });
  let {data:{session}} = await supabaseClient.auth.getSession();
  if(!session){
    return res.status(401).json({message:'Sorry you are not logged in'});
  }
  let client: MongoClient = await clientPromise;
  let db: Db = client.db(process.env.MONGODB_DB ?? '');
  switch(req.method){
    case 'GET': {
      const itemsNumber: number = 5;
      let {page, sort_by, sort_order, search, search_by} = req.query;
      let lastPage: boolean = false;
      let pageIndex = parseInt(page as string);
      const from = pageIndex * itemsNumber;
      const to = from + itemsNumber;
      let collection: Collection = db.collection(process.env.MONGODB_EMPLOYEES_COLLECTION ?? '');
      if(search && search_by){
        //Add mongoDb data query
        let regex = new RegExp('.*'+search+'.*', 'i')
        const data: Employee[] = (await collection.find({[search_by as string]: regex}).sort({[sort_by as string]: sort_order as SortDirection}).skip(pageIndex > 0 ? (pageIndex * itemsNumber) : 0).limit(itemsNumber).toArray()) as Employee[]
        //Check total documents for this query
        const totalDocs: number = await collection.countDocuments({[search_by as string]: regex})
        if(((pageIndex+1) * itemsNumber) >= totalDocs){
          lastPage = true
        }
        return res.status(200).json({data, lastPage});
      }
      //Add mongoDb data query if user is not searching with text      
      const data: Employee[] = (await collection.find({}).sort({[sort_by as string]: sort_order as SortDirection}).skip(pageIndex > 0 ? (pageIndex * itemsNumber) : 0).limit(itemsNumber).toArray()) as Employee[]
      //Check total documents
      const totalDocs: number = await collection.countDocuments()
      if(((pageIndex+1) * itemsNumber) >= totalDocs){
        lastPage = true
      }
      return res.status(200).json({data, lastPage});
    }
    case 'POST': {
      let userData = JSON.parse(req.body);
      let data: Employee = userData.data;
      //Check if employee number is greater than 0
      if(parseInt(data.num_empleado.toString()) <= 0) {
        return res.status(401).json({message: 'El número de empleado debe ser mayor que 0'});
      }
      const isDataValid = validateForm(data);
      if(!isDataValid.status){
        return res.status(401).json({message: isDataValid.message});
      }
      let collection: Collection = db.collection(process.env.MONGODB_EMPLOYEES_COLLECTION ?? '');
      //Check if the email is already in use
      const emailExist = await collection.findOne({'email': data.email})
      if(emailExist?._id){
        return res.status(401).json({message: 'Lo sentimos, ya existe un empleado con ese email'});
      }
      const employeeNumberExist = await collection.findOne({'num_empleado': parseInt(data.num_empleado.toString())})
      if(employeeNumberExist?._id){
        return res.status(401).json({message: 'Lo sentimos, ya existe un empleado con ese número asignado'});
      }
      //Insert the new employee 
      let formatedData: Employee = {...data, num_empleado: parseInt(data.num_empleado.toString())};
      const addEmployee = await collection.insertOne(formatedData)
      if(!addEmployee.insertedId){
        return res.status(401).json({message: 'Hubo un error al añadir el usuario'});
      }
      return res.status(201).json({message: 'Se ha registrado la información de forma exitosa'});
    }
    case 'DELETE':{
      let usrData = JSON.parse(req.body);
      let id = usrData._id;
      if(!id){
        return res.status(401).json({message: 'Selecciona un usuario valido'})
      }
      const {data: {session}} = await supabaseClient.auth.getSession();
      if(!session){
        return res.status(401).json({message: 'You are not logged in'})
      }
      let collection: Collection = db.collection(process.env.MONGODB_EMPLOYEES_COLLECTION ?? '');
      const deleteUser = await collection.deleteOne({_id: new ObjectId(id)})
      if(deleteUser.deletedCount <= 0) {
        return res.status(400).json({message: 'Hubo un error al eliminar el usuario'})
      }
      return res.status(202).json({message: 'Usuario eliminado de forma exitosa'});
    }
    //Update Employee information
    case 'PATCH':{
      try {
        let userData = JSON.parse(req.body);
        let data: Employee = userData.data;
        let id = data._id
        //Check if the selected Employee has and Id to proceed
        if(!id){
          return res.status(401).json({message: 'Selecciona un usuario valido'})
        }
        //Check if employee number is greater than 0
        if(parseInt(data.num_empleado.toString()) <= 0) {
          return res.status(401).json({message: 'El número de empleado debe ser mayor que 0'});
        }
        const isDataValid = validateForm(data);
        if(!isDataValid.status){
          return res.status(401).json({message: isDataValid.message});
        }
        let collection: Collection = db.collection(process.env.MONGODB_EMPLOYEES_COLLECTION ?? '');
        //Check if the email is already in use and we verify that we are not matching the same user
        const emailExist = await collection.findOne({'email': data.email})
        if(emailExist?._id && emailExist._id != id){
          return res.status(401).json({message: 'Lo sentimos, ya existe un empleado con ese email'});
        }
        const employeeNumberExist = await collection.findOne({'num_empleado': parseInt(data.num_empleado.toString())})
        if(employeeNumberExist?._id && employeeNumberExist._id != id){
          return res.status(401).json({message: 'Lo sentimos, ya existe un empleado con ese número asignado'});
        }
        //Insert the new employee 
        let formatedData: Employee = {...data,_id: new ObjectId(id) ,num_empleado: parseInt(data.num_empleado.toString())};
        const addEmployee = await collection.replaceOne({"_id": new ObjectId(id)}, formatedData)
        
        //Return error if employee didn't get updated
        if(!addEmployee.modifiedCount){
  
          return res.status(401).json({message: 'Hubo un error al actualizar el usuario'});
        }
        //If update succeeded
        return res.status(201).json({message: 'Se ha actualizado la información de forma exitosa'});
        
      } catch (error: any) {
        return res.status(400).json({message: error.message})
      }
    }
    default:
        return res.status(400).json({mesage: 'Lo sentimos hubo un error'});
  }
}
