// src/app/api/customers/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
      const customers = await prisma.customer.findMany({
        include: {
          testDrives: {
            include: {
              vehicle: true,
              customer: true // Add this to get customer relationship
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
            customerInfo: drive.customer // Add this to include customer details from test drive
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