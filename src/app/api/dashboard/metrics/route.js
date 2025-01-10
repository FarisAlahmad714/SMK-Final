import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('month');
    
    if (!dateParam) {
      return NextResponse.json(
        { error: 'Month parameter is required in format yyyy-MM' },
        { status: 400 }
      );
    }

    const date = new Date(dateParam);
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    // Get all appointments for the month
    const appointments = await prisma.testDrive.findMany({
      where: {
        date: {
          gte: start,
          lt: end
        }
      }
    });

    // Get cancellation reasons breakdown
    const cancellationReasons = await prisma.testDrive.groupBy({
      by: ['cancellationReason'],
      where: {
        status: 'CANCELLED',
        date: {
          gte: start,
          lt: end
        },
        NOT: {
          cancellationReason: null
        }
      },
      _count: {
        cancellationReason: true
      }
    });

    // Format reasons for display
    const formattedReasons = cancellationReasons.map(reason => ({
      reason: reason.cancellationReason.replace(/_/g, ' ').toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      count: reason._count.cancellationReason
    }));

    // Calculate appointment metrics
    const totalAppointments = appointments.length;
    const websiteAppointments = appointments.filter(apt => apt.source === 'WEBSITE').length;
    const otherAppointments = totalAppointments - websiteAppointments;
    const cancelledAppointments = appointments.filter(apt => apt.status === 'CANCELLED').length;

    // Get all vehicles (for total count)
    const totalVehicles = await prisma.vehicle.count();

    // Get active inventory (available vehicles)
    const activeInventory = await prisma.vehicle.count({
      where: {
        status: 'AVAILABLE'
      }
    });

    // Get all sold vehicles for the month with their test drives and transactions
    const soldVehicles = await prisma.vehicle.findMany({
      where: {
        status: 'SOLD',
        soldDate: {
          gte: start,
          lt: end
        }
      },
      include: {
        testDrives: {
          include: {
            customer: true
          }
        },
        transactions: {
          include: {
            customer: true
          }
        }
      }
    });

    // Calculate total vehicles sold for the month
    const totalVehiclesSold = soldVehicles.length;
    
    // Calculate website drive sales
    const websiteDriveSales = soldVehicles.filter(vehicle => {
      const transaction = vehicle.transactions[0];
      if (!transaction) return false;
      
      const relevantTestDrive = vehicle.testDrives.find(td => td.source === 'WEBSITE');
      return relevantTestDrive !== undefined;
    }).length;

    const otherSourceSales = totalVehiclesSold - websiteDriveSales;

    // Calculate financial metrics
    const totalRevenue = soldVehicles.reduce(
      (sum, vehicle) => sum + (Number(vehicle.soldPrice) || 0),
      0
    );

    const totalVehicleCosts = soldVehicles.reduce(
      (sum, vehicle) => sum + (Number(vehicle.cost) || 0),
      0
    );

    const netProfit = totalRevenue - totalVehicleCosts;
    const profitMargin = totalRevenue > 0 
      ? ((netProfit / totalRevenue) * 100)
      : 0;

    // Get total customers
    const totalCustomers = await prisma.customer.count();

    // Save monthly metrics
    await prisma.monthlyMetric.upsert({
      where: { month: start },
      create: {
        month: start,
        totalAppointments,
        websiteAppointments,
        otherAppointments,
        totalVehiclesSold,
        websiteDriveSales,
        otherSourceSales,
        totalRevenue,
        totalVehicleCosts,
        netProfit,
        profitMargin,
        cancelledAppointments,
        activeInventory,
        totalCustomers,
        totalVehicles
      },
      update: {
        totalAppointments,
        websiteAppointments,
        otherAppointments,
        totalVehiclesSold,
        websiteDriveSales,
        otherSourceSales,
        totalRevenue,
        totalVehicleCosts,
        netProfit,
        profitMargin,
        cancelledAppointments,
        activeInventory,
        totalCustomers,
        totalVehicles
      }
    });

    // Return all metrics including cancellation reasons
    return NextResponse.json({
      totalAppointments,
      websiteAppointments,
      otherAppointments,
      totalVehiclesSold,
      websiteDriveSales,
      otherSourceSales,
      totalRevenue,
      totalVehicleCosts,
      netProfit,
      profitMargin,
      cancelledAppointments,
      activeInventory,
      totalCustomers,
      totalVehicles,
      cancellationReasons: formattedReasons
    });

  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}