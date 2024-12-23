// src/app/api/test-drives/[id]/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
  if (!params?.id) {
    return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 })
  }

  try {
    const appointment = await prisma.testDrive.findUnique({
      where: { id: params.id },
      include: { vehicle: true }
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    // Convert to PST
    const pstDate = new Date(appointment.date).toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles'
    })
    appointment.date = new Date(pstDate)

    return NextResponse.json(appointment)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const id = await params.id;
    const data = await request.json();
    const localDate = new Date(data.date);

    const appointment = await prisma.testDrive.update({
      where: { id },
      data: {
        ...data,
        date: localDate
      },
      include: { vehicle: true }
    });

    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!params?.id) {
    return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 })
  }

  try {
    await prisma.testDrive.delete({
      where: { id: params.id }
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 })
  }
}