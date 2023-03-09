import Image from 'next/image'
import React from 'react'

type Props = {
  imagePath?: string,
  title: string,
  description: string,
  className?: string
}

function ProjectCard({description, title, className, imagePath}: Props) {
  return (
    <div className={`bg-white cursor-pointer hover:scale-95 transition-all ease-in-out duration-150 flex flex-col max-w-xs rounded-lg shadow-lg ${className}`}>
      <div className='relative h-52 w-full rounded-t-md'>
        {imagePath ? <Image src={imagePath} fill alt='Card project image' className='rounded-t-lg'/> : null}
      </div>
      <div className='flex px-6 py-4 text-justify flex-col space-y-2 items-start h-full flex-1'>
        <p className='font-semibold text-gray-600 text-xl'>{title}</p>
        <p className='text-base font-medium text-gray-500'>{description}</p>
      </div>
    </div>
  )
}

export default ProjectCard