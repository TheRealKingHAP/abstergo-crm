import CustomInput from '@/components/forms/CustomInput';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react'
import {AiOutlineLoading3Quarters} from 'react-icons/ai';

type Props = {}

type Credentials = {
    email: string,
    password: string
}
function Login({}: Props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [credentials, setCredentials] = useState<Credentials>({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const supabaseClient = useSupabaseClient();
    const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError((prev) => '')
        setIsLoading((prev) => true)
        const {error} = await supabaseClient.auth.signInWithPassword(credentials);
        if(error){
            setIsLoading((prev) => false)
            setError((prev) => error.message)
            console.log(error?.message);
        }
        if(!error){
            setIsLoading((prev) => false)
            router.push('/admin');
        }
        return
    }
    return (
        <div className='my-16 flex flex-col items-center space-y-16'>
            <h3 className='text-2xl text-gray-800 font-semibold'>Inicia sesión</h3>
            <form onSubmit={handleSignIn} className={'space-y-12 flex flex-col items-center'}>
                <CustomInput id='username' autoComplete='username' title='E-mail' inputValue={credentials.email} inputType={'email'} handleChange={(value: string) => setCredentials((prevState) => ({...prevState, email:value}))}/>
                <CustomInput id='current-password' autoComplete='current-password' title='Password' inputValue={credentials.password} inputType={'password'} handleChange={(value: string) => setCredentials((prevState) => ({...prevState, password:value}))}/>
                {error ? <p className='font-light text-blue-500 text-sm text-center w-3/4'>{error}</p> : null}
                {isLoading ? 
                    <AiOutlineLoading3Quarters className=' animate-spin w-5 h-5 text-gray-600'/> 
                    : 
                    <button type='submit' className='text-white bg-blue-500 font-medium w-36 p-2 rounded-md hover:scale-95 transition-all ease-in-out duration-150'>Iniciar sesión</button>
                }
            </form>
        </div>
    )
}

export default Login