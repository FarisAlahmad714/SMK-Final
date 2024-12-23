// src/app/api/vehicles/[id]/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
  if (!params?.id) {
    return NextResponse.json(
      { error: 'Vehicle ID is required' },
      { status: 400 }
    )
  }

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { 
        id: String(params.id)
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

export async function PUT(request, { params }) {
  if (!params?.id) {
    return NextResponse.json(
      { error: 'Vehicle ID is required' },
      { status: 400 }
    )
  }

  try {
    const data = await request.json()
    
    const vehicle = await prisma.vehicle.update({
      where: { 
        id: String(params.id)
      },
      data: {
        ...data,
        year: data.year ? parseInt(data.year) : undefined,
        price: data.price ? parseFloat(data.price) : undefined,
        mileage: data.mileage ? parseInt(data.mileage) : undefined,
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

export async function DELETE(request, { params }) {
  if (!params?.id) {
    return NextResponse.json(
      { error: 'Vehicle ID is required' },
      { status: 400 }
    )
  }

  try {
    await prisma.vehicle.delete({
      where: { 
        id: String(params.id)
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return NextResponse.json(
      { error: 'Error deleting vehicle' },
      { status: 500 }
    )
  }
}