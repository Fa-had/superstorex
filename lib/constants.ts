export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || 'value NULL, CHECK lib/constants.ts'
export const APP_SLOGAN =
  process.env.NEXT_PUBLIC_APP_SLOGAN || 'value NULL, CHECK lib/constants.ts'
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'value NULL, CHECK lib/constants.ts'

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
export const SENDER_NAME = process.env.SENDER_NAME || 'SuperStoreX Support'
export const SENDER_EMAIL =
  process.env.SENDER_EMAIL || 'superstorex.bd@gmail.com'

export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9)
export const DELIVERY_CHARGE = Number(process.env.DELIVERY_CHRGE || 50)

export const APP_COPYRIGHT =
  process.env.NEXT_PUBLIC_APP_COPYRIGHT ||
  `Copyright © 2025 ${APP_NAME}, All rights reserved`

export const AVAILABLE_PAYMENT_METHOD = [
  {
    name: 'Bkash',
    commission: 0,
    isDefault: false,
  },
  {
    name: 'Rocket',
    commission: 0,
    isDefault: false,
  },
  {
    name: 'Cash On Delivery',
    commission: 0,
    isDefault: false,
  },
]

export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || 'Cash on Delivery'

export const AVAILABLE_DELIVERY_DATES = [
  {
    name: 'Today',
    daysToDelivery: 0,
    deliveryCharge: 70,
    freeDeliveryMinCharge: 0,
  },
  {
    name: 'Tomorrow',
    daysToDelivery: 1,
    deliveryCharge: 40,
    freeDeliveryMinCharge: 0,
  },
  {
    name: 'Next 3-5 Days',
    daysToDelivery: 5,
    deliveryCharge: 20,
    freeDeliveryMinCharge: 0,
  },
  {
    name: 'Next 20 Days',
    daysToDelivery: 20,
    deliveryCharge: 0,
    freeDeliveryMinCharge: 0,
  },
]
