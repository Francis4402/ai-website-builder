import { Button } from '@/components/ui/button'
import { userData } from '@/server/users'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'


const MenuOptions = [
    {
        name: 'Pricing',
        path: '/pricing',
    },
    {
        name: 'Contact Us',
        path: '/contact-us'
    }
]

const Header = async () => {

    const session = await userData();

  return (
    <div className='flex items-center justify-between p-4 shadow-lg'>
        {/* logo x */}
        <div className='flex gap-2 items-center'>
            <Image src={'/logo.svg'} alt='i' width={35} height={35} />
            <h2 className='font-bold text-xl'>Ai Website Generator {session?.user?.name}</h2>
        </div>

        {/* Menu Options */}
        <div className='flex gap-3'>
            {
                MenuOptions.map((menu, index) => (
                    <Button variant={'ghost'} key={index}>{menu.name}</Button>
                ))
            }
        </div>

        {
            !session ? (
                <Link href={"/login"}>
                    <Button variant={'outline'}>Login</Button>
                </Link>
            ) : (
                <div>
                    <Link href={"/workspace"}><Button>Get Started <ArrowRight/></Button></Link>
                </div>
            )
        }
    </div>
  )
}

export default Header