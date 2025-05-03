'use client'
import { Loader, LoadingDots } from '@/components/shared/svg-component'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ISettingInput } from '@/types'
import { Trash, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import { ChangeEvent, DragEvent, useState } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

export default function CarouselForm({
  form,
  id,
}: {
  form: UseFormReturn<ISettingInput>
  id: string
}) {
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(
    null
  )
  const [deletingImageIndex, setDeletingImageIndex] = useState<number | null>(
    null
  )
  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files?.[0]) {
      const file = e.target.files?.[0]
      const formData = new FormData()
      formData.append('file', file)
      try {
        setUploadingImageIndex(index)
        const response = await fetch('/api/imagecrud/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await response.json()
        const { fileUrl, fileId } = data

        if (response.ok) {
          form.setValue(`carousels.${index}.image`, fileUrl)
          form.setValue(`carousels.${index}.imageId`, fileId)
        } else {
          toast.error('Error:', data.message)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error('Upload error')
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
  const handleDrop = async (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    if (files.length > 1) {
      toast.error('Please drop only one file.')
      return
    }
    const file = files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/imagecrud/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      const { fileUrl, fileId } = data

      if (response.ok) {
        form.setValue(`carousels.${index}.image`, fileUrl)
        form.setValue(`carousels.${index}.imageId`, fileId)
      } else {
        console.error('Error:', data.message)
      }
    } catch (err) {
      console.error('Upload error:', err)
    }
  }

  // Handle image removal
  const handleRemoveImage = async (index: number) => {
    const idToDelete = form.watch(`carousels.${index}.imageId`)
    try {
      setDeletingImageIndex(index)
      const response = await fetch(`/api/imagecrud/delete/${idToDelete}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.msg == 'Ok') {
        form.setValue(`carousels.${index}.image`, '')
        form.setValue(`carousels.${index}.imageId`, '')
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
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'carousels',
  })
  const {
    watch,
    formState: { errors },
  } = form

  return (
    <Card id={id}>
      <CardHeader className='flex flex-col'>
        <CardTitle>Carousels</CardTitle>
        <div className='flex flex-row w-full'>
          <div className='flex flex-row w-[57%] justify-around'>
            <CardTitle>Title</CardTitle>
            <CardTitle>Url</CardTitle>
            <CardTitle>Caption</CardTitle>
          </div>
          <div className='flex w-[43%] justify-between'>
            <CardTitle>Image</CardTitle>
            <CardTitle>Action</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='space-y-4'>
          {fields.map((field, index) => (
            <div key={field.id} className='flex justify-between gap-1 w-full  '>
              <FormField
                control={form.control}
                name={`carousels.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder='Title' />
                    </FormControl>
                    <FormMessage>
                      {errors.carousels?.[index]?.title?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`carousels.${index}.url`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder='Url' />
                    </FormControl>
                    <FormMessage>
                      {errors.carousels?.[index]?.url?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`carousels.${index}.buttonCaption`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder='buttonCaption' />
                    </FormControl>
                    <FormMessage>
                      {errors.carousels?.[index]?.buttonCaption?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <div>
                <FormField
                  control={form.control}
                  name={`carousels.${index}.image`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input disabled placeholder='image url' {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* {watch(`carousels.${index}.image`) && (
                  <Image
                    src={watch(`carousels.${index}.image`)}
                    alt='image'
                    className=' w-full object-cover object-center rounded-sm'
                    width={384}
                    height={136}
                  />
                )} */}
                {uploadingImageIndex === index ? (
                  <div className='flex items-center justify-center w-full h-full'>
                    <Loader />
                    <LoadingDots title='Uploading' />
                  </div>
                ) : (
                  <>
                    {deletingImageIndex === index ? (
                      <div className='flex items-center justify-center w-full h-full'>
                        <Loader />
                        <LoadingDots title='Deleting' />
                      </div>
                    ) : (
                      <>
                        {watch(`carousels.${index}.image`) && (
                          <div
                            onDragOver={handleDragOver}
                            onDrop={(e) => {
                              handleDrop(e, index)
                            }}
                            className='border-2 border-dashed border-gray-300 p-6 rounded-lg text-center relative'
                          >
                            <input
                              type='file'
                              multiple
                              onChange={(e) => {
                                handleFileChange(e, index)
                              }}
                              className='hidden'
                              id={`fileInput-${index}`}
                            />
                            <label
                              htmlFor={`fileInput-${index}`}
                              className='cursor-pointer border-2 border-dashed border-blue-500 p-4 mb-4 inline-block'
                            >
                              Drag & Drop images here or click to select
                            </label>

                            <div className='flex flex-wrap justify-center mt-4'>
                              <div key={index} className='relative m-2'>
                                <Image
                                  src={watch(`carousels.${index}.image`)}
                                  alt='image'
                                  className=' w-full object-cover object-center rounded-sm'
                                  width={384}
                                  height={136}
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
                            </div>
                          </div>
                        )}
                        {!watch(`carousels.${index}.image`) && (
                          <div
                            onDragOver={handleDragOver}
                            onDrop={(e) => {
                              handleDrop(e, index)
                            }}
                            className='border-2 border-dashed border-gray-300 p-6 rounded-lg text-center relative'
                          >
                            <input
                              type='file'
                              multiple
                              onChange={(e) => {
                                handleFileChange(e, index)
                              }}
                              className='hidden'
                              id='fileInput'
                            />
                            <label
                              htmlFor='fileInput'
                              className='cursor-pointer border-2 border-dashed border-blue-500 p-4 mb-4 inline-block'
                            >
                              Drag & Drop images here or click to select
                            </label>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
              <div>
                <Button
                  type='button'
                  disabled={fields.length === 1}
                  variant='outline'
                  // className={index == 0 ? 'mt-2' : ''}
                  onClick={() => {
                    remove(index)
                  }}
                >
                  <TrashIcon className='w-4 h-4' />
                </Button>
              </div>
              <div>
                <FormField
                  control={form.control}
                  name={`carousels.${index}.isPublished`}
                  render={({ field }) => (
                    <FormItem className='space-x-2 items-center'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Published?</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          <Button
            type='button'
            variant={'outline'}
            onClick={() =>
              append({
                url: '',
                title: '',
                image: '',
                imageId: '',
                buttonCaption: '',
                isPublished: true,
              })
            }
          >
            Add Carousel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
