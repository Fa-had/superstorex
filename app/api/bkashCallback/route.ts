import { executeBkashOrder } from '@/lib/actions/order.actions'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams
    const paymentId = query.get('paymentID')
    const myUrl = req.nextUrl.origin

    if (!paymentId) return NextResponse.redirect(`${myUrl}`, 303) // Redirect to the homepage

    const executePaymentResponse = await executeBkashOrder({
      orderID: paymentId,
    })
    const orderId = executePaymentResponse.merchantInvoiceNumber

    if (executePaymentResponse.statusCode !== '0000') {
      return NextResponse.redirect(`${myUrl}`, 303) // Redirect to the homepage
    }

    return NextResponse.redirect(`${myUrl}/account/orders/${orderId}`, 303) // Redirect to the orderpage
  } catch (error) {
    return NextResponse.json({ message: `Something went wrong${error}` })
  }
}
