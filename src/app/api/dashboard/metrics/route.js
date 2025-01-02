// src/app/api/dashboard/metrics/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('month');
    
    const start = dateParam ? new Date(dateParam) : new Date();
    start.setDate(1); 
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    // Get all appointments for the month
    const appointments = await prisma.testDrive.findMany({
      where: {
        date: {
          gte: start,
          lt: end
        }
      }
    });

    // Get all vehicles (for total count)
    const totalVehicles = await prisma.vehicle.count();

    // Get active inventory (available vehicles)
    const activeInventory = await prisma.vehicle.count({
      where: {
        status: 'AVAILABLE'
      }
    });

    // Get all sold vehicles
    const soldVehicles = await prisma.vehicle.findMany({
      where: {
        status: 'SOLD',
        soldDate: {
          gte: start,
          lt: end
        }
      },
      include: {
        testDrives: true
      }
    });

    // Calculate metrics
    const totalAppointments = appointments.length;
    const websiteAppointments = appointments.filter(apt => apt.source === 'WEBSITE').length;
    const otherAppointments = totalAppointments - websiteAppointments;
    const cancelledAppointments = appointments.filter(apt => apt.status === 'CANCELLED').length;
    
    const totalVehiclesSold = soldVehicles.length;
    const websiteDriveSales = soldVehicles.filter(vehicle => 
      vehicle.testDrives.some(drive => drive.source === 'WEBSITE')
    ).length;
    const otherSourceSales = totalVehiclesSold - websiteDriveSales;

    // Calculate total revenue from sold vehicles
    const totalRevenue = soldVehicles.reduce(
      (sum, vehicle) => sum + (Number(vehicle.soldPrice) || 0), 
      0
    );

    const totalCustomers = await prisma.customer.count();

    // Save monthly metrics
    await prisma.monthlyMetric.upsert({
      where: {
        month: start
      },
      update: {
        totalAppointments,
        websiteAppointments,
        otherAppointments,
        totalVehiclesSold,
        websiteDriveSales,
        otherSourceSales,
        totalRevenue,
        cancelledAppointments
      },
      create: {
        month: start,
        totalAppointments,
        websiteAppointments,
        otherAppointments,
        totalVehiclesSold,
        websiteDriveSales,
        otherSourceSales,
        totalRevenue,
        cancelledAppointments
      }
    });

    // Return all metrics
    return NextResponse.json({
      totalAppointments,
      websiteAppointments,
      otherAppointments,
      totalVehiclesSold,
      websiteDriveSales,
      otherSourceSales,
      totalRevenue,
      cancelledAppointments,
      activeInventory,
      totalCustomers,
      totalVehicles,
      period: {
        start: start.toISOString(),
        end: end.toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' }, 
      { status: 500 }
    );
  }
}