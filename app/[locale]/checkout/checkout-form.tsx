'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  calculateFutureDate,
  formatDateTime,
  timeUntilMidnight,
} from '@/lib/utils'
import { DeliveryAddressSchema } from '@/lib/validator'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import CheckoutFooter from './checkout-footer'
import { DeliveryAddress } from '@/types'
import useIsMounted from '@/hooks/use-is-mounted'
import Link from 'next/link'
import useCartStore from '@/hooks/use-cart-store'
import ProductPrice from '@/components/shared/product/product-price'
import { createOrder } from '@/lib/actions/order.actions'
import { toast } from 'sonner'
import useSettingStore from '@/hooks/use-setting-store'
import { useTranslations } from 'next-intl'

const deliveryAddressDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        fullName: 'Tester',
        street: '123',
        city: 'Dhala',
        division: 'Dhaka',
        phone: '4181234567',
        postalCode: '1000',
      }
    : {
        fullName: '',
        street: '',
        city: '',
        division: '',
        phone: '',
        postalCode: '',
      }

const CheckoutForm = () => {
  const t = useTranslations()
  const router = useRouter()
  const {
    setting: {
      site,
      availablePaymentMethods,
      defaultPaymentMethod,
      availableDeliveryDates,
    },
  } = useSettingStore()
  const {
    cart: {
      items,
      itemsPrice,
      deliveryCharge,
      totalPrice,
      deliveryAddress,
      deliveryDateIndex,
      paymentMethod = defaultPaymentMethod,
    },
    setDeliveryAddress,
    setPaymentMethod,
    clearCart,
    updateItem,
    removeItem,
    setDeliveryDateIndex,
  } = useCartStore()
  const isMounted = useIsMounted()

  const deliveryAddressForm = useForm<DeliveryAddress>({
    resolver: zodResolver(DeliveryAddressSchema),
    defaultValues: deliveryAddress || deliveryAddressDefaultValues,
  })
  const onSubmitDeliveryAddress: SubmitHandler<DeliveryAddress> = (values) => {
    setDeliveryAddress(values)
    setIsAddressSelected(true)
  }

  useEffect(() => {
    if (!isMounted || !deliveryAddress) return
    deliveryAddressForm.setValue('fullName', deliveryAddress.fullName)
    deliveryAddressForm.setValue('street', deliveryAddress.street)
    deliveryAddressForm.setValue('city', deliveryAddress.city)
    deliveryAddressForm.setValue('postalCode', deliveryAddress.postalCode)
    deliveryAddressForm.setValue('division', deliveryAddress.division)
    deliveryAddressForm.setValue('phone', deliveryAddress.phone)
  }, [items, isMounted, router, deliveryAddress, deliveryAddressForm])

  const [isAddressSelected, setIsAddressSelected] = useState<boolean>(false)
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] =
    useState<boolean>(false)
  const [isDeliveryDateSelected, setIsDeliveryDateSelected] =
    useState<boolean>(false)

  const handlePlaceOrder = async () => {
    const res = await createOrder({
      items,
      deliveryAddress,
      expectedDeliveryDate: calculateFutureDate(
        availableDeliveryDates[deliveryDateIndex!].daysToDeliver
      ),
      deliveryDateIndex,
      paymentMethod,
      itemsPrice,
      deliveryCharge,
      totalPrice,
    })
    if (!res.success) {
      toast.error(res.message)
    } else {
      toast.success(res.message)
      clearCart()
      router.push(`/checkout/${res.data?.orderId}`)
    }
  }
  const handleSelectPaymentMethod = () => {
    setIsAddressSelected(true)
    setIsPaymentMethodSelected(true)
  }
  const handleSelectDeliveryAddress = () => {
    deliveryAddressForm.handleSubmit(onSubmitDeliveryAddress)()
  }
  const CheckoutSummary = () => (
    <Card>
      <CardContent className='p-4'>
        {!isAddressSelected && (
          <div className='border-b mb-4'>
            <Button
              className='rounded-full w-full'
              onClick={handleSelectDeliveryAddress}
            >
              {t('Checkout.Deliver to this address')}
            </Button>
            <p className='text-xs text-center py-2'>
              {t(
                'Checkout.Choose a delivery address and payment method in order to calculate delivery charge, handling'
              )}
            </p>
          </div>
        )}
        {isAddressSelected && !isPaymentMethodSelected && (
          <div className=' mb-4'>
            <Button
              className='rounded-full w-full'
              onClick={handleSelectPaymentMethod}
            >
              {t('Checkout.Use this payment method')}
            </Button>

            <p className='text-xs text-center py-2'>
              {t('Checkout.Choose a payment method to continue checking out')} .
              {t(
                'Checkout.You will still have a chance to review and edit your order before it is final'
              )}
            </p>
          </div>
        )}
        {isPaymentMethodSelected && isAddressSelected && (
          <div>
            <Button onClick={handlePlaceOrder} className='rounded-full w-full'>
              {t('Checkout.Place Your Order')}
            </Button>
            <p className='text-xs text-center py-2'>
              {t('Checkout.By placing your order, you agree to')} {site.name}
              &apos;s{' '}
              <Link href='/page/privacy-policy'>
                {t('Checkout.privacy notice')}
              </Link>{' '}
              {t('Checkout.and')}
              <Link href='/page/conditions-of-use'>
                {' '}
                {t('Checkout.conditions of use')}
              </Link>
              .
            </p>
          </div>
        )}

        <div>
          <div className='text-lg font-bold'>{t('Checkout.Order Summary')}</div>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>{t('Checkout.Item(s)')}:</span>
              <span>
                <ProductPrice price={itemsPrice} plain />
              </span>
            </div>
            <div className='flex justify-between'>
              <span>
                {t('Cart.Delivery')} & {t('Checkout.Handling')}:
              </span>
              <span>
                {deliveryCharge === undefined ? (
                  '--'
                ) : deliveryCharge === 0 ? (
                  'FREE'
                ) : (
                  <ProductPrice price={deliveryCharge} plain />
                )}
              </span>
            </div>
            <div className='flex justify-between  pt-4 font-bold text-lg'>
              <span> {t('Checkout.Order Total')}:</span>
              <span>
                <ProductPrice price={totalPrice} plain />
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <main className='max-w-6xl mx-auto highlight-link'>
      <div className='grid md:grid-cols-4 gap-6'>
        <div className='md:col-span-3'>
          {/* delivery address */}
          <div>
            {isAddressSelected && deliveryAddress ? (
              <div className='grid grid-cols-1 md:grid-cols-12    my-3  pb-3'>
                <div className='col-span-5 flex text-lg font-bold '>
                  <span className='w-8'>1 </span>
                  <span>{t('Checkout.Delivery address')}</span>
                </div>
                <div className='col-span-5 '>
                  <p>
                    {deliveryAddress.fullName} <br />
                    {deliveryAddress.street} <br />
                    {`${deliveryAddress.city}, ${deliveryAddress.division}, ${deliveryAddress.postalCode}}`}
                  </p>
                </div>
                <div className='col-span-2'>
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      setIsAddressSelected(false)
                      setIsPaymentMethodSelected(true)
                      setIsDeliveryDateSelected(true)
                    }}
                  >
                    {t('Checkout.Change')}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className='flex text-primary text-lg font-bold my-2'>
                  <span className='w-8'>1 </span>
                  <span>{t('Checkout.Enter Delivery address')}</span>
                </div>
                <Form {...deliveryAddressForm}>
                  <form
                    method='post'
                    onSubmit={deliveryAddressForm.handleSubmit(
                      onSubmitDeliveryAddress
                    )}
                    className='space-y-4'
                  >
                    <Card className='md:ml-8 my-4'>
                      <CardContent className='p-4 space-y-2'>
                        <div className='text-lg font-bold mb-2'>
                          {t('Checkout.Your address')}
                        </div>

                        <div className='flex flex-col gap-5 md:flex-row'>
                          <FormField
                            control={deliveryAddressForm.control}
                            name='fullName'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>{t('Checkout.Full Name')}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t('Checkout.Enter full name')}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            control={deliveryAddressForm.control}
                            name='street'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>
                                  {t('Checkout.Your address')}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t('Checkout.Enter address')}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='flex flex-col gap-5 md:flex-row'>
                          <FormField
                            control={deliveryAddressForm.control}
                            name='city'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>{t('Checkout.City')}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t('Checkout.Enter city')}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={deliveryAddressForm.control}
                            name='division'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>{t('Checkout.Division')}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t('Checkout.Enter division')}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='flex flex-col gap-5 md:flex-row'>
                          <FormField
                            control={deliveryAddressForm.control}
                            name='postalCode'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>
                                  {t('Checkout.Postal Code')}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t(
                                      'Checkout.Enter postal code'
                                    )}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={deliveryAddressForm.control}
                            name='phone'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>
                                  {t('Checkout.Phone number')}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t(
                                      'Checkout.Enter phone number'
                                    )}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className='p-4'>
                        <Button
                          type='submit'
                          className='rounded-full font-bold'
                        >
                          {t('Checkout.Deliver to this address')}
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </Form>
              </>
            )}
          </div>
          {/* payment method */}
          <div className='border-y'>
            {isPaymentMethodSelected && paymentMethod ? (
              <div className='grid  grid-cols-1 md:grid-cols-12  my-3 pb-3'>
                <div className='flex text-lg font-bold  col-span-5'>
                  <span className='w-8'>2 </span>
                  <span>{t('Checkout.Payment Method')}</span>
                </div>
                <div className='col-span-5 '>
                  <p>{paymentMethod}</p>
                </div>
                <div className='col-span-2'>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setIsPaymentMethodSelected(false)
                      if (paymentMethod) setIsDeliveryDateSelected(true)
                    }}
                  >
                    {t('Checkout.Change')}
                  </Button>
                </div>
              </div>
            ) : isAddressSelected ? (
              <>
                <div className='flex text-primary text-lg font-bold my-2'>
                  <span className='w-8'>2 </span>
                  <span>{t('Checkout.Choose a payment method')}</span>
                </div>
                <Card className='md:ml-8 my-4'>
                  <CardContent className='p-4'>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value)}
                    >
                      {availablePaymentMethods.map((pm) => (
                        <div key={pm.name} className='flex items-center py-1 '>
                          <RadioGroupItem
                            disabled={
                              pm.name === 'Bkash' || pm.name === 'Rocket'
                            }
                            value={pm.name}
                            id={`payment-${pm.name}`}
                          />
                          <Label
                            className='font-bold pl-2 cursor-pointer'
                            htmlFor={`payment-${pm.name}`}
                          >
                            {pm.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                  <CardFooter className='p-4'>
                    <Button
                      onClick={handleSelectPaymentMethod}
                      className='rounded-full font-bold'
                    >
                      {t('Checkout.Use this payment method')}
                    </Button>
                  </CardFooter>
                </Card>
              </>
            ) : (
              <div className='flex text-muted-foreground text-lg font-bold my-4 py-3'>
                <span className='w-8'>2 </span>
                <span>{t('Checkout.Choose a payment method')}</span>
              </div>
            )}
          </div>
          {/* items and delivery date */}
          <div>
            {isDeliveryDateSelected && deliveryDateIndex != undefined ? (
              <div className='grid  grid-cols-1 md:grid-cols-12  my-3 pb-3'>
                <div className='flex text-lg font-bold  col-span-5'>
                  <span className='w-8'>3 </span>
                  <span>{t('Checkout.Items and delivery')}</span>
                </div>
                <div className='col-span-5'>
                  <p>
                    {t('Checkout.Delivery date')}:{' '}
                    {
                      formatDateTime(
                        calculateFutureDate(
                          availableDeliveryDates[deliveryDateIndex]
                            .daysToDeliver
                        )
                      ).dateOnly
                    }
                  </p>
                  <ul>
                    {items.map((item, _index) => (
                      <li key={_index}>
                        {item.name} x {item.quantity} = {item.price}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='col-span-2'>
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      setIsPaymentMethodSelected(true)
                      setIsDeliveryDateSelected(false)
                    }}
                  >
                    {t('Checkout.Change')}
                  </Button>
                </div>
              </div>
            ) : isPaymentMethodSelected && isAddressSelected ? (
              <>
                <div className='flex text-primary  text-lg font-bold my-2'>
                  <span className='w-8'>3 </span>
                  <span>{t('Checkout.Review items and delivery')}</span>
                </div>
                <Card className='md:ml-8'>
                  <CardContent className='p-4'>
                    <p className='mb-2'>
                      <span className='text-lg font-bold text-green-700'>
                        {t('Checkout.Arriving')}{' '}
                        {
                          formatDateTime(
                            calculateFutureDate(
                              availableDeliveryDates[deliveryDateIndex!]
                                .daysToDeliver
                            )
                          ).dateOnly
                        }
                      </span>{' '}
                      {t('Checkout.If you order in the next')}{' '}
                      {timeUntilMidnight().hours} {t('Checkout.hours')}{' '}
                      {t('Checkout.and')} {timeUntilMidnight().minutes}{' '}
                      {t('Checkout.minutes')}.
                    </p>
                    <div className='grid md:grid-cols-2 gap-6'>
                      <div>
                        {items.map((item, _index) => (
                          <div key={_index} className='flex gap-4 py-2'>
                            <div className='relative w-16 h-16'>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes='20vw'
                                style={{
                                  objectFit: 'contain',
                                }}
                              />
                            </div>

                            <div className='flex-1'>
                              <p className='font-semibold'>
                                {item.name}, {item.color}, {item.size}
                              </p>
                              <p className='font-bold'>
                                <ProductPrice price={item.price} plain />
                              </p>

                              <Select
                                value={item.quantity.toString()}
                                onValueChange={(value) => {
                                  if (value === '0') removeItem(item)
                                  else updateItem(item, Number(value))
                                }}
                              >
                                <SelectTrigger className='w-24'>
                                  <SelectValue>
                                    {t('Checkout.Qty')}: {item.quantity}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent position='popper'>
                                  {Array.from({
                                    length: item.countInStock,
                                  }).map((_, i) => (
                                    <SelectItem key={i + 1} value={`${i + 1}`}>
                                      {i + 1}
                                    </SelectItem>
                                  ))}
                                  <SelectItem key='delete' value='0'>
                                    {t('Cart.Delete')}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className=' font-bold'>
                          <p className='mb-2'>
                            {' '}
                            {t('Checkout.Choose a delivery speed')}:
                          </p>

                          <ul>
                            <RadioGroup
                              value={
                                availableDeliveryDates[deliveryDateIndex!].name
                              }
                              onValueChange={(value) =>
                                setDeliveryDateIndex(
                                  availableDeliveryDates.findIndex(
                                    (address) => address.name === value
                                  )!
                                )
                              }
                            >
                              {availableDeliveryDates.map((dd) => (
                                <div key={dd.name} className='flex'>
                                  <RadioGroupItem
                                    value={dd.name}
                                    id={`address-${dd.name}`}
                                  />
                                  <Label
                                    className='pl-2 space-y-2 cursor-pointer'
                                    htmlFor={`address-${dd.name}`}
                                  >
                                    <div className='text-green-700 font-semibold'>
                                      {
                                        formatDateTime(
                                          calculateFutureDate(dd.daysToDeliver)
                                        ).dateOnly
                                      }
                                    </div>
                                    <div>
                                      {(dd.freeDeliveryMinCharge > 0 &&
                                      itemsPrice >= dd.freeDeliveryMinCharge
                                        ? 0
                                        : dd.deliveryCharge) === 0 ? (
                                        t('Checkout.FREE Delivery')
                                      ) : (
                                        <ProductPrice
                                          price={dd.deliveryCharge}
                                          plain
                                        />
                                      )}
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className='flex text-muted-foreground text-lg font-bold my-4 py-3'>
                <span className='w-8'>3 </span>
                <span>{t('Checkout.Items and delivery')}</span>
              </div>
            )}
          </div>
          {isPaymentMethodSelected && isAddressSelected && (
            <div className='mt-6'>
              <div className='block md:hidden'>
                <CheckoutSummary />
              </div>

              <Card className='hidden md:block '>
                <CardContent className='p-4 flex flex-col md:flex-row justify-between items-center gap-3'>
                  <Button onClick={handlePlaceOrder} className='rounded-full'>
                    {t('Checkout.Place Your Order')}
                  </Button>
                  <div className='flex-1'>
                    <p className='font-bold text-lg'>
                      {t('Checkout.Order Total')}:{' '}
                      <ProductPrice price={totalPrice} plain />
                    </p>
                    <p className='text-xs'>
                      {' '}
                      {t('Checkout.By placing your order, you agree to')}{' '}
                      {site.name}&apos;s{' '}
                      <Link href='/page/privacy-policy'>
                        {t('Checkout.privacy notice')}
                      </Link>{' '}
                      {t('Checkout.and')}
                      <Link href='/page/conditions-of-use'>
                        {' '}
                        {t('Checkout.conditions of use')}
                      </Link>
                      .
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <CheckoutFooter />
        </div>
        <div className='hidden md:block'>
          <CheckoutSummary />
        </div>
      </div>
    </main>
  )
}
export default CheckoutForm
