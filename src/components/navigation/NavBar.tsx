import Link from 'next/link'
import React from 'react'
import {GrTest} from 'react-icons/gr';
import {useUser, useSupabaseClient} from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Image from 'next/image';
type Props = {}

function NavBar({}: Props) {
  const supabaseClient = useSupabaseClient()
  const user = useUser();
  const router = useRouter()
  const handleSignOut = async () => {
    const {error} = await supabaseClient.auth.signOut();
    if(!error){
      router.push('/');
    }
  }
  return (
    <div className=' w-3/4 my-5 h-16 p-5 flex items-center justify-between'>
        <div className='flex items-center space-x-5'>
            <div className='relative flex items-center h-6 w-6'>
              <Image src={'/abstergoLogo.png'} fill alt='Abstergo logo'/>
            </div>
            <p className='font-bold text-2xl text-gray-800'>Abstergo</p>
        </div>
        <ul id='MenuLinks' className='font-semibold space-x-12 text-gray-700'>
            <Link href={'/'} legacyBehavior><a className='hover:text-blue-500'>Inicio</a></Link>
            {
              !user ? 
                <Link href={'/signin'} legacyBehavior><a className='hover:text-blue-500'>Iniciar sesión</a></Link>
              :
                <Link href={'/admin'} legacyBehavior><a className='hover:text-blue-500'>{user.email}</a></Link>
            }
            {
              user ? <button className='bg-blue-500 rounded-md font-medium text-white w-28 p-2 hover:scale-95 transition-all ease-in-out duration-150' type='button' onClick={handleSignOut}>Cerrar sesión</button>
              : null
            }
        </ul>
    </div>
  )
}

export default NavBar