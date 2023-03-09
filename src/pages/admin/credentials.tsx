import DashboardLayout from '@/components/dashboard/DashboardLayout'
import TableView from '@/components/dashboard/TableView'
import CustomInput from '@/components/forms/CustomInput'
import FormModal from '@/components/modals/FormModal'
import SnackBar from '@/components/Notifications/Snackbar'
import { Snackbar } from '@/models/SnackBar'
import validatePasswordSecurity from '@/utils/validatePasswordSecurity'
import Head from 'next/head'
import React, { useState } from 'react'
import {AiOutlineLoading3Quarters} from 'react-icons/ai';

type Props = {}
type Credentials = {
  email: string,
  password: string
}
function Credentials({}: Props) {

  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: ''
  })
  const [reloadTable, setRealoadTable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState('')
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<Snackbar>({
    isVisible: false,
    message: '',
    status: 'Error',
  });


  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError((prev) => '');
    setIsLoading((prev) => true);
    if(!validatePasswordSecurity(credentials.password)){
      setError((prev) => 'La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 simbolo y 1 número');
      setIsLoading((prev) => false);
      return
    }
    const fetchCreate = await fetch('/api/admin', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    const result = await fetchCreate.json();
    if(!fetchCreate.ok){
      setIsLoading((prev) => false);
      setError((prev) => result.message)
      return
    }
    setIsLoading((prev) => false);
    setSnackbarStatus((prev) => ({
      isVisible: true,
      message: result.message,
      status: 'Success'
    }))
    setRealoadTable((prev) => !reloadTable)
    setIsModalActive(false);
  }


  if(snackbarStatus.isVisible) {
    setTimeout(() => {
      setSnackbarStatus((prev) => ({
        ...prev, isVisible: false
      }))
    }, 4000)
  }


  return (
    <div>
        <Head>
            <title>Panel de control - credenciales</title>
            <meta name="description" content="Este es el menu para asignar o eliminar credenciales de acceso" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <DashboardLayout>
            <TableView reload={reloadTable} title='Credenciales' api='/api/admin' headers={['_id', 'email']}>
              <button className='bg-blue-500 text-white font-medium px-2 rounded-md' onClick={() => setIsModalActive((prev) => !isModalActive)}>Añadir</button>
            </TableView>
            <FormModal title='Añadir nuevo acceso' className={`h-max`} isActive={isModalActive} outsideCloseFunction={(value: boolean) => setIsModalActive((prev) => value)}>
              <div>
                <form onSubmit={createUser}  className='mt-12 space-y-12 flex flex-col items-center'>
                  <CustomInput id='username' autoComplete='username' inputType='email' title='Email' inputValue={credentials.email} handleChange={(value: string) => setCredentials((prev) => ({...prev, email: value}))} />
                  <CustomInput id='current-password' autoComplete='current-password' inputType='password' title='Password' inputValue={credentials.password} handleChange={(value: string) => setCredentials((prev) => ({...prev, password: value}))} />
                  {error ? <p className='font-light text-blue-500 text-sm text-center w-3/4'>{error}</p> : null}
                  {isLoading ? 
                    <AiOutlineLoading3Quarters className=' animate-spin w-5 h-5 text-gray-600'/> 
                    : 
                    <button type='submit' className='border-2 border-blue-500 text-gray-600 px-2 rounded-md'>Add user</button>
                  }
                </form>
              </div>
            </FormModal>
            <SnackBar isVisible={snackbarStatus.isVisible} status={snackbarStatus.status} message={snackbarStatus.message}/>
        </DashboardLayout>
    </div>
  )
}

export default Credentials