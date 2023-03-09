import Link from 'next/link'
import { useRouter } from 'next/router';
import path from 'path';
import React from 'react'
import { IconType } from 'react-icons';
import {HiTableCells, HiUsers} from 'react-icons/hi2';
import {GrTest} from 'react-icons/gr';

type Props = {}

function Sidebar({}: Props) {
    const router = useRouter()
    const active = 'text-blue-500'
    const inactive = 'text-gray-700'
    return (
        <div className='w-16 divide-y-2  bg-[#fdfdfd] flex flex-col items-center space-y-5'>
            <ul className='flex flex-col items-center space-y-5'>
                <li>
                    <Link href={'/admin'}>
                        <SidebarIcon className={router.pathname === '/admin' ? active : inactive} icon={<HiTableCells className='w-6 h-6'/>}/>
                    </Link>
                </li>
                <li>
                    <Link href={'/admin/credentials'}>
                        <SidebarIcon className={router.pathname === '/admin/credentials' ? active : inactive} icon={<HiUsers className='w-6 h-6'/>}/>
                    </Link>
                </li>
            </ul>
        </div>
    )
}

const SidebarIcon = ({icon, className}: {icon: React.ReactElement<IconType>, className?: string}) => (
    <div className={`rounded-md hover:bg-gray-200 transition-all ease-in-out duration-150 p-2  ${className}`}>
        {icon}
    </div>
);

export default Sidebar