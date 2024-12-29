// src/app/api/test-drives/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const id = await params.id; // Await the id
    const data = await request.json();
    const date = new Date(data.date);

    const pstDate = new Date(date.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles'
    }));

    // First check if the testDrive exists (good practice)
    const existingTestDrive = await prisma.testDrive.findUnique({
      where: { id }
    });

    if (!existingTestDrive) {
      return NextResponse.json({ error: 'Test drive not found' }, { status: 404 });
    }

    const updateData = {
      vehicle: {
        connect: { id: data.vehicleId }
      },
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      date: pstDate,
      time: data.time,
      status: data.status,
      source: data.source,
      notes: data.notes
    };

    // Only add cancellationReason if status is CANCELLED
    if (data.status === 'CANCELLED' && data.cancellationReason) {
      updateData.cancellationReason = data.cancellationReason;
    }

    const appointment = await prisma.testDrive.update({
      where: { id },
      data: updateData,
      include: {
        vehicle: true
      }
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = await params.id;
    await prisma.testDrive.delete({
      where: { id }
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}