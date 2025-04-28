import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { credentials } from '@/lib/utils'
import { Readable } from 'stream'

export const config = {
  api: {
    bodyParser: false, // Disable default body parser
  },
}

const driveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID! // You need to set this in .env

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const uploadFileToDrive = async (file: any, credential: any) => {
  const auth = new google.auth.JWT({
    email: credential.client_email,
    key: credential.private_key,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  })
  // Convert the file to a Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const drive = google.drive({ version: 'v3', auth })

  // File metadata
  const fileMetadata = {
    name: file.name, // File name
    parents: [driveFolderId], // Optional folder ID in Google Drive
  }

  const media = {
    mimeType: file.type,
    body: Readable.from(buffer),
  }

  // Upload file to Google Drive
  const fileResponse = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id',
  })

  const fileId = fileResponse.data.id || ''

  // Make the file publicly accessible
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  })

  // Get the file's public URL
  const fileUrl = `https://drive.google.com/uc?export=view&id=${fileId}`
  return { fileUrl, fileId }
}
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file')

  const id = process.env.CREDENTIAL_ID || ''

  const credential = await credentials(id)
  if (file && credential) {
    const { fileUrl, fileId } = await uploadFileToDrive(file, credential)
    return NextResponse.json({
      fileUrl: fileUrl,
      fileId: fileId,
    })
  }
}
