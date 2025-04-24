import {
  CartSchema,
  DeliveryAddressSchema,
  OrderInputSchema,
  OrderItemSchema,
  ProductInputSchema,
  UserInputSchema,
  UserSignInSchema,
  UserSignUpSchema,
} from '@/lib/validator'
import { z } from 'zod'

export type IProductInput = z.infer<typeof ProductInputSchema>

export type Data = {
  users: IUserInput[]
  products: IProductInput[]
  headerMenus: {
    name: string
    href: string
  }[]
  carousels: {
    image: string
    url: string
    title: string
    buttonCaption: string
    isPublished: boolean
  }[]
}
export type BkashConfig = {
  base_url: string | undefined
  username: string | undefined
  password: string | undefined
  app_key: string | undefined
  app_secret: string | undefined
}

export type PaymentDetails = {
  amount: number // your product price
  callbackURL: string // your callback route
  orderID: string // your orderID
  reference: string
}

export type OrderItem = z.infer<typeof OrderItemSchema>
export type Cart = z.infer<typeof CartSchema>
export type DeliveryAddress = z.infer<typeof DeliveryAddressSchema>
export type IOrderInput = z.infer<typeof OrderInputSchema>

//user
export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>
export type IUserSignUp = z.infer<typeof UserSignUpSchema>
