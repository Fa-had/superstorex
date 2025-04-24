// import { notFound } from 'next/navigation'
// import React from 'react'

// import { auth } from '@/auth'
// import { getOrderById } from '@/lib/actions/order.actions'
// import OrderDetailsForm from '@/components/shared/order/order-details-form'
// import Link from 'next/link'
// import { formatId } from '@/lib/utils'

// export async function generateMetadata(props: {
//   params: Promise<{ id: string }>
// }) {
//   const params = await props.params

//   return {
//     title: `Order ${formatId(params.id)}`,
//   }
// }

// export default async function OrderDetailsPage(props: {
//   params: Promise<{
//     id: string
//   }>
// }) {
//   const params = await props.params

//   const { id } = params

//   const order = await getOrderById(id)
//   if (!order) notFound()

//   const session = await auth()

//   return (
//     <>
//       <div className='flex gap-2'>
//         <Link href='/account'>Your Account</Link>
//         <span>›</span>
//         <Link href='/account/orders'>Your Orders</Link>
//         <span>›</span>
//         <span>Order {formatId(order._id)}</span>
//       </div>
//       <h1 className='h1-bold py-4'>Order {formatId(order._id)}</h1>
//       <OrderDetailsForm
//         order={order}
//         isAdmin={session?.user?.role === 'Admin' || false}
//       />
//     </>
//   )
// }

import { Metadata } from 'next'
import Link from 'next/link'

import Pagination from '@/components/shared/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getMyOrders } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/db/models/order.model'
import { formatDateTime, formatId } from '@/lib/utils'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import ProductPrice from '@/components/shared/product/product-price'

const PAGE_TITLE = 'Your Orders'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}
export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>
}) {
  const searchParams = await props.searchParams
  const page = Number(searchParams.page) || 1
  const orders = await getMyOrders({
    page,
  })
  return (
    <div>
      <div className='flex gap-2'>
        <Link href='/account'>Your Account</Link>
        <span>›</span>
        <span>{PAGE_TITLE}</span>
      </div>
      <h1 className='h1-bold pt-4'>{PAGE_TITLE}</h1>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className=''>
                  You have no orders.
                </TableCell>
              </TableRow>
            )}
            {orders.data.map((order: IOrder) => (
              <TableRow key={order._id}>
                <TableCell>
                  <Link href={`/account/orders/${order._id}`}>
                    {formatId(order._id)}
                  </Link>
                </TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt!).dateTime}
                </TableCell>
                <TableCell>
                  <ProductPrice price={order.totalPrice} plain />
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : 'No'}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : 'No'}
                </TableCell>
                <TableCell>
                  <Link href={`/account/orders/${order._id}`}>
                    <span className='px-2'>Details</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination page={page} totalPages={orders.totalPages} />
        )}
      </div>
      <BrowsingHistoryList className='mt-16' />
    </div>
  )
}
