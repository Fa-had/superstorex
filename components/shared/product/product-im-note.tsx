import { useTranslations } from 'next-intl'
import React from 'react'

export function ProductNote({
  note,
  className,
}: {
  note: string
  className?: string
}) {
  const t = useTranslations()
  return <div className={className}>{t(`${note}`)}</div>
}
