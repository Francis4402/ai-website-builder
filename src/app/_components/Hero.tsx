"use client"

import { Button } from '@/components/ui/button'
import { ArrowUp, HomeIcon, ImagePlus, Key, LayoutDashboard, Loader2, User } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const suggesions = [
    {
        label: 'Dashboard',
        prompt: 'Create an analytics dashboard to track customers and revenue data for a Sass',
        icon: LayoutDashboard
    },
    {
        label: 'SignUp Form',
        prompt: 'Create a modern sign up form with email/password fields, Google and Github login options and terms checkbox',
        icon: Key
    },
    {
        label: 'Hero',
        prompt: 'Create a mordern header and centered hero section for a productivity Sass. Include a badge for feature announcement, a this with a subtle gradient effect.',
        icon: HomeIcon
    },
    {
        label: 'User Profile Card',
        prompt: 'Create a modern user profile card component for a social media website.',
        icon: User
    }
]

const generateRandom = () => {
    const num = Math.floor(Math.random() * 10000);
    return num;
}

const Hero = () => {

    const [userInput, setUserInput] = useState<string>();

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const CreateProject = async () => {
        setLoading(true);
        const projectId = uuidv4();
        const frameId = generateRandom();
        const messages = [
            {
                role: 'user',
                content: userInput
            }
        ]
        try {
            const result = await axios.post('/api/projects', {
                projectId: projectId,
                frameId: frameId,
                messages: messages
            });
            console.log(result.data);
            toast.success('Project Created Successfully');

            router.push(`/playground/${projectId}?frameId=${frameId}`)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error('Error in creating project');
            console.log(error);
        }
    }


  return (
    <div className='flex flex-col items-center h-[80vh] justify-center'>
        <h1 className='font-bold text-6xl'>What Should We Design?</h1>
        <p className='mt-2 text-xl text-gray-500'>Generate, Edit and Explore design with AI, Export code as well</p>

        <div className='w-full max-w-2xl p-5 border mt-5 rounded-2xl'>
            <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder='Describe your page design' className='w-full h-24 focus:outline-none focus:ring-0 resize-none' />
            <div className='flex justify-between items-center'>
                <Button variant={'ghost'}><ImagePlus /></Button>
                <Button disabled={!userInput || loading} onClick={CreateProject}>{loading ? <Loader2 className='animate-spin' /> : <ArrowUp/>}</Button>
            </div>
        </div>

        <div className='mt-4 flex gap-3'>
            {suggesions.map((suggesion, index) => (
                <Button key={index} variant={'outline'} onClick={() => setUserInput(suggesion.prompt)}>
                    <suggesion.icon />
                    {suggesion.label}
                </Button>
            ))}
        </div>
    </div>
  )
}

export default Hero