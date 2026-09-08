import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Verify the secret to ensure the request is coming from Sanity
  const secret = request.nextUrl.searchParams.get('secret')
  const envSecret = process.env.REVALIDATE_SECRET

  // Deliberately no logging of the secret or its metadata. A previous version
  // logged both lengths plus whether they matched, which is an oracle: it tells
  // anyone with log access how long the expected secret is and confirms a hit.
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

    revalidatePath('/')
    revalidatePath('/acquire')
    revalidatePath('/more')
    revalidatePath('/contact')
    revalidatePath('/reviews')

    return NextResponse.json(
      {
        revalidated: true,
        message: 'Pages revalidated successfully',
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
