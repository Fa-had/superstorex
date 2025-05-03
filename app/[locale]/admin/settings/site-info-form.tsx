import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ISettingInput } from '@/types'
import Image from 'next/image'
import { UseFormReturn } from 'react-hook-form'

export default function SiteInfoForm({
  form,
  id,
}: {
  form: UseFormReturn<ISettingInput>
  id: string
}) {
  const { watch, control } = form

  const siteLogo = watch('site.logo')
  // const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files?.[0]) {
  //     const file = e.target.files?.[0]
  //     const formData = new FormData()
  //     formData.append('file', file)
  //     try {
  //       const response = await fetch('/api/icons/upload', {
  //         method: 'POST',
  //         body: formData,
  //       })
  //       const data = await response.json()
  //       if (response.ok) {
  //         form.setValue('site.logo', data.path)
  //       } else {
  //         toast.error('Error:', data.message)
  //       }
  //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     } catch (err) {
  //       toast.error('Upload error')
  //     }
  //   }
  // }
  // // Handle drag over event
  // const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
  //   e.preventDefault()
  //   e.stopPropagation()
  // }

  // // Handle drop event
  // const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   const files = e.dataTransfer.files
  //   if (files.length > 1) {
  //     toast.error('Please drop only one file.')
  //     return
  //   }
  //   const file = files[0]
  //   if (!file) return
  //   const formData = new FormData()
  //   formData.append('file', file)

  //   try {
  //     const response = await fetch('/api/imagecrud/upload', {
  //       method: 'POST',
  //       body: formData,
  //     })
  //     const data = await response.json()

  //     if (response.ok) {
  //       form.setValue('site.logo', data.path)
  //     } else {
  //       toast.error('Error:', data.message)
  //     }
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   } catch (err) {
  //     toast.error('Upload error')
  //   }
  // }

  // // Handle image removal
  // const handleRemoveImage = async () => {
  //   try {
  //     const response = await fetch(`/api/icons/delete/${siteLogo}`, {
  //       method: 'DELETE',
  //     })
  //     const data = await response.json()
  //     if (data.msg == 'Ok') {
  //       form.setValue('site.logo', '')
  //       toast.success('Successfully removed')
  //     } else {
  //       toast.error('Unsuccessfull')
  //     }
  //   } catch (error) {
  //     console.error('Delete error:', error)
  //   }
  // }

  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle>Site Info</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={control}
            name='site.name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter site name' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='site.url'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Url</FormLabel>
                <FormControl>
                  <Input placeholder='Enter url' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <div className='w-full text-left'>
            <FormField
              control={control}
              name='site.logo'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter image url' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Image
              src={siteLogo}
              alt={'Preview Site logo'}
              className='w-60 h-60 object-cover rounded-md'
              width={300}
              height={300}
            />
            {/* {siteLogo && (
              <div className='flex my-2 items-center gap-2'>
                <Image src={siteLogo} alt='logo' width={48} height={48} />
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => form.setValue('site.logo', '')}
                >
                  <TrashIcon className='w-4 h-4' />
                </Button>
              </div>
            )} */}
            {/* {!siteLogo && ( */}
            {/* <div
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
                <div className='relative m-2'>
                  <Image
                    src={siteLogo}
                    alt={'Preview Site logo'}
                    className='w-60 h-60 object-cover rounded-md'
                    width={300}
                    height={300}
                  />
                  <button
                    type='button'
                    onClick={handleRemoveImage}
                    className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-sm'
                  >
                    <TrashIcon className='w-4 h-4' />
                  </button>
                </div>
              </div>
            </div> */}
            {/* )} */}
          </div>
          <FormField
            control={control}
            name='site.description'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter description'
                    className='h-40'
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
            control={control}
            name='site.slogan'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Slogan</FormLabel>
                <FormControl>
                  <Input placeholder='Enter slogan name' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='site.keywords'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Keywords</FormLabel>
                <FormControl>
                  <Input placeholder='Enter keywords' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={control}
            name='site.phone'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder='Enter phone number' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='site.email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter email address' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={control}
            name='site.address'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder='Enter address' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='site.copyright'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Copyright</FormLabel>
                <FormControl>
                  <Input placeholder='Enter copyright' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
