import { Employee } from '@/models/Employee';
import { UserInput } from '@/models/UserInput';
import FormatPhone from '@/utils/FormatPhone';
import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import CustomInput from './CustomInput';

type Props = {
    finishedSubmitFunction?: CallableFunction
    userCancelFunction?:CallableFunction
    intialData: Employee | UserInput
}

function UpdateEmployeeForm({finishedSubmitFunction,intialData,userCancelFunction}: Props) {
    const [employee, setEmployee] = useState<Employee>( {
        email: '',
        apellido: '',
        area: '',
        nombre: '',
        num_empleado: 0,
        puesto: '',
        telefono: '',
      })
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState('')
    const createEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError((prev) => '');
      setIsLoading((prev) => true);
      const fetchCreate = await fetch('/api/users', {
        method: 'PATCH',
        body: JSON.stringify({data: employee})
      });
      const result = await fetchCreate.json();
      if(!fetchCreate.ok){
        setIsLoading((prev) => false);
        setError((prev) => result.message)
        return
      }
      setIsLoading((prev) => false);
      //We notify parent, that the form finished the submit with success
      if(finishedSubmitFunction){
        finishedSubmitFunction({status: 'Success', message: result.message})
      }
    }
    useEffect(() => {
        if(intialData) {
            setEmployee((prev) => intialData as Employee)
        }
    }, [intialData])
    const handleUserCancel = () => {
      if(userCancelFunction){
        setEmployee((prev) => ({
          email: '',
          apellido: '',
          area: '',
          nombre: '',
          num_empleado: 0,
          puesto: '',
          telefono: '',
        }))
        setError((prev) => '')
        userCancelFunction()
      }
    }      
    return (
        <div>
            <form onSubmit={createEmployee} onReset={() => userCancelFunction ? handleUserCancel() : null}  className='mt-12 space-y-12 flex flex-col items-center'>
                <div id='Identity' className='flex flex-col space-y-12 landscape:2xl:flex-row landscape:2xl:space-y-0 landscape:2xl:space-x-5'>
                <CustomInput required title='Num. empleado' inputType='text' minLength={1} inputValue={employee.num_empleado} handleChange={(value: number) => setEmployee(prevState => ({...prevState, num_empleado: value}))} />
                <CustomInput required title='Nombre/s' inputType='text' inputValue={employee.nombre} handleChange={(value: string) => setEmployee(prevState => ({...prevState, nombre: value}))} />
                <CustomInput required title='Apellido/s' inputType='text' inputValue={employee.apellido} handleChange={(value: string) => setEmployee(prevState => ({...prevState, apellido: value}))} />
                </div>
                <div id='PersonalInfo' className='flex flex-col space-y-12'>
                <CustomInput required title='E-mail' inputType='email' inputValue={employee.email} handleChange={(value: string) => setEmployee(prevState => ({...prevState, email: value}))} />
                <CustomInput required maxLength={14} minLength={14}  title='Telefono' inputType='tel' inputValue={employee.telefono} handleChange={(value: string) => setEmployee(prevState => ({...prevState, telefono: FormatPhone(value)}))} />
                <CustomInput required maxLength={45} title='Area' inputType='text' inputValue={employee.area} handleChange={(value: string) => setEmployee(prevState => ({...prevState, area: value}))} />
                <CustomInput required maxLength={45} title='Puesto' inputType='text' inputValue={employee.puesto} handleChange={(value: string) => setEmployee(prevState => ({...prevState, puesto: value}))} />
                </div>
                {error ? <p className='font-light text-blue-500 text-sm text-center w-3/4'>{error}</p> : null}
                {isLoading ? 
                <AiOutlineLoading3Quarters className=' animate-spin w-5 h-5 text-gray-600'/> 
                :
                <div className='flex space-x-12'>
                  <button type='submit' className='border-2 border-blue-500 text-gray-600 px-2 rounded-md'>Actualizar empleado</button>
                  {userCancelFunction && <button type='reset' className='bg-gray-300 border-2 border-gray-300 font-medium text-white px-2 rounded-md'>Cancelar</button>}
                </div> 
                }
            </form>
        </div>
    )
}

export default UpdateEmployeeForm