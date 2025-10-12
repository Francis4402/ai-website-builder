import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import AppSidebar from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'
import { userData } from '@/server/users'

const WorkSpaceLayout = async ({children}: {children: React.ReactNode}) => {

    const session = await userData();

  return (
    <SidebarProvider>
        <AppSidebar session={session} />
        <div className='w-full'>
            <AppHeader session={session} />
            {children}
        </div>
    </SidebarProvider>
  )
}

export default WorkSpaceLayout