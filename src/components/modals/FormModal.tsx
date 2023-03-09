import React, { useEffect, useState } from 'react'

type Props = {
    title: string,
    className?: string
    children?: React.ReactNode,
    isActive?: boolean,
    outsideCloseFunction: CallableFunction
}

function FormModal({children, title, className, isActive, outsideCloseFunction}: Props) {
    useEffect(() => {
        return () => {}
    }, [isActive])
  return (
    <div className={`fixed z-20 h-screen w-screen flex justify-center items-center top-0 left-0 transition-all ease-in-out duration-150 ${isActive ? 'scale-100' : 'scale-0'}`}>
        <div onClick={() => outsideCloseFunction(false)}  className=' h-full w-full absolute'>
        </div>
        <div className={`flex z-50 flex-col items-center p-5 h-[40rem] w-96 bg-white shadow-xl rounded-lg ${className}`}>
            <div className='font-medium text-gray-700 '>
                <h4>{title}</h4>
            </div>
            {children}
        </div>
    </div>
  )
}

export default FormModal