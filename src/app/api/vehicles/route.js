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
        make: data.make,
        model: data.model,
        year: parseInt(data.year),
        price: parseFloat(data.price),
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

    // Existing query parameters
    const sort = searchParams.get('sort')
    const limit = searchParams.get('limit')
    const make = searchParams.get('make')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const year = searchParams.get('year')

    // NEW search parameter
    const search = searchParams.get('search')

    // Build filter conditions
    let whereClause = {}

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

    // If `search` is provided, search by make OR model (case-insensitive)
    if (search) {
      // "OR" so it matches either make OR model
      // Using "contains" + "mode: 'insensitive'" for partial, case-insensitive match
      whereClause.OR = [
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Build ordering based on sort parameter
    let orderBy = { createdAt: 'desc' } // default sorting
    if (sort === 'price-asc') orderBy = { price: 'asc' }
    if (sort === 'price-desc') orderBy = { price: 'desc' }
    if (sort === 'newest') orderBy = { createdAt: 'desc' }
    if (sort === 'oldest') orderBy = { createdAt: 'asc' }

    const vehicles = await prisma.vehicle.findMany({
      where: whereClause,
      orderBy,
      take: limit ? parseInt(limit) : undefined,
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
