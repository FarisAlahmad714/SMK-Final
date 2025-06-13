// app/api/email/sale-thank-you/route.js
import { NextResponse } from 'next/server'
import { sendSaleThankYouEmail } from '@/lib/email'

export async function POST(request) {
  try {
    const body = await request.json()
    const { customerName, email, vehicle, salePrice } = body

    await sendSaleThankYouEmail({ customerName, email, vehicle, salePrice })

    return NextResponse.json({ message: 'Thank you email sent successfully' })
  } catch (error) {
    console.error('Error sending sale-thank-you email:', error)
    return NextResponse.json(
      { message: 'Error sending thank-you email', error: error.message },
      { status: 500 }
    )
  }
}
