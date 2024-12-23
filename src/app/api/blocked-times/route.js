
// src/app/api/blocked-times/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    const blockedTimes = await prisma.blockedTimeSlot.findMany({
      where: date ? {
        date: new Date(date)
      } : undefined,
      orderBy: {
        date: 'asc'
      }
    })

    return NextResponse.json(blockedTimes)
  } catch (error) {
    console.error('Error fetching blocked times:', error)
    return NextResponse.json({ error: 'Error fetching blocked times' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const blockedTime = await prisma.blockedTimeSlot.create({
      data: {
        date: new Date(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        reason: data.reason
      }
    })
    return NextResponse.json(blockedTime, { status: 201 })
  } catch (error) {
    console.error('Error creating blocked time:', error)
    return NextResponse.json({ error: 'Error creating blocked time' }, { status: 500 })
  }
}