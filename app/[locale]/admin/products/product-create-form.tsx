'use client'
import React, { ChangeEvent, DragEvent, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { IProduct } from '@/lib/db/models/product.model'
import { ProductInputSchema } from '@/lib/validator'
import { Checkbox } from '@/components/ui/checkbox'
import { toSlug } from '@/lib/utils'
import { IProductInput } from '@/types'
import Image from 'next/image'
import { toast } from 'sonner'
import { createProduct } from '@/lib/actions/product.actions'
import { useRouter } from 'next/navigation'
import { Trash } from 'lucide-react'
import { Loader, LoadingDots } from '@/components/shared/svg-component'

const productDefaultValues: IProductInput =
  process.env.NODE_ENV === 'development'
    ? {
        name: 'Sample Product',
        slug: 'sample-product',
        category: 'Sample Category',
        images: [],
        imagesId: [],
        brand: 'Sample Brand',
        description: 'This is a sample description of the product.',
        metaDescription: 'This is a sample meta description of the product.',
        price: 99.99,
        listPrice: 0,
        countInStock: 15,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        sizes: [],
        colors: [],
        ratingDistribution: [],
        reviews: [],
      }
    : {
        name: '',
        slug: '',
        category: '',
        images: [],
        imagesId: [],
        brand: '',
        description: '',
        metaDescription: '',
        price: 0,
        listPrice: 0,
        countInStock: 0,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        sizes: [],
        colors: [],
        ratingDistribution: [],
        reviews: [],
      }

const ProductCreateForm = ({}: { product?: IProduct; productId?: string }) => {
  const form = useForm<IProductInput>({
    resolver: zodResolver(ProductInputSchema),
    defaultValues: productDefaultValues,
  })
  const imagesUrl = form.watch('images')
  const imagesId = form.watch('imagesId')
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(
    null
  )
  const [deletingImageIndex, setDeletingImageIndex] = useState<number | null>(
    null
  )
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('file', file)
      })

      try {
        setUploadingImageIndex(1)
        const response = await fetch('/api/imagecrud/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await response.json()
        const { fileUrl, fileId } = data

        if (response.ok) {
          form.setValue('images', [...imagesUrl, fileUrl])
          form.setValue('imagesId', [...imagesId, fileId])
        } else {
          console.error('Error:', data.message)
        }
      } catch (err) {
        console.error('Upload error:', err)
      } finally {
        setUploadingImageIndex(null)
      }
    }
  }
  // Handle drag over event
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // Handle drop event
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files)
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('file', file)
    })
    try {
      setUploadingImageIndex(1)
      const response = await fetch('/api/imagecrud/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      const { fileUrl, fileId } = data

      if (response.ok) {
        form.setValue('images', [...imagesUrl, fileUrl])
        form.setValue('imagesId', [...imagesId, fileId])
      } else {
        console.error('Error:', data.message)
      }
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploadingImageIndex(null)
    }
  }

  // Handle image removal
  const handleRemoveImage = async (index: number) => {
    const idToDelete = imagesId[index]
    try {
      setDeletingImageIndex(index)
      const response = await fetch(`/api/imagecrud/delete/${idToDelete}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.msg == 'Ok') {
        const updatedImages = form
          .getValues('images')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((_: any, i: number) => i !== index)
        form.setValue('images', updatedImages)

        const updatedImagesId = form
          .getValues('imagesId')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((_: any, i: number) => i !== index)
        form.setValue('imagesId', updatedImagesId)
        toast.success('Successfully removed')
      } else {
        toast.error('Unsuccessfull')
      }
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setDeletingImageIndex(null)
    }
  }
  //Upload image functionality End

  const router = useRouter()

  async function onSubmit(values: IProductInput) {
    const res = await createProduct(values)
    if (!res.success) {
      toast.error(res.message)
    } else {
      toast.success(res.message)
      router.push(`/admin/products`)
    }
  }
  return (
    <Form {...form}>
      <form
        method='post'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product name' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Slug</FormLabel>

                <FormControl>
                  <div className='relative'>
                    <Input
                      placeholder='Enter product slug'
                      className='pl-8'
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() => {
                        form.setValue('slug', toSlug(form.getValues('name')))
                      }}
                      className='absolute right-2 top-2.5'
                    >
                      Generate
                    </button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder='Enter category' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='brand'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product brand' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='listPrice'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>List Price</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product list price' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Net Price</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product price' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='countInStock'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Count In Stock</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter product count in stock'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='colors'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Colors</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter colors'
                    value={
                      Array.isArray(field.value) ? field.value.join(', ') : ''
                    }
                    onChange={(e) => {
                      const raw = e.target.value
                      const lastChar = raw[raw.length - 1]
                      const isEndingInComma = lastChar === ','
                      const sizeArray = raw
                        .split(',')
                        .map((s) => s.trim())
                        .filter((s) => s.length > 0)
                      field.onChange(
                        isEndingInComma ? [...sizeArray, ''] : sizeArray
                      )
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='sizes'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Sizes</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter sizes or type'
                    value={
                      Array.isArray(field.value) ? field.value.join(', ') : ''
                    }
                    onChange={(e) => {
                      const raw = e.target.value
                      const lastChar = raw[raw.length - 1]
                      const isEndingInComma = lastChar === ','
                      const sizeArray = raw
                        .split(',')
                        .map((s) => s.trim())
                        .filter((s) => s.length > 0)
                      field.onChange(
                        isEndingInComma ? [...sizeArray, ''] : sizeArray
                      )
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='images'
            render={() => (
              <FormItem className='w-full'>
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className='space-y-2 mt-2 min-h-48'>
                    <FormControl>
                      {/* Image Place holder */}
                      {uploadingImageIndex !== null ? (
                        <div className='flex items-center justify-center w-full h-full'>
                          <Loader />
                          <LoadingDots title='Uploading' />
                        </div>
                      ) : (
                        <div>
                          {deletingImageIndex !== null ? (
                            <div className='flex items-center justify-center w-full h-full'>
                              <Loader />
                              <LoadingDots title='Deleting' />
                            </div>
                          ) : (
                            <div
                              onDragOver={handleDragOver}
                              onDrop={handleDrop}
                              className='border-2 border-dashed border-gray-300 p-6 rounded-lg text-center relative'
                            >
                              <input
                                type='file'
                                multiple
                                onChange={handleFileChange}
                                className='hidden'
                                id='fileInput'
                              />
                              <label
                                htmlFor='fileInput'
                                className='cursor-pointer border-2 border-dashed border-blue-500 p-4 mb-4 inline-block'
                              >
                                Drag & Drop images here or click to select
                              </label>

                              <div className='flex flex-wrap justify-center mt-4'>
                                {imagesUrl.map((imageUrl, index) => (
                                  <div key={index} className='relative m-2'>
                                    <Image
                                      src={imageUrl}
                                      alt={`Preview ${index}`}
                                      className='w-60 h-60 object-cover rounded-md'
                                      width={300}
                                      height={300}
                                    />
                                    <button
                                      type='button'
                                      onClick={() => {
                                        handleRemoveImage(index)
                                      }}
                                      className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-sm'
                                    >
                                      <Trash className='w-4 h-4' />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </FormControl>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name='metaDescription'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Meta Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Meta description'
                    className='resize-none'
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
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Description'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can <span>@mention</span> other users and organizations to
                  link to them.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name='isPublished'
            render={({ field }) => (
              <FormItem className='space-x-2 items-center'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Is Published?</FormLabel>
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='button col-span-2 w-full'
          >
            {form.formState.isSubmitting ? 'Submitting...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProductCreateForm
