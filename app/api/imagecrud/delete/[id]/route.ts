import { credentials } from '@/lib/utils'
import { google } from 'googleapis'
import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: NextRequest, { params }: { params: any }) {
  const { id } = await params

  try {
    await deleteFile(id)
    return NextResponse.json({ msg: 'Ok' })
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred. Msg: ' + error },
      { status: 500 }
    )
  }
}
const deleteFile = async (file_id: string) => {
  const id = process.env.CREDENTIAL_ID || ''
  const credential = await credentials(id)
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
  }
}
