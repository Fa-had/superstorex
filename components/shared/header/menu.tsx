import Link from 'next/link'

export default function Menu() {
  return (
    <div className='flex justify-end'>
      <nav className='flex gap-3 w-full'>
        <Link href='/signin' className='flex items-center header-button'>
          Hello, Sign in
        </Link>
        {/* Comment out when website ready */}
        {/* <CartButton /> */}
      </nav>
    </div>
  )
}
