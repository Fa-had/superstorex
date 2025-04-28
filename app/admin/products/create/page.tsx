import Link from 'next/link'
import { Metadata } from 'next'
import ProductCreateForm from '../product-create-form'
import { auth } from '@/auth'

export const metadata: Metadata = {
  title: 'Create Product',
}

const CreateProductPage = async () => {
  const session = await auth()
  if (session?.user.role !== 'Admin')
    throw new Error('Admin permission required')
  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href='/admin/products'>Products</Link>
        <span className='mx-1'>›</span>
        <Link href='/admin/products/create'>Create</Link>
      </div>

      <div className='my-8'>
        <ProductCreateForm />
      </div>
    </main>
  )
}

export default CreateProductPage
