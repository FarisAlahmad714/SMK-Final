import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const data = await request.json();
    const id = await params.id;

    // First fetch the submission to get customer info
    const existingSubmission = await prisma.vehicleSubmission.findUnique({
      where: { id },
      include: { desiredVehicle: true }
    });

    if (!existingSubmission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Update the submission status
    const submission = await prisma.vehicleSubmission.update({
      where: { id },
      data: {
        status: data.status,
        updatedAt: new Date()
      }
    });

    // If status is being set to APPROVED, create/update customer
    if (data.status === 'APPROVED' && existingSubmission.customerInfo) {
      try {
        const customerInfo = existingSubmission.customerInfo;
        
        // Create or update customer using Prisma directly
        const customer = await prisma.customer.upsert({
          where: {
            email: customerInfo.email
          },
          update: {
            sellTradeRequest: true,
            notes: `Updated from sell/trade request - ${new Date().toLocaleDateString()}`
          },
          create: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            source: 'WEBSITE',
            sellTradeRequest: true,
            notes: `Created from ${existingSubmission.type.toUpperCase()} request - ${new Date().toLocaleDateString()}`
          }
        });
        
        console.log('Customer database updated:', customer);
      } catch (customerError) {
        console.error('Error updating customer database:', customerError);
      }
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission', details: error.message },
      { status: 500 }
    );
  }
}