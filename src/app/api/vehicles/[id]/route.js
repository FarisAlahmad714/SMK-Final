// src/app/api/vehicles/[id]/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, context) {
  const { params } = context;
  const id = await params.id;

  if (!id) {
    return NextResponse.json(
      { error: 'Vehicle ID is required' },
      { status: 400 }
    )
  }

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { 
        id: String(id)
      }
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json(
      { error: 'Error fetching vehicle' },
      { status: 500 }
    )
  }
}

export async function PUT(request, context) {
  const { params } = context;
  const id = await params.id;

  if (!id) {
    return NextResponse.json(
      { error: 'Vehicle ID is required' },
      { status: 400 }
    )
  }

  try {
    const data = await request.json()
    
    // If status is being changed to SOLD, handle special case
    if (data.status === 'SOLD') {
      const vehicle = await prisma.vehicle.update({
        where: { 
          id: String(id)
        },
        data: {
          ...data,
          stockNumber: data.stockNumber,
          vin:data.vin,
          make: data.make,
          model: data.model,
          year: parseInt(data.year),
          price: parseFloat(data.price),
          cost: parseFloat(data.cost),
          mileage: parseInt(data.mileage),
          transmission: data.transmission,
          exteriorColor: data.exteriorColor,
          description: data.description || '',
          images: data.images || [],
          soldPrice: data.soldPrice ? parseFloat(data.soldPrice) : undefined,
          soldDate: data.soldDate || new Date().toISOString()
        }
      })

      // Update monthly metrics
      const month = new Date(vehicle.soldDate)
      month.setDate(1)
      month.setHours(0, 0, 0, 0)

      await prisma.monthlyMetric.upsert({
        where: { month },
        create: {
          month,
          totalVehiclesSold: 1,
          totalRevenue: parseFloat(vehicle.soldPrice) - parseFloat(vehicle.cost),
          totalVehicleCosts: parseFloat(vehicle.cost)
        },
        update: {
          totalVehiclesSold: { increment: 1 },
          totalRevenue: { increment: parseFloat(vehicle.soldPrice) - parseFloat(vehicle.cost) },
          totalVehicleCosts: { increment: parseFloat(vehicle.cost) }
        }
      })

      return NextResponse.json(vehicle)
    }

    // Regular update for non-SOLD status
    const vehicle = await prisma.vehicle.update({
      where: { 
        id: String(id)
      },
      data: {
        ...data,
        stockNumber: data.stockNumber,
        make: data.make,
        model: data.model,
        year: parseInt(data.year),
        price: parseFloat(data.price),
        cost: parseFloat(data.cost),
        mileage: parseInt(data.mileage),
        transmission: data.transmission,
        exteriorColor: data.exteriorColor,
        description: data.description || '',
        images: data.images || []
      }
    })

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return NextResponse.json(
      { error: 'Error updating vehicle' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, context) {
  const { params } = context;
  const id = await params.id;

  if (!id) {
    return NextResponse.json(
      { error: 'Vehicle ID is required' },
      { status: 400 }
    )
  }

  try {
    // Check for related records first
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: String(id) },
      include: {
        testDrives: true,
        transactions: true,
        submissions: true
      }
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Delete related records first to avoid foreign key constraints
    if (vehicle.testDrives.length > 0) {
      await prisma.testDrive.deleteMany({
        where: { vehicleId: String(id) }
      })
    }

    if (vehicle.transactions.length > 0) {
      await prisma.transaction.deleteMany({
        where: { vehicleId: String(id) }
      })
    }

    if (vehicle.submissions.length > 0) {
      await prisma.vehicleSubmission.updateMany({
        where: { desiredVehicleId: String(id) },
        data: { desiredVehicleId: null }
      })
    }

    // Now delete the vehicle
    await prisma.vehicle.delete({
      where: { 
        id: String(id)
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    
    // Provide more specific error messages
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Cannot delete vehicle: it has related records (appointments, transactions, etc.)' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error deleting vehicle', details: error.message },
      { status: 500 }
    )
  }
}