// src/app/api/test-drives/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET all test drives
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    let whereClause = {}
    
    if (start && end) {
      whereClause.date = {
        gte: new Date(start),
        lte: new Date(end)
      }
    }

    const appointments = await prisma.testDrive.findMany({
      where: whereClause,
      include: {
        vehicle: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching test drives:', error)
    return NextResponse.json(
      { error: 'Error fetching test drives' },
      { status: 500 }
    )
  }
}

// CREATE new test drive
export async function POST(request) {
  try {
    const data = await request.json()
    
    // Check if the time slot is available
    const existingAppointment = await prisma.testDrive.findFirst({
      where: {
        date: new Date(data.date),
        time: data.time,
        NOT: {
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

    const appointment = await prisma.testDrive.create({
      data: {
        vehicleId: data.vehicleId,
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        date: new Date(data.date),
        time: data.time,
        status: data.status || 'PENDING',
        notes: data.notes
      },
      include: {
        vehicle: true
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating test drive:', error)
    return NextResponse.json(
      { error: 'Error creating test drive' },
      { status: 500 }
    )
  }
}