// src/app/api/dashboard/metrics/route.js
import { NextResponse } from 'next/server';
import { startOfMonth, endOfMonth } from 'date-fns';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const monthDate = searchParams.get('month') 
      ? new Date(searchParams.get('month'))
      : new Date();

    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);

    // Get total appointments
    const totalAppointments = await prisma.testDrive.count({
      where: {
        date: {
          gte: start,
          lte: end
        }
      }
    });

    // Get website appointments
    const websiteAppointments = await prisma.testDrive.count({
      where: {
        date: {
          gte: start,
          lte: end
        },
        source: 'WEBSITE'
      }
    });

    // Get vehicles sold
    const soldVehicles = await prisma.vehicle.findMany({
      where: {
        status: 'SOLD',
        soldDate: {
          gte: start,
          lte: end
        }
      },
      include: {
        testDrives: true
      }
    });

    // Calculate metrics
    const metrics = {
      totalAppointments,
      websiteAppointments,
      otherAppointments: totalAppointments - websiteAppointments,
      totalVehiclesSold: soldVehicles.length,
      websiteDriveSales: soldVehicles.filter(v => 
        v.testDrives.some(td => td.source === 'WEBSITE')
      ).length,
      otherSourceSales: soldVehicles.filter(v => 
        v.testDrives.some(td => td.source !== 'WEBSITE')
      ).length,
      totalRevenue: soldVehicles.reduce((sum, v) => sum + v.soldPrice, 0),
      cancelledAppointments: await prisma.testDrive.count({
        where: {
          date: {
            gte: start,
            lte: end
          },
          status: 'CANCELLED'
        }
      })
    };

    // Save metrics for historical tracking
    await prisma.monthlyMetric.upsert({
      where: {
        month: start
      },
      update: metrics,
      create: {
        month: start,
        ...metrics
      }
    });

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}