'use server'
import { BkashConfig, PaymentDetails } from '@/types'
import axios from 'axios'
import Bkash from './db/models/bkashToken.model'

export async function createPayment(
  bkashConfig: BkashConfig,
  paymentDetails: PaymentDetails
) {
  try {
    const { amount, callbackURL, orderID, reference } = paymentDetails
    if (!amount) {
      return {
        statusCode: 2065,
        statusMessage: 'amount required',
      }
    } else {
      if (amount < 1) {
        return {
          statusCode: 2065,
          statusMessage: 'minimum amount 1',
        }
      }
    }

    if (!callbackURL) {
      return {
        statusCode: 2065,
        statusMessage: 'callbackURL required',
      }
    }
    const url = `${bkashConfig?.base_url}/tokenized/checkout/create`

    const response = await axios.post(
      url,
      {
        mode: '0011',
        currency: 'BDT',
        intent: 'sale',
        amount: amount ? amount : '1',
        callbackURL: callbackURL,
        payerReference: reference || '1',
        merchantInvoiceNumber: orderID || "didn't create",
      },
      {
        headers: await authHeaders(bkashConfig),
      }
    )
    return response?.data
  } catch (e) {
    console.error('Create Bkash Payment Error:', e)
    return e
  }
}
export async function executePayment(
  bkashConfig: BkashConfig,
  paymentID: string
) {
  const url = `${bkashConfig?.base_url}/tokenized/checkout/execute`
  try {
    const response = await axios.post(
      url,
      {
        paymentID,
      },
      {
        headers: await authHeaders(bkashConfig),
      }
    )

    return response?.data
  } catch (error) {
    console.log('Error from bkash exectePayment: ', error)
    return null
  }
}
export async function queryPaymet(bkashConfig: BkashConfig, paymentID: string) {
  const url = `${bkashConfig?.base_url}/tokenized/checkout/payment/status`
  try {
    const response = await axios.post(
      url,
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: await grantToken(bkashConfig),
        'x-app-key': bkashConfig?.app_key || '',
        paymentID,
      },
      {
        headers: await authHeaders(bkashConfig),
      }
    )

    return response?.data
  } catch (error) {
    console.log('Error from bkash exectePayment: ', error)
    return null
  }
}

const authHeaders = async (bkashConfig: BkashConfig) => {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    authorization: await grantToken(bkashConfig),
    'x-app-key': bkashConfig?.app_key || '',
  }
}

const grantToken = async (bkashConfig: BkashConfig) => {
  try {
    const findToken = await Bkash.findOne({})

    if (!findToken || findToken.updatedAt < new Date(Date.now() - 3600000)) {
      // 1 hour
      console.log('In grantoken -> if')
      return await setToken(bkashConfig)
    }

    return findToken.auth_token
  } catch (e) {
    console.log(e)
    return null
  }
}

const setToken = async (bkashConfig: BkashConfig) => {
  console.log('In setToken')

  const response = await axios.post(
    `${bkashConfig?.base_url}/tokenized/checkout/token/grant`,
    tokenParameters(bkashConfig),
    {
      headers: tokenHeaders(bkashConfig),
    }
  )
  console.log(response.data)

  if (response?.data?.id_token) {
    const findToken = await Bkash.findOne({})
    if (findToken) {
      console.log('In setToken -> if')
      findToken.auth_token = response?.data?.id_token
      await findToken.save()
    } else {
      console.log('In setToken -> else')
      await Bkash.create({
        auth_token: response?.data?.id_token,
      })
    }
  }
  return response?.data?.id_token
}

const tokenParameters = (bkashConfig: BkashConfig) => {
  return {
    app_key: bkashConfig?.app_key,
    app_secret: bkashConfig?.app_secret,
  }
}

const tokenHeaders = (bkashConfig: BkashConfig) => {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    username: `${bkashConfig?.username}`,
    password: `${bkashConfig?.password}`,
  }
}
