// src/app/api/sell-trade/[id]/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()

    const submission = await prisma.vehicleSubmission.update({
      where: { id },
      data: {
        status: data.status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(submission)
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    )
  }
}