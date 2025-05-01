import {
  CarouselSchema,
  CartSchema,
  DeliveryAddressSchema,
  DeliveryDateSchema,
  OrderInputSchema,
  OrderItemSchema,
  PaymentMethodSchema,
  ProductInputSchema,
  ProductUpdateSchema,
  ReviewInputSchema,
  SettingInputSchema,
  SiteCurrencySchema,
  SiteLanguageSchema,
  UserInputSchema,
  UserNameSchema,
  UserSignInSchema,
  UserSignUpSchema,
  UserUpdateSchema,
  WebPageInputSchema,
  WebPageUpdateSchema,
} from '@/lib/validator'
import { z } from 'zod'

//Review
export type IReviewInput = z.infer<typeof ReviewInputSchema>
export type IReviewDetails = IReviewInput & {
  _id: string
  createdAt: string
  user: {
    name: string
  }
}

export type IProductInput = z.infer<typeof ProductInputSchema>
export type IProductUpdate = z.infer<typeof ProductUpdateSchema>

export type Data = {
  users: IUserInput[]
  products: IProductInput[]
  webPages: IWebPageInput[]
  reviews: {
    title: string
    rating: number
    comment: string
  }[]
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
  settings: ISettingInput[]
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
//Order
export type OrderItem = z.infer<typeof OrderItemSchema>
export type Cart = z.infer<typeof CartSchema>
export type DeliveryAddress = z.infer<typeof DeliveryAddressSchema>
export type IOrderInput = z.infer<typeof OrderInputSchema>
export type IOrderList = IOrderInput & {
  _id: string
  user: {
    name: string
    email: string
  }
  createdAt: Date
}

//User
export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>
export type IUserSignUp = z.infer<typeof UserSignUpSchema>
export type IUserName = z.infer<typeof UserNameSchema>
export type IUserUpdate = z.infer<typeof UserUpdateSchema>

//image
export type IImage = {
  fileUrls: string[]
  fileIds: string[]
}
//credential
export type ICredential = {
  client_email: string
  private_key: string
}

// webpage
export type IWebPageInput = z.infer<typeof WebPageInputSchema>
export type IWebPageUpdate = z.infer<typeof WebPageUpdateSchema>

// setting
export type ICarousel = z.infer<typeof CarouselSchema>
export type ISettingInput = z.infer<typeof SettingInputSchema>
export type ClientSetting = ISettingInput & {
  currency: string
}
export type SiteLanguage = z.infer<typeof SiteLanguageSchema>
export type SiteCurrency = z.infer<typeof SiteCurrencySchema>
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>
export type DeliveryDate = z.infer<typeof DeliveryDateSchema>
