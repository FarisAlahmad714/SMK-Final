import { format } from 'date-fns';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendAppointmentEmails } from '@/lib/email';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    let whereClause = {};

    if (start && end) {
      // Convert UTC dates to PST
      const startPST = new Date(start).toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
      });
      const endPST = new Date(end).toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
      });

      whereClause.date = {
        gte: new Date(startPST),
        lte: new Date(endPST),
      };
    }

    const appointments = await prisma.testDrive.findMany({
      where: whereClause,
      include: {
        vehicle: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Convert dates back to local time for client
    const formattedAppointments = appointments.map((apt) => ({
      ...apt,
      date: new Date(apt.date).toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
      }),
    }));

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const date = new Date(data.date);

    // Convert to PST before checking conflicts
    const pstDate = new Date(date.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
    }));

    // Check for blocked times
    const blockedTime = await prisma.blockedTimeSlot.findFirst({
      where: {
        date: pstDate,
        startTime: {
          lte: data.time,
        },
        endTime: {
          gte: data.time,
        },
      },
    });

    if (blockedTime) {
      return NextResponse.json(
        { error: 'This time slot is blocked' },
        { status: 400 },
      );
    }

    // Check for existing appointments
    const existingAppointment = await prisma.testDrive.findFirst({
      where: {
        date: pstDate,
        time: data.time,
        NOT: {
          status: 'CANCELLED',
        },
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 400 },
      );
    }

    const appointment = await prisma.testDrive.create({
      data: {
        vehicleId: data.vehicleId,
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        date: new Date(data.date),
        time: data.time,
        status: 'PENDING',
        notes: data.notes,
        source: data.source // Add this

      },
      include: {
        vehicle: true,
      },
    });

    try {
      await sendAppointmentEmails({
        customerName: data.customerName,
        email: data.email,
        date: format(new Date(appointment.date), 'MMMM d, yyyy'),
        time: data.time,
        vehicle: appointment.vehicle,
      });
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
// src/app/api/test-drives/route.js
// Keep your existing imports and GET/POST methods

export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // Get the ID from the URL
    const data = await request.json();
    
    const pstDate = new Date(data.date).toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles'
    });

    // Prepare the update data
    const updateData = {
      vehicle: {
        connect: { id: data.vehicleId }  // This is how we handle relations in Prisma
      },
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      date: new Date(pstDate),
      time: data.time,
      status: data.status,
      notes: data.notes,
      source: data.source,
      cancellationReason: data.cancellationReason
    };

    const appointment = await prisma.testDrive.update({
      where: {
        id: id
      },
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