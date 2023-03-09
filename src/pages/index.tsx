import ProjectCard from '@/components/homepage/ProjectCard'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className=''>
      <Head>
        <title>Abstergo</title>
        <meta name="description" content="Gestor de emplados Abstergo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main id='' className='space-y-16 pb-5'>
        <div id='introduction' className='mt-12 text-center space-y-16 flex flex-col items-center'>
          <h1 className='font-semibold text-3xl text-gray-700'>Bienvenido a Abstergo</h1>
          <p className='w-1/2 text-center text-lg font-medium text-gray-500'>En Abstergo nos preocupamos por el futuro de la humanidad, nos compremetemos a mejorar la calidad de vida de las personas mediante el desarrollo de tecnologías innovadoras.</p>
        </div>
        <div className='flex flex-col space-y-20 justify-center items-center p-5'>
          <h4 className='font-semibold text-2xl text-gray-600'>Nuestros proyectos</h4>
          <div className='flex flex-col justify-between w-full landscape:2xl:flex-row'>
            <ProjectCard title='Animus' imagePath='/animus.webp' description='Una máquina que permite al usuario, viajar al pasado y disfrutar emocionantes aventuras.' />
            <ProjectCard title='Herne+' description='Suplementos alimenticios con proteína de alta calidad, poco más de 27 superalimentos que te proporcionaran energía y vitalidad.' imagePath='/hernelogo.webp' />
            <ProjectCard title='Animus Os Valhalla' description='El nuevo sistema operativo para el Animus ya está aquí, explora el maravilloso mundo de los vikingos.' imagePath='/acvalhalla.webp' />

          </div>
        </div>
      </main>
    </div>
  )
}
