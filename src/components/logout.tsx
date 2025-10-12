"use client"

import { authClient } from '@/lib/auth-client'
import React from 'react'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const Logout = () => {
    const router = useRouter();
    
    const handleLogout = async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.success('You have been logged out successfully');
            }
          }
        });
        router.push("/");
    }

  return (
    <Button variant={"outline"} onClick={handleLogout}>Logout</Button>
  )
}

export default Logout