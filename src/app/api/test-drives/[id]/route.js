// src/app/api/test-drives/[id]/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET single test drive
export async function GET(request, { params }) {
  if (!params?.id) {
    return NextResponse.json(
      { error: 'Test drive ID is required' },
      { status: 400 }
    )
  }

  try {
    const appointment = await prisma.testDrive.findUnique({
      where: { id: params.id },
      include: {
        vehicle: true
      }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Test drive not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error fetching test drive:', error)
    return NextResponse.json(
      { error: 'Error fetching test drive' },
      { status: 500 }
    )
  }
}

// UPDATE test drive
export async function PUT(request, { params }) {
  if (!params?.id) {
    return NextResponse.json(
      { error: 'Test drive ID is required' },
      { status: 400 }
    )
  }

  try {
    const data = await request.json()

    // If changing date/time, check availability
    if (data.date && data.time) {
      const existingAppointment = await prisma.testDrive.findFirst({
        where: {
          date: new Date(data.date),
          time: data.time,
          NOT: {
            id: params.id,
            status: 'CANCELLED'
          }
        }
      })

      if (existingAppointment) {
        return NextResponse.json(
          { error: 'This time slot is already booked' },
          { status: 400 }
        )
      }
    }

    const appointment = await prisma.testDrive.update({
      where: { id: params.id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined
      },
      include: {
        vehicle: true
      }
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error updating test drive:', error)
    return NextResponse.json(
      { error: 'Error updating test drive' },
      { status: 500 }
    )
  }
}

// DELETE test drive
export async function DELETE(request, { params }) {
  if (!params?.id) {
    return NextResponse.json(
      { error: 'Test drive ID is required' },
      { status: 400 }
    )
  }

  try {
    await prisma.testDrive.delete({
      where: { id: params.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting test drive:', error)
    return NextResponse.json(
      { error: 'Error deleting test drive' },
      { status: 500 }
    )
  }
}