'use client'

import dynamic from 'next/dynamic'

const DownloadInvoice = dynamic(
  () => import('./pdf-generator').then((mod) => mod.DownloadInvoiceButton),
  { ssr: false }
)

export default DownloadInvoice
