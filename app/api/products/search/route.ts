// import { getProductForSearch } from '@/lib/actions/product.actions'
import { connectToDatabase } from '@/lib/db'
import Product from '@/lib/db/models/product.model'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const q = searchParams.get('q') || ''
  //   const tag = searchParams.get('tag') || 'all'
  const category = searchParams.get('category') || 'all'

  //   const products = getProductForSearch({
  //     query: q,
  //     limit: 5,
  //     page: 1,
  //     tag,
  //     category,
  //     sort: 'best-selling',
  //   })

  //   console.log('From Server result: ', (await products).products)
  if (!q) return NextResponse.json([])

  await connectToDatabase()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pipeline: any[] = [
    {
      $search: {
        index: 'productSearch',
        compound: {
          must: [
            {
              text: {
                query: q,
                path: 'name',
                fuzzy: {
                  maxEdits: 2,
                },
              },
            },
          ],
          ...(category && category !== 'all'
            ? {
                filter: [
                  {
                    text: {
                      query: category,
                      path: 'category',
                    },
                  },
                ],
              }
            : {}),
        },
      },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 0,
        name: 1,
        price: 1,
        images: { $arrayElemAt: ['$images', 0] },
        slug: 1,
      },
    },
  ]

  const products = Product.aggregate(pipeline)
  return NextResponse.json(await products)
}
