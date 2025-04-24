import CartButton from './cart-button'

export default function Menu() {
  return (
    <div className='flex justify-end'>
      <nav className='flex gap-3 w-full'>
        {/* Comment out when website ready */}
        {/* <UserButton /> */}
        <CartButton />
      </nav>
    </div>
  )
}
