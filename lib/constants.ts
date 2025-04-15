export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || 'value NULL, CHECK lib/constants.ts'
export const APP_SLOGAN =
  process.env.NEXT_PUBLIC_APP_SLOGAN || 'value NULL, CHECK lib/constants.ts'
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'value NULL, CHECK lib/constants.ts'

export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9)
export const DELIVERY_CHARGE = Number(process.env.DELIVERY_CHRGE || 50)

export const APP_COPYRIGHT =
  process.env.NEXT_PUBLIC_APP_COPYRIGHT ||
  `Copyright © 2025 ${APP_NAME}, All rights reserved`
