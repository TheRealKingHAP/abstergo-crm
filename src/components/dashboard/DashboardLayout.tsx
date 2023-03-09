import React from 'react'
import Sidebar from './Navigation/Sidebar'

type Props = {
    
}

function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <main className='flex divide-x-2 bg-[#fdfdfd] justify-between min-w-[100vw] min-h-[calc(100vh-6.5rem)]'>
        <Sidebar />
        <div className='flex-1 '>
        {children}
        </div>
    </main>
  )
}

export default DashboardLayout