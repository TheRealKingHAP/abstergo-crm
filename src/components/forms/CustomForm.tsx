import { Snackbar } from '@/models/SnackBar'
import { UserInput } from '@/models/UserInput'
import FormatPhone from '@/utils/FormatPhone'
import React, { useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import SnackBar from '../Notifications/Snackbar'
import CustomInput from './CustomInput'

type Props = {}
type Error = {
    message?: string
}
function CustomForm({}: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<UserInput>({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        address: ''
    })
    const [snackBarStatus, setSnackbarStatus] = useState<Snackbar>({
        isVisible: false,
        message: '',
        status: 'Error',
    })
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading((prev) => true);
        const response = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({data})
        })
        const result = await response.json();
        console.log(result);
        if(!response.ok){
            setSnackbarStatus((prev) => ({
                isVisible: true, 
                message: result.message,
                status: 'Error'
            }))
            setIsLoading((prev) => false);
            return
        }
        setIsLoading((prev) => false)
        setSnackbarStatus((prev) => ({
            isVisible: true, 
            message: result.message,
            status: 'Success'
        }))
    }

    if(snackBarStatus.isVisible) {
        setTimeout(() => {
          setSnackbarStatus((prev) => ({
            ...prev, isVisible: false
          }))
        }, 4000)
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className={'flex flex-col items-center space-y-16'}>
                <div id='Identity' className='flex flex-col space-y-12 landscape:2xl:flex-row landscape:2xl:space-y-0 landscape:2xl:space-x-5'>
                    <CustomInput required title='Nombre/s' inputType='text' inputValue={data.name} handleChange={(value: string) => setData(prevState => ({...data, name: value}))} />
                    <CustomInput required title='Apellido/s' inputType='text' inputValue={data.lastname} handleChange={(value: string) => setData(prevState => ({...data, lastname: value}))} />
                </div>
                <div id='PersonalInfo' className='flex flex-col space-y-12'>
                    <CustomInput required title='E-mail' inputType='email' inputValue={data.email} handleChange={(value: string) => setData(prevState => ({...data, email: value}))} />
                    <CustomInput required maxLength={14} minLength={14}  title='Telefono' inputType='tel' inputValue={data.phone} handleChange={(value: string) => setData(prevState => ({...data, phone: FormatPhone(value)}))} />
                    <CustomInput required maxLength={45} title='Dirección' inputType='text' inputValue={data.address} handleChange={(value: string) => setData(prevState => ({...data, address: value}))} />
                </div>
                {isLoading ? 
                    <AiOutlineLoading3Quarters className=' animate-spin w-5 h-5 text-gray-600'/> 
                    : 
                    <button type='submit' className='bg-blue-500 text-white font-medium w-20 p-2 rounded-lg hover:scale-95 transition-all ease-in-out duration-150'>Enviar</button>      
                }
            </form>
            { snackBarStatus.isVisible ?
                <SnackBar isVisible={snackBarStatus.isVisible} message={snackBarStatus.message} status={snackBarStatus.status} />
            :
            null
            }
        </div>
    )
}

export default CustomForm