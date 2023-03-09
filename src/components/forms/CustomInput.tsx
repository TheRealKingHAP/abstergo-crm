import React from 'react'

type InputProps = {
    title?: string,
    id?: string
    inputType?: string,
    inputValue: string | number
    handleChange: CallableFunction
    autoComplete?: string
    className?: string,
    required?: true | false,
    maxLength?: number,
    minLength?: number,
}

function CustomInput({title, minLength ,maxLength ,required ,inputType, handleChange, inputValue, className, autoComplete, id}: InputProps) {
  return (
    <div className='relative w-full'>
        <input minLength={minLength} maxLength={maxLength} required={required ? required : false} id={id} autoComplete={autoComplete} type={inputType ? inputType : 'text'} value={inputValue} placeholder={title || 'My Input'} className={`peer outline-none h-10 landscape:2xl:px-2 w-full placeholder-transparent border-b-2 landscape:2xl:border-2 landscape:2xl:rounded-lg border-gray-300 focus:border-b-blue-400 landscape:2xl:focus:border-blue-400 bg-transparent ${className} `} onChange={(e) => handleChange(e.target.value)}></input>
        <label className='pointer-events-none absolute left-0 landscape:2xl:left-2 -top-3.5 landscape:2xl:-top-5 text-blue-400 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:text-sm peer-focus:-top-3.5 landscape:2xl:peer-focus:-top-5 peer-focus:text-blue-400 transition-all duration-150 ease-in-out'>{title ? title : 'My input'}</label>
    </div>
  )
} 

export default CustomInput