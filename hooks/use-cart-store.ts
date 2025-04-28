import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Cart, DeliveryAddress, OrderItem } from '@/types'
import { calcDeliveryDateAndPrice } from '@/lib/actions/order.actions'
import { toast } from 'sonner'

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  deliveryCharge: undefined,
  totalPrice: 0,
  paymentMethod: undefined,
  deliveryAddress: undefined,
  deliveryDateIndex: undefined,
}

interface CartState {
  cart: Cart
  addItem: (item: OrderItem, quantity: number) => Promise<string>
  updateItem: (item: OrderItem, quantity: number) => Promise<void>
  removeItem: (item: OrderItem) => void
  clearCart: () => void
  setDeliveryAddress: (deliveryAddress: DeliveryAddress) => Promise<void>
  setPaymentMethod: (paymentMethod: string) => void
  setDeliveryDateIndex: (index: number) => Promise<void>
}

const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cart: initialState,

      addItem: async (item: OrderItem, quantity: number) => {
        const { items, deliveryAddress } = get().cart
        const existItem = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        )

        if (existItem) {
          if (existItem.countInStock < quantity + existItem.quantity) {
            toast.error('Not enough items in stock')
            throw new Error('Not enough items in stock')
          }
        } else {
          if (item.countInStock < item.quantity) {
            toast.error('Not enough items in stock')
            throw new Error('Not enough items in stock')
          }
        }

        const updatedCartItems = existItem
          ? items.map((x) =>
              x.product === item.product &&
              x.color === item.color &&
              x.size === item.size
                ? { ...existItem, quantity: existItem.quantity + quantity }
                : x
            )
          : [...items, { ...item, quantity }]

        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({
              items: updatedCartItems,
              deliveryAddress,
            })),
          },
        })
        const foundItem = updatedCartItems.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        )
        if (!foundItem) {
          throw new Error('Item not found in cart')
        }
        return foundItem.clientId
        //comment
        // return updatedCartItems.find(
        //   (x) =>
        //     x.product === item.product &&
        //     x.color === item.color &&
        //     x.size === item.size
        // )?.clientId!
      },
      updateItem: async (item: OrderItem, quantity: number) => {
        const { items, deliveryAddress } = get().cart
        const exist = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        )
        if (!exist) return
        const updatedCartItems = items.map((x) =>
          x.product === item.product &&
          x.color === item.color &&
          x.size === item.size
            ? { ...exist, quantity: quantity }
            : x
        )
        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({
              items: updatedCartItems,
              deliveryAddress,
            })),
          },
        })
      },
      removeItem: async (item: OrderItem) => {
        const { items, deliveryAddress } = get().cart
        const updatedCartItems = items.filter(
          (x) =>
            x.product !== item.product ||
            x.color !== item.color ||
            x.size !== item.size
        )
        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({
              items: updatedCartItems,
              deliveryAddress,
            })),
          },
        })
      },
      setDeliveryAddress: async (deliveryAddress: DeliveryAddress) => {
        const { items } = get().cart
        set({
          cart: {
            ...get().cart,
            deliveryAddress,
            ...(await calcDeliveryDateAndPrice({
              items,
              deliveryAddress,
            })),
          },
        })
      },
      setPaymentMethod: (paymentMethod: string) => {
        set({
          cart: {
            ...get().cart,
            paymentMethod,
          },
        })
      },
      setDeliveryDateIndex: async (index: number) => {
        const { items, deliveryAddress } = get().cart

        set({
          cart: {
            ...get().cart,
            ...(await calcDeliveryDateAndPrice({
              items,
              deliveryAddress,
              deliveryDateIndex: index,
            })),
          },
        })
      },
      clearCart: () => {
        set({
          cart: {
            ...get().cart,
            items: [],
          },
        })
      },
      init: () => set({ cart: initialState }),
    }),

    {
      name: 'cart-store',
    }
  )
)
export default useCartStore
