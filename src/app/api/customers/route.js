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
    
    // Check if customer already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: data.email }
    });

    if (existingCustomer) {
      // Update existing customer with sell/trade flag if needed
      if (data.sellTradeRequest) {
        const updatedCustomer = await prisma.customer.update({
          where: { id: existingCustomer.id },
          data: {
            sellTradeRequest: true,
            notes: `${existingCustomer.notes || ''}\nUpdated from sell/trade request - ${new Date().toLocaleDateString()}`
          }
        });
        return NextResponse.json(updatedCustomer);
      }
      return NextResponse.json(existingCustomer);
    }

    // Create new customer
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        source: data.source || 'WEBSITE',
        sellTradeRequest: data.sellTradeRequest || false,
        notes: data.notes || `Created from ${data.source || 'WEBSITE'} - ${new Date().toLocaleDateString()}`
      }
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}