// src/app/api/test-drives/route.js
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
        customer: true
      },
      orderBy: {
        date: 'asc',
      },
    });

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

    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: {
        email: data.email
      }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: data.customerName,
          email: data.email,
          phone: data.phone,
          notes: data.notes || ''
        }
      });
    }

    const appointment = await prisma.testDrive.create({
      data: {
        vehicleId: data.vehicleId,
        customerId: customer.id,
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        date: new Date(data.date),
        time: data.time,
        status: 'PENDING',
        notes: data.notes,
        source: data.source
      },
      include: {
        vehicle: true,
        customer: true
      },
    });

    try {
      await sendAppointmentEmails({
        customerName: data.customerName,
        email: data.email,
        date: format(new Date(appointment.date), 'MMMM d, yyyy'),
        time: data.time,
        vehicle: appointment.vehicle,
        notes: data.notes  // Add this line
      });
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Optionally, handle email sending failures without failing the entire request
    }
    
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const data = await request.json();
    
    const pstDate = new Date(data.date).toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles'
    });

    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: {
        email: data.email
      }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: data.customerName,
          email: data.email,
          phone: data.phone,
          notes: data.notes || ''
        }
      });
    } else {
      // Update existing customer info
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: data.customerName,
          phone: data.phone
        }
      });
    }

    const updateData = {
      vehicle: {
        connect: { id: data.vehicleId }
      },
      customerId: customer.id,
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      date: new Date(pstDate),
      time: data.time,
      status: data.status,
      notes: data.notes,
      source: data.source
    };

    if (data.status === 'CANCELLED' && data.cancellationReason) {
      updateData.cancellationReason = data.cancellationReason;
    }

    const appointment = await prisma.testDrive.update({
      where: {
        id: id
      },
      data: updateData,
      include: {
        vehicle: true,
        customer: true
      }
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}
