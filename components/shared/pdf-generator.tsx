'use client'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { IOrder } from '../../lib/db/models/order.model'
import { InvoicePdf } from '@/components/shared/InvoicePdf'

export function DownloadInvoiceButton({ order }: { order: IOrder }) {
  return (
    <PDFDownloadLink
      document={<InvoicePdf order={order} />}
      fileName={`invoice-${order._id}.pdf`}
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-full rounded-full bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3"
    >
      {({ loading }) => (loading ? 'Loading document...' : 'Download Invoice')}
    </PDFDownloadLink>
  )
}
