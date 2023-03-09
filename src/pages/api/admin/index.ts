import { UserInput } from '@/models/UserInput';
import validatePasswordSecurity from '@/utils/validatePasswordSecurity';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next'
import validator from 'validator'
type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  //We create the client to verify if the user is logged in
  const supabaseClient = createServerSupabaseClient({
  req,
  res,
  }, {supabaseKey: process.env.SUPABASE_SERVICE || '', supabaseUrl: process.env.SUPABASE_URL || '' });
  let {data:{session}} = await supabaseClient.auth.getSession();
  if(!session){
    return res.status(401).json({message:'Sorry you are not logged in'});
  }
  switch(req.method){
    case 'GET': {
      const itemsNumber: number = 14;
      let {page, sort_by, sort_order, search, search_by} = req.query;
      if(sort_by == '_id') sort_by = 'id'
      if(search_by == '_id') search_by ='id'
      let lastPage: boolean = false;
      let pageIndex = parseInt(page as string);
      const from = pageIndex * itemsNumber;
      const to = from + itemsNumber;
      if(search && search_by){
        let {data, error} = await supabaseClient.from('users').select('id,email')
        .ilike(`${search_by}`, `%${search}%`)
        .order(sort_by ? sort_by as string : 'id', {ascending: sort_order == 'asc' ? true : false})
        .range(from,to);
        if(!data || error){
          return res.status(400).json({message: "Sorry there was an error"});
        }
        if(data.length < itemsNumber){
          lastPage = true
        }
        let formatedData = data.map((value) => {
          return {
            _id: value.id,
            email: value.email
          }
        })
        return res.status(200).json({data: formatedData, lastPage});
      }
      let {data, error} = await supabaseClient.from('users').select('id, email')
      .order(sort_by ? sort_by as string : 'id', {ascending: sort_order == 'asc' ? true : false})
      .range(from,to);
      if(!data || error){
        return res.status(400).json({message: "Sorry there was an error"});
      }
      if(data.length < itemsNumber){
        lastPage = true
      }
      let formatedData = data.map((value) => {
        return {
          _id: value.id,
          email: value.email
        }
      })
      return res.status(200).json({data: formatedData, lastPage});
    }
    case 'POST': {
      let userData = JSON.parse(req.body);
      const {email, password} = userData;
      if(!validator.isEmail(email)){
        return res.status(400).json({message: 'Porfavor ingresa una dirección de correo valida'})
      }
      if(!validatePasswordSecurity(password)){
        return res.status(400).json({message: 'Ingresa una contraseña valida'})
      }
      let {data: user, error: userError} = await supabaseClient.from('users').select('email').eq('email', email);
      if(userError){
        return res.status(401).json({message:userError.message});
      }
      if(user?.length){
        return res.status(401).json({message: 'Ya existe un usuario con ese correo electronico'});
      }
      let { data, error } = await supabaseClient.auth.signUp({
        email, password
      })

      if(error){
        return res.status(401).json({message: error.message})
      }
      await supabaseClient.auth.signOut();
      await supabaseClient.auth.refreshSession(session);
      return res.status(201).json({message: 'Usuario creado correctamente'})
    }
    case 'DELETE':{
      let usrData = JSON.parse(req.body);
      let id = usrData._id;
      if(id === session.user.id){
        return res.status(401).json({message: 'Lo sentimos, parece que hay una sesión iniciada con ese usuario'})
      }
      const { data, error } = await supabaseClient.auth.admin.deleteUser(id);
      if(error){
        return res.status(401).json({message: error.message});
      }
      const publicUser = await supabaseClient
      .from('users')
      .delete()
      .eq('id', id);
      if(publicUser.error){
        return res.status(401).json({message: 'Lo sentimos, hubo un problema al eliminar el usuario'});
      }
      return res.status(202).json({message: 'Usuario eliminado correctamente'});
    }
    default:{
      return res.status(400).json({mesage: 'Sorry there was an error'});
    }
  }
}
