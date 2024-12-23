// src/app/api/blocked-times/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { startOfMonth, endOfMonth } from 'date-fns'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    const blockedTimes = await prisma.blockedTimeSlot.findMany({
      where: {
        date: {
          gte: startOfMonth(new Date(date)),
          lt: endOfMonth(new Date(date))
        }
      }
    })

    return NextResponse.json(blockedTimes.map(block => ({
      ...block,
      date: block.date.toISOString()
    })))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blocked times' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const date = new Date(data.date)
    
    const pstDate = new Date(date.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles'
    }))

    const blockedTime = await prisma.blockedTimeSlot.create({
      data: {
        date: pstDate,
        startTime: data.startTime,
        endTime: data.endTime,
        reason: data.reason || ''
      }
    })

    return NextResponse.json(blockedTime)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blocked time' }, { status: 500 })
  }
}
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    await prisma.blockedTimeSlot.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blocked time' }, { status: 500 })
  }
}