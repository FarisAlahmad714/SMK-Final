import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        testDrives: {
          include: {
            vehicle: true,
            customer: true
          },
          orderBy: {
            date: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedCustomers = customers.map(customer => {
      const lastTestDrive = customer.testDrives[0];
      return {
        ...customer,
        totalTestDrives: customer.testDrives.length,
        lastVisit: lastTestDrive ? new Date(lastTestDrive.date).toISOString() : null,
        testDrives: customer.testDrives.map(drive => ({
          ...drive,
          date: new Date(drive.date).toLocaleString('en-US', {
            timeZone: 'America/Los_Angeles',
          }),
          customerInfo: drive.customer
        }))
      };
    });

    return NextResponse.json(formattedCustomers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: data.email }
    });

    if (existingCustomer) {
      // Update existing customer
      const updatedCustomer = await prisma.customer.update({
        where: { id: existingCustomer.id },
        data: {
          // Update all fields, not just sellTradeRequest
          name: data.name || existingCustomer.name,
          phone: data.phone || existingCustomer.phone,
          source: data.source || existingCustomer.source,
          sellTradeRequest: true, // Always set to true for sell/trade requests
          notes: existingCustomer.notes 
            ? `${existingCustomer.notes}\nUpdated from sell/trade request - ${new Date().toLocaleDateString()}`
            : `Updated from sell/trade request - ${new Date().toLocaleDateString()}`
        }
      });
      console.log('Updated existing customer:', updatedCustomer);
      return NextResponse.json(updatedCustomer);
    }

    // Create new customer
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        source: data.source || 'WEBSITE',
        sellTradeRequest: true, // Always set to true for new customers from sell/trade
        notes: data.notes || `Created from sell/trade request - ${new Date().toLocaleDateString()}`
      }
    });

    console.log('Created new customer:', customer);
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error in customer operation:', error);
    return NextResponse.json(
      { error: 'Failed to process customer', details: error.message },
      { status: 500 }
    );
  }
}