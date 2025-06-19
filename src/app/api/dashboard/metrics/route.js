import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('month');
    const viewType = searchParams.get('view') || 'monthly'; // 'monthly' or 'yearly'
    
    if (!dateParam) {
      return NextResponse.json(
        { error: 'Month parameter is required in format yyyy-MM' },
        { status: 400 }
      );
    }

    const date = new Date(dateParam);
    
    let start, end;
    
    if (viewType === 'yearly') {
      // For yearly view, get the entire year
      start = new Date(date.getFullYear(), 0, 1); // January 1st
      end = new Date(date.getFullYear(), 11, 31, 23, 59, 59); // December 31st
    } else {
      // For monthly view, get the specific month
      start = new Date(date.getFullYear(), date.getMonth(), 1);
      end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }

    // Get all appointments for the period
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

    // Get all sold vehicles for the period with their test drives and transactions
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

    // Calculate total vehicles sold for the period
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

    // Get sell/trade metrics for the period
    const periodRequests = await prisma.vehicleSubmission.findMany({
      where: {
        createdAt: {
          gte: start,
          lt: end
        }
      }
    });

    const periodSellRequests = periodRequests.filter(req => req.type === 'sell').length;
    const periodTradeRequests = periodRequests.filter(req => req.type === 'trade').length;

    // All-time totals for sell/trade
    const totalSellRequests = await prisma.vehicleSubmission.count({
      where: { type: 'sell' }
    });

    const totalTradeRequests = await prisma.vehicleSubmission.count({
      where: { type: 'trade' }
    });

    // Status counts for the period
    const statusCounts = await prisma.vehicleSubmission.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: start,
          lt: end
        }
      },
      _count: {
        status: true
      }
    });

    const pendingSellTrade = statusCounts.find(s => s.status === 'PENDING_REVIEW')?._count.status || 0;
    const approvedSellTrade = statusCounts.find(s => s.status === 'APPROVED')?._count.status || 0;
    const rejectedSellTrade = statusCounts.find(s => s.status === 'REJECTED')?._count.status || 0;

    // If this is a monthly view, save/update monthly metrics
    if (viewType === 'monthly') {
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
          totalVehicles,
          monthlySellRequests: periodSellRequests,
          monthlyTradeRequests: periodTradeRequests,
          pendingSellTrade,
          approvedSellTrade,
          rejectedSellTrade,
          totalSellRequests,
          totalTradeRequests
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
          totalVehicles,
          monthlySellRequests: periodSellRequests,
          monthlyTradeRequests: periodTradeRequests,
          pendingSellTrade,
          approvedSellTrade,
          rejectedSellTrade,
          totalSellRequests,
          totalTradeRequests
        }
      });
    }

    // Return all metrics
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
      cancellationReasons: formattedReasons,
      monthlySellRequests: periodSellRequests,
      monthlyTradeRequests: periodTradeRequests,
      totalSellRequests,
      totalTradeRequests,
      pendingSellTrade,
      approvedSellTrade,
      rejectedSellTrade,
      viewType,
      period: viewType === 'yearly' ? `${date.getFullYear()}` : `${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
    });

  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}