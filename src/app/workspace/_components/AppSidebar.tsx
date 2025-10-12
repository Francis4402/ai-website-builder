"use client"

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader } from '@/components/ui/sidebar'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { NavUser } from './NavUser'


const AppSidebar = ({session}: {session: any}) => {

    const [projectList, setProjectList] = useState([]);


  return (
    <Sidebar>
        <SidebarHeader>
            <div className='flex items-center gap-2'>
                <Image src={'/logo.svg'} alt='i' width={35} height={35} />
                <h1 className='font-bold text-xl'>Ai Website Builder</h1>
            </div>
            <Link href={'/workspace'} className='mt-5 w-full'>
                <Button className='w-full'>+ Add New Project</Button>
            </Link>
        </SidebarHeader>
        <SidebarContent className='p-2'>
            <SidebarGroup>
                <SidebarGroupLabel>Projects</SidebarGroupLabel>
                {projectList.length === 0 && <h2 className='text-sm px-2 text-gray-500'>No Project Found</h2>}
            </SidebarGroup>
            <SidebarGroup />
        </SidebarContent>
        <SidebarFooter>
            <div className='p-3 border rounded-xl space-y-3 bg-secondary'>
                <h2>Remaining Credits <span className='font-bold'>{session?.user?.credites}</span></h2>
                <Progress value={33} />
                <Button className='w-full'>
                    Upgrade to Unlimited
                </Button>
            </div>
            <NavUser user={session?.user} />
        </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar