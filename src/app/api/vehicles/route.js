// src/app/api/vehicles/route.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST new vehicle
export async function POST(request) {
  try {
    const data = await request.json()

    const vehicle = await prisma.vehicle.create({
      data: {
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
        description: data.description,
        images: data.images || [],
        status: 'AVAILABLE',
      },
    })

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json(
      { error: 'Error creating vehicle' },
      { status: 500 }
    )
  }
}

// GET all vehicles
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const sort = searchParams.get('sort')
    const limit = searchParams.get('limit')
    const make = searchParams.get('make')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const year = searchParams.get('year')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Build filter conditions
    let whereClause = {}

    // Handle status filter - default to AVAILABLE if not specified
    whereClause.status = status || 'AVAILABLE'

    // Add other filters only if they're provided
    if (make) {
      whereClause.make = make
    }

    if (minPrice || maxPrice) {
      whereClause.price = {}
      if (minPrice) whereClause.price.gte = parseFloat(minPrice)
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice)
    }

    if (year) {
      whereClause.year = parseInt(year)
    }

    if (search) {
      whereClause.OR = [
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { stockNumber: { contains: search, mode: 'insensitive' } } // Added stock number search
      ]
    }

    // Optimized ordering logic
    const orderBy = {
      'price-asc': { price: 'asc' },
      'price-desc': { price: 'desc' },
      'newest': { createdAt: 'desc' },
      'oldest': { createdAt: 'asc' }
    }[sort] || { createdAt: 'desc' }; // Default to newest

    // For featured vehicles (used in FeaturedVehicles component)
    // Add image selection if the query is for featured vehicles
    const select = limit && limit <= 3 ? {
      id: true,
      make: true,
      model: true,
      year: true,
      price: true,
      mileage: true,
      transmission: true,
      exteriorColor: true,
      images: true,
      status: true,
      createdAt: true
    } : undefined;

    const vehicles = await prisma.vehicle.findMany({
      where: whereClause,
      orderBy,
      take: limit ? parseInt(limit) : undefined,
      select
    })

    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { error: 'Error fetching vehicles' },
      { status: 500 }
    )
  }
}