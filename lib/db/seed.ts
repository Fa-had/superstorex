import data from '@/lib/data'
import { connectToDatabase } from '.'
import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import WebPage from './models/web-page.model'

loadEnvConfig(cwd())

const main = async () => {
  try {
    const { webPages } = data
    await connectToDatabase(process.env.MONGODB_URI)

    // await User.deleteMany()
    // const createdUser = await User.insertMany(users)

    // await Product.deleteMany()
    // const createdProducts = await Product.insertMany(products)

    await WebPage.deleteMany()
    const createdWebpages = await WebPage.insertMany(webPages)

    console.log({
      createdWebpages,
      // createdUser,
      // createdProducts,
      message: 'Seeded database successfully',
    })
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed database')
  }
}

main()
