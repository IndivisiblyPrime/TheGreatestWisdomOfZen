import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Verify the secret to ensure the request is coming from Sanity
  const secret = request.nextUrl.searchParams.get('secret')
  const envSecret = process.env.REVALIDATE_SECRET

  // Debug logging (remove after fixing)
  console.log('Revalidate debug:', {
    receivedSecretLength: secret?.length ?? 0,
    envSecretLength: envSecret?.length ?? 0,
    envSecretExists: !!envSecret,
    secretsMatch: secret === envSecret,
  })

  if (secret !== envSecret) {
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    )
  }

  try {
    // Parse the webhook payload
    const body = await request.json()

    // Log the revalidation for debugging
    console.log('Revalidating from Sanity webhook:', {
      type: body._type,
      id: body._id,
      timestamp: new Date().toISOString(),
    })

    // Revalidate the home page (adjust paths as needed)
    revalidatePath('/')

    return NextResponse.json(
      {
        revalidated: true,
        message: 'Homepage revalidated successfully',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Error revalidating:', err)
    return NextResponse.json(
      {
        message: 'Error revalidating',
        error: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
