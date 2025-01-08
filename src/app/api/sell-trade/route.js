// src/app/api/sell-trade/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    // Get query parameters if needed
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build where clause
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const submissions = await prisma.vehicleSubmission.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        // Include any relations if needed
      }
    });
    
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.intent || !data.vin || !data.vehicleDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the submission with all possible fields
    const submission = await prisma.vehicleSubmission.create({
      data: {
        type: data.intent,
        vin: data.vin,
        vehicleDetails: data.vehicleDetails,
        condition: data.condition,
        ownership: data.ownership,
        photoUrls: data.photos?.map(p => p.preview) || [],
        status: 'PENDING_REVIEW',
        notes: data.notes,
        customerInfo: data.customerInfo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        // Include any relations if needed
      }
    });

    // Optional: Send notification emails
    // if (process.env.ENABLE_NOTIFICATIONS === 'true') {
    //   await sendNotificationEmails({...})
    // }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      submission
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting sell/trade request:', error);
    return NextResponse.json(
      { error: 'Failed to submit request', details: error.message },
      { status: 500 }
    );
  }
}