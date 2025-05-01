import data from '@/lib/data'
import { connectToDatabase } from '.'
import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import Setting from './models/setting.model'

loadEnvConfig(cwd())

const main = async () => {
  try {
    const { settings } = data
    await connectToDatabase(process.env.MONGODB_URI)

    // await User.deleteMany()
    // const createdUser = await User.insertMany(users)

    // await Product.deleteMany()
    // const createdProducts = await Product.insertMany(products)

    // await WebPage.deleteMany()
    // const createdWebpages = await WebPage.insertMany(webPages)
    await Setting.deleteMany()
    const createdSetting = await Setting.insertMany(settings)

    console.log({
      createdSetting,
      // createdWebpages,
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
