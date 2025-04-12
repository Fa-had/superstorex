'use client'
import { APP_NAME } from '@/lib/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Notfound = () => {
  const pathname = usePathname()
  return (
    <div className='w-full h-[600px] flex items-center justify-center'>
      <div className="flex-col sm:flex justify-center w-[600px] h-[250px] bg-[url('/icons/Image404.png')] bg-no-repeat bg-right">
        <div className='flex flex-col w-[390px] h-[180px]'>
          <Link href={'/'}>
            <span className='flex items-center font-bold dark:font-semibold text-lg md:text-3xl font-in h-14 w-80 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent'>
              {APP_NAME}
            </span>
          </Link>
          <p className='text-[#222] dark:text-light mx-0 mt-[11px] mb-[22px] font-mr'>
            <b>404. </b>
            <ins className='text-[#777] no-underline'>
              That&apos;s an error.
            </ins>
          </p>
          <p className='text-[#222] dark:text-light mx-0 mt-[11px] mb-[22px] font-mr'>
            The requested URL
            <code> {pathname} </code>
            was not found on this server.
            <ins className='text-[#777] no-underline'>
              That&apos;s all we know.
            </ins>
          </p>
          <Link className='text-blue-500 underline' href='/'>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Notfound
