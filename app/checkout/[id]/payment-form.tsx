'use client'

import { Card, CardContent } from '@/components/ui/card'
import { createBkashOrder } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/db/models/order.model'
import { formatDateTime } from '@/lib/utils'

import CheckoutFooter from '../checkout-footer'
import { redirect, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import ProductPrice from '@/components/shared/product/product-price'
import { toast } from 'sonner'

export default function OrderDetailsForm({
  order,
}: {
  order: IOrder
  isAdmin: boolean
}) {
  const router = useRouter()
  const {
    deliveryAddress,
    items,
    itemsPrice,
    deliveryCharge,
    totalPrice,
    paymentMethod,
    expectedDeliveryDate,
    isPaid,
  } = order

  if (isPaid) {
    redirect(`/account/orders/${order._id}`)
  }
  //   function PrintLoadingState() {
  //     const [{ isPending, isRejected }] = usePayPalScriptReducer()
  //     let status = ''
  //     if (isPending) {
  //       status = 'Loading PayPal...'
  //     } else if (isRejected) {
  //       status = 'Error in loading PayPal.'
  //     }
  //     return status
  //   }
  const handlePayment = async () => {
    try {
      const res = await createBkashOrder(order._id)
      if (!res.success) return toast.error(res.message)
      if (res.url) {
        router.push(res.url)
      }
    } catch (error) {
      console.log(error)
      alert('Something went wrong')
    }
  }

  const CheckoutSummary = () => (
    <Card>
      <CardContent className='p-4'>
        <div>
          <div className='text-lg font-bold'>Order Summary</div>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Items:</span>
              <span>
                {' '}
                <ProductPrice price={itemsPrice} plain />
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Delivery & Handling:</span>
              <span>
                {deliveryCharge === undefined ? (
                  '--'
                ) : deliveryCharge === 0 ? (
                  'FREE'
                ) : (
                  <ProductPrice price={deliveryCharge} plain />
                )}
              </span>
            </div>
            <div className='flex justify-between  pt-1 font-bold text-lg'>
              <span> Order Total:</span>
              <span>
                {' '}
                <ProductPrice price={totalPrice} plain />
              </span>
            </div>

            {!isPaid && paymentMethod === 'Bkash' && (
              <div>
                <Button onClick={handlePayment}>Bkash</Button>
              </div>
            )}
            {!isPaid && paymentMethod === 'Rocket' && <div></div>}

            {!isPaid && paymentMethod === 'Cash On Delivery' && (
              <Button
                className='w-full rounded-full'
                onClick={() => router.push(`/account/orders/${order._id}`)}
              >
                View Order
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <main className='max-w-6xl mx-auto'>
      <div className='grid md:grid-cols-4 gap-6'>
        <div className='md:col-span-3'>
          {/* Delivery Address */}
          <div>
            <div className='grid md:grid-cols-3 my-3 pb-3'>
              <div className='text-lg font-bold'>
                <span>Delivery Address</span>
              </div>
              <div className='col-span-2'>
                <p>
                  {deliveryAddress.fullName} <br />
                  {deliveryAddress.street} <br />
                  {`${deliveryAddress.city}, ${deliveryAddress.division}, ${deliveryAddress.postalCode}`}
                </p>
              </div>
            </div>
          </div>

          {/* payment method */}
          <div className='border-y'>
            <div className='grid md:grid-cols-3 my-3 pb-3'>
              <div className='text-lg font-bold'>
                <span>Payment Method</span>
              </div>
              <div className='col-span-2'>
                <p>{paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className='grid md:grid-cols-3 my-3 pb-3'>
            <div className='flex text-lg font-bold'>
              <span>Items and delivery</span>
            </div>
            <div className='col-span-2'>
              <p>
                Delivery date:
                {formatDateTime(expectedDeliveryDate).dateOnly}
              </p>
              <ul>
                {items.map((item) => (
                  <li key={item.slug}>
                    {item.name} x {item.quantity} = {item.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='block md:hidden'>
            <CheckoutSummary />
          </div>

          <CheckoutFooter />
        </div>
        <div className='hidden md:block'>
          <CheckoutSummary />
        </div>
      </div>
    </main>
  )
}
