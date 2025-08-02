'use server'

import { connectToDatabase } from '@/lib/db'
import Product, { IProduct } from '@/lib/db/models/product.model'
import { IProductInput } from '@/types'
import { z } from 'zod'
import { ProductInputSchema, ProductUpdateSchema } from '../validator'
import { revalidatePath } from 'next/cache'
import { credentials, formatError } from '../utils'
import { getSetting } from './setting.actions'
import { google } from 'googleapis'
import { WithId } from 'mongodb'
import { AnyObject } from 'mongoose'

// CREATE
export async function createProduct(data: IProductInput) {
  try {
    const product = ProductInputSchema.parse(data)
    await connectToDatabase()
    await Product.create(product)
    revalidatePath('/admin/products')
    return {
      success: true,
      message: 'Product created successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// UPDATE
export async function updateProduct(data: z.infer<typeof ProductUpdateSchema>) {
  try {
    const product = ProductUpdateSchema.parse(data)
    await connectToDatabase()
    await Product.findByIdAndUpdate(product._id, product)
    revalidatePath('/admin/products')
    return {
      success: true,
      message: 'Product updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
// DELETE
export async function deleteProduct(id: string) {
  try {
    await connectToDatabase()
    const result = await Product.findById(id, { imagesId: 1, _id: id })
    const imagesIdList = result?.imagesId
    const credId = process.env.CREDENTIAL_ID || ''
    const credential = await credentials(credId)
    imagesIdList?.map(async (imagesId) => {
      await deleteFile(imagesId, credential)
    })
    const res = await Product.findByIdAndDelete(id)
    if (!res) throw new Error('Product not found')
    revalidatePath('/admin/products')
    return {
      success: true,
      message: 'Product deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
//Delete file
export async function deleteFile(
  file_id: string,
  credential: WithId<AnyObject> | null
) {
  if (credential) {
    const auth = new google.auth.JWT({
      email: credential.client_email,
      key: credential.private_key,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    })
    const drive = google.drive({ version: 'v3', auth })
    try {
      await drive.files.delete({ fileId: file_id })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error('error: ', error)
      // console.error('Error deleting Image:', error);
    }
  } else {
    throw new Error('Creadtial Null')
  }
}
// GET ONE PRODUCT BY ID
export async function getProductById(productId: string) {
  await connectToDatabase()
  const product = await Product.findById(productId)
  return JSON.parse(JSON.stringify(product)) as IProduct
}

// GET ALL PRODUCTS FOR ADMIN
export async function getAllProductsForAdmin({
  query,
  page = 1,
  sort = 'latest',
  limit,
}: {
  query: string
  page?: number
  sort?: string
  limit?: number
}) {
  await connectToDatabase()
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize || 1
  const queryFilter =
    query && query !== 'all'
      ? {
          name: {
            $regex: query,
            $options: 'i',
          },
        }
      : {}

  const order: Record<string, 1 | -1> =
    sort === 'best-selling'
      ? { numSales: -1 }
      : sort === 'price-low-to-high'
        ? { price: 1 }
        : sort === 'price-high-to-low'
          ? { price: -1 }
          : sort === 'avg-customer-review'
            ? { avgRating: -1 }
            : { _id: -1 }
  const products = await Product.find({
    ...queryFilter,
  })
    .sort(order)
    .skip(limit * (Number(page) - 1))
    .limit(limit)
    .lean()

  const countProducts = await Product.countDocuments({
    ...queryFilter,
  })
  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / limit),
    totalProducts: countProducts,
    from: limit * (Number(page) - 1) + 1,
    to: limit * (Number(page) - 1) + products.length,
  }
}

export async function getAllCategories() {
  await connectToDatabase()
  const categories = await Product.find({ isPublished: true }).distinct(
    'category'
  )
  return categories
}
export async function getProductsForCard({
  tag,
  limit = 4,
}: {
  tag: string
  limit?: number
}) {
  await connectToDatabase()
  const products = await Product.find(
    { tags: { $in: [tag] }, isPublished: true },
    {
      name: 1,
      href: { $concat: ['/product/', '$slug'] },
      image: { $arrayElemAt: ['$images', 0] },
    }
  )
    .sort({ createdAt: 'desc' })
    .limit(limit)
  return JSON.parse(JSON.stringify(products)) as {
    name: string
    href: string
    image: string
  }[]
}
// GET PRODUCTS BY TAG
export async function getProductsByTag({
  tag,
  limit = 10,
}: {
  tag: string
  limit?: number
}) {
  await connectToDatabase()
  const products = await Product.find({
    tags: { $in: [tag] },
    isPublished: true,
  })
    .sort({ createdAt: 'desc' })
    .limit(limit)
  return JSON.parse(JSON.stringify(products)) as IProduct[]
}

// GET ONE PRODUCT BY SLUG
export async function getProductBySlug(slug: string) {
  await connectToDatabase()
  const product = await Product.findOne({ slug, isPublished: true })
  if (!product) throw new Error('Product not found')
  return JSON.parse(JSON.stringify(product)) as IProduct
}
// GET RELATED PRODUCTS: PRODUCTS WITH SAME CATEGORY
export async function getRelatedProductsByCategory({
  category,
  productId,
  limit,
  page,
}: {
  category: string
  productId: string
  limit?: number
  page: number
}) {
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize || 4
  await connectToDatabase()
  const skipAmount = (Number(page) - 1) * limit
  const conditions = {
    isPublished: true,
    category,
    _id: { $ne: productId },
  }
  const products = await Product.find(conditions)
    .sort({ numSales: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const productsCount = await Product.countDocuments(conditions)
  return {
    data: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(productsCount / limit),
  }
}

function QueryFilter(query: string) {
  return query && query !== 'all'
    ? {
        name: {
          $regex: query,
          $options: 'i',
        },
      }
    : {}
}
function CategoryFilter(category: string) {
  return category && category !== 'all' ? { category } : {}
}
function TagFilter(tag: string) {
  return tag && tag !== 'all' ? { tags: tag } : {}
}
function RatingFilter(rating?: string) {
  return rating && rating !== 'all'
    ? {
        avgRating: {
          $gte: Number(rating),
        },
      }
    : {}
}
function PriceFilter(price?: string) {
  return price && price !== 'all'
    ? {
        price: {
          $gte: Number(price.split('-')[0]),
          $lte: Number(price.split('-')[1]),
        },
      }
    : {}
}
function SortingOrder(sort?: string) {
  const order: Record<string, 1 | -1> =
    sort === 'best-selling'
      ? { numSales: -1 }
      : sort === 'price-low-to-high'
        ? { price: 1 }
        : sort === 'price-high-to-low'
          ? { price: -1 }
          : sort === 'avg-customer-review'
            ? { avgRating: -1 }
            : { _id: -1 }
  return order
}
function IsPublished() {
  return { isPublished: true }
}
// GET ALL PRODUCTS
export async function getProductForSearch({
  query,
  limit,
  page,
  category,
  tag,
  price,
  rating,
  sort,
}: {
  query: string
  category: string
  tag: string
  limit?: number
  page: number
  price?: string
  rating?: string
  sort?: string
}) {
  limit = limit || 5
  const queryFilter = QueryFilter(query)
  const categoryFilter = CategoryFilter(category)
  const tagFilter = TagFilter(tag)
  const ratingFilter = RatingFilter(rating)
  const priceFilter = PriceFilter(price)
  const isPublished = IsPublished()
  const order = SortingOrder(sort)
  const products = await Product.find({
    ...isPublished,
    ...queryFilter,
    ...tagFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(order)
    .skip(limit * (Number(page) - 1))
    .limit(limit)
    .lean()
  return JSON.parse(JSON.stringify(products)) as IProduct[]
}
// export async function getAllProducts({
//   query,
//   limit,
//   page,
//   category,
//   tag,
//   price,
//   rating,
//   sort,
// }: {
//   query: string
//   category: string
//   tag: string
//   limit?: number
//   page: number
//   price?: number
//   rating?: string
//   sort?: string
// }) {
//   const {
//     common: { pageSize },
//   } = await getSetting()
//   limit = limit || pageSize || 5
//   await connectToDatabase()

//   const queryFilter = QueryFilter(query)
//   // const queryFilter =
//   //   query && query !== 'all'
//   //     ? {
//   //         name: {
//   //           $regex: query,
//   //           $options: 'i',
//   //         },
//   //       }
//   //     : {}
//   const categoryFilter = CategoryFilter(category)
//   // const categoryFilter = category && category !== 'all' ? { category } : {}
//   const tagFilter = TagFilter(tag)
//   // const tagFilter = tag && tag !== 'all' ? { tags: tag } : {}
//   const ratingFilter = RatingFilter(rating)
//   // const ratingFilter =
//   //   rating && rating !== 'all'
//   //     ? {
//   //         avgRating: {
//   //           $gte: Number(rating),
//   //         },
//   //       }
//   //     : {}
//   // 10-50
//   const priceFilter = PriceFilter(String(price))
//   // const priceFilter =
//   //   price && price !== 'all'
//   //     ? {
//   //         price: {
//   //           $gte: Number(price.split('-')[0]),
//   //           $lte: Number(price.split('-')[1]),
//   //         },
//   //       }
//   //     : {}
//   const order = await SortingOrder(sort)
//   // const order: Record<string, 1 | -1> =
//   //   sort === 'best-selling'
//   //     ? { numSales: -1 }
//   //     : sort === 'price-low-to-high'
//   //       ? { price: 1 }
//   //       : sort === 'price-high-to-low'
//   //         ? { price: -1 }
//   //         : sort === 'avg-customer-review'
//   //           ? { avgRating: -1 }
//   //           : { _id: -1 }
//   const isPublished = IsPublished()
//   // const isPublished = { isPublished: true }
//   const products = await Product.find({
//     ...isPublished,
//     ...queryFilter,
//     ...tagFilter,
//     ...categoryFilter,
//     ...priceFilter,
//     ...ratingFilter,
//   })
//     .sort(order)
//     .skip(limit * (Number(page) - 1))
//     .limit(limit)
//     .lean()

//   const countProducts = await Product.countDocuments({
//     ...queryFilter,
//     ...tagFilter,
//     ...categoryFilter,
//     ...priceFilter,
//     ...ratingFilter,
//   })
//   return {
//     products: JSON.parse(JSON.stringify(products)) as IProduct[],
//     totalPages: Math.ceil(countProducts / limit),
//     totalProducts: countProducts,
//     from: limit * (Number(page) - 1) + 1,
//     to: limit * (Number(page) - 1) + products.length,
//   }
// }
export async function getAllProducts({
  query,
  limit,
  page,
  category,
  tag,
  price,
  rating,
  sort,
}: {
  query: string
  category: string
  tag: string
  limit?: number
  page: number
  price?: string
  rating?: string
  sort?: string
}) {
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize || 5
  await connectToDatabase()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matchStage: any = {
    isPublished: true,
  }

  if (category && category !== 'all') matchStage.category = category
  if (tag && tag !== 'all') matchStage.tags = tag
  if (rating && rating !== 'all')
    matchStage.avgRating = { $gte: Number(rating) }
  if (price && price !== 'all') {
    const [min, max] = price.split('-').map(Number)
    matchStage.price = { $gte: min, $lte: max }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortStage: any =
    sort === 'best-selling'
      ? { numSales: -1 }
      : sort === 'price-low-to-high'
        ? { price: 1 }
        : sort === 'price-high-to-low'
          ? { price: -1 }
          : sort === 'avg-customer-review'
            ? { avgRating: -1 }
            : { _id: -1 }

  const searchStage =
    query && query !== 'all'
      ? [
          {
            $search: {
              index: 'productsSearch', // name of your Atlas Search index
              compound: {
                must: [
                  {
                    text: {
                      query,
                      path: 'name',
                      fuzzy: {
                        maxEdits: 2,
                        prefixLength: 1,
                      },
                    },
                  },
                ],
              },
            },
          },
        ]
      : []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pipeline: any[] = [
    ...searchStage,
    { $match: matchStage },
    { $sort: sortStage },
    { $skip: limit * (page - 1) },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
        images: 1,
        countInStock: 1,
        tags: 1,
        price: 1,
        avgRating: 1,
        numSales: 1,
        sizes: 1,
        colors: 1,
        numReviews: 1,
      },
    },
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countPipeline: any[] = [
    ...searchStage,
    { $match: matchStage },
    { $count: 'total' },
  ]

  const [products, countResult] = await Promise.all([
    Product.aggregate(pipeline),
    Product.aggregate(countPipeline),
  ])

  const countProducts = countResult[0]?.total || 0

  return {
    products: JSON.parse(JSON.stringify(products)),
    totalPages: Math.ceil(countProducts / limit),
    totalProducts: countProducts,
    from: limit * (page - 1) + 1,
    to: limit * (page - 1) + products.length,
  }
}

export async function getAllTags() {
  const tags = await Product.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: null, uniqueTags: { $addToSet: '$tags' } } },
    { $project: { _id: 0, uniqueTags: 1 } },
  ])
  return (
    (tags[0]?.uniqueTags
      .sort((a: string, b: string) => a.localeCompare(b))
      .map((x: string) =>
        x
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      ) as string[]) || []
  )
}
