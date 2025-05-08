// import { SearchIcon } from 'lucide-react'

// import { Input } from '@/components/ui/input'

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '../../ui/select'
// import { getAllCategories } from '@/lib/actions/product.actions'
// import { getSetting } from '@/lib/actions/setting.actions'
// import { getTranslations } from 'next-intl/server'

// export default async function Search() {
//   const categories = await getAllCategories()
//   const {
//     site: { name },
//   } = await getSetting()
//   const t = await getTranslations()
//   return (
//     <form action='/search' method='GET' className='flex  items-stretch h-10 '>
//       <Select name='category'>
//         <SelectTrigger className='w-auto h-full dark:border-gray-200 bg-gray-100 text-foreground border-r  rounded-r-none rounded-l-md rtl:rounded-r-md rtl:rounded-l-none'>
//           <SelectValue placeholder={t('Header.All')} />
//         </SelectTrigger>
//         <SelectContent position='popper'>
//           <SelectItem value='all'>{t('Header.All')}</SelectItem>
//           {categories.map((category) => (
//             <SelectItem key={category} value={category}>
//               {category}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//       <Input
//         className='flex-1 rounded-none dark:border-gray-200 text-foreground text-base bg-background h-full'
//         placeholder={t('Header.Search Site', { name })}
//         name='q'
//         type='search'
//       />
//       <button
//         type='submit'
//         className='bg-primary text-primary-foreground rounded-s-none rounded-e-md h-full px-3 py-2 '
//       >
//         <SearchIcon className='w-6 h-6' />
//       </button>
//     </form>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import Image from 'next/image'

export default function Search({
  categories = [],
  t,
}: {
  categories: string[]
  t: {
    all: string
    placeholder: string
  }
}) {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fetchResults = async () => {
        if (!query.trim()) return setResults([])

        const params = new URLSearchParams({
          category: selectedCategory,
          q: query,
        })

        try {
          const res = await fetch(`/api/products/search?${params.toString()}`)
          const data = await res.json()
          setResults(data)
        } catch (err) {
          console.error('Search error:', err)
        }
      }

      fetchResults()
    }, 300)

    return () => clearTimeout(timeout)
  }, [query, selectedCategory])

  return (
    <div className='relative w-full max-w-lg'>
      <form action='/search' method='GET' className='flex items-stretch h-10'>
        <Select name='category' onValueChange={setSelectedCategory}>
          <SelectTrigger className='w-auto h-full dark:border-gray-200 bg-gray-100 text-foreground border-r rounded-r-none rounded-l-md rtl:rounded-r-md rtl:rounded-l-none'>
            <SelectValue placeholder={t.all} />
          </SelectTrigger>
          <SelectContent position='popper'>
            <SelectItem value='all'>{t.all}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className='flex-1 rounded-none dark:border-gray-200 text-white text-base bg-background h-full'
          placeholder={t.placeholder}
          name='q'
          type='search'
          autoComplete='on'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type='submit'
          className='bg-primary text-primary-foreground rounded-s-none rounded-e-md h-full px-3 py-2 '
        >
          <SearchIcon className='w-6 h-6' />
        </button>
      </form>

      {results.length > 0 && (
        <div className='absolute top-full mt-1 w-full bg-white border shadow-md rounded-md z-50 max-h-60 overflow-auto'>
          {results.map((item) => (
            <Link
              key={item._id}
              href={`/product/${item.slug}`}
              className='flex items-center gap-3 p-2 hover:bg-gray-100'
              onClick={() => setResults([])}
            >
              <Image
                src={item.images}
                alt={item.name}
                width={100}
                height={100}
                className='w-12 h-12 object-cover rounded-md'
              />
              <div>
                <p className='font-medium text-black'>{item.name}</p>
                <p className='text-sm text-gray-500'>৳{item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
